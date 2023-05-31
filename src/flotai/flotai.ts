import { isEqual } from "lodash";
import type { Atom, AtomGetter } from "./types";
import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * --------------------------
 *  NON-ASYNC ATOM
 * --------------------------
 * A non-asynchronous atom.
 * 
 * @param initialValue The initial value of the atom.
 * @returns 
 */
export function atom<T>(initialValue: T | null): Atom<T>

/**
 * --------------------------
 *  ASYNC ATOM
 * --------------------------
 * An asynchronous atom.
 * 
 * @param initialValue  The initial *getter* fuction of an atom.
 * @param options       Asnyc options (eg. refetchIntervall).
 */
export function atom<T>(initialValue: AtomGetter<T> | null, options?: { refetchIntervall?: number }): Atom<T>

// ATOM
export function atom<T>(initialValue: T | AtomGetter<T> | null, options?: { refetchIntervall?: number }): Atom<T> {

  // Check if the input is an Atom getter. In case it is, the initial value is
  // set to `null`, if the initial value is anything else than a function, we 
  // set this value.
  let value = initialValue instanceof Function ? null : initialValue;
  
  // Construct subscriber Set
  // I use a set becasue this makes sure that the same subscriber
  // only exists once.
  const subscribers = new Set<(newValue: T | null) => void>();


  const get = <TTarget>(atom: Atom<TTarget>) => {
    let targetvalue = atom.get();

    // Subscribe to local store
    atom.subscribe((newValue) => {

      // Avoid infinite loop
      if (targetvalue === newValue) return
      
      targetvalue = newValue;

      // Compute the value from the atom getter
      computeValue(initialValue);

      // Subscribe to global store
      subscribers.forEach(subscriber => subscriber(value));
    })

    return targetvalue;
  }

  // Unfortunately `T | () => T` is curremtly not possible in TS --> https:ithub.com/microsoft/TypeScript/issues/37663
  // Thus we a coercing this to a getter with the `get` function as parameter.
  const computeValue = async (initialValue: T | AtomGetter<T> | null) => {
    let tmpValue = initialValue instanceof Function ? (initialValue as AtomGetter<T>)(get): initialValue;

    if (tmpValue && tmpValue instanceof Promise<T>) {

      console.log("Yes, I'm fetching  🫶")

      // Do not rerender if data hasn't changed.
      const data = await tmpValue;
      if (isEqual(data, value)) {
        return
      }

      // Set the value to the new data
      value = data;

      // Inform the subscribers that we have new data.
      subscribers.forEach(subscriber => subscriber(data));
    }
  }

  // If we are dealing with a fetch, and refetchIntervall has been set.
  if (initialValue instanceof Function && options?.refetchIntervall) {
    const refetch = () => {
      let to = setTimeout(() => {
        computeValue(initialValue);
        refetch();
        clearTimeout(to);
      }, options.refetchIntervall);
    }
    refetch();
  } 
   // Simply compute the value of the atom.
   // Technically `computeValue` is a Promise. However, since in
   // this case we're not dealing with a fetch request, the Promise
   // should get resolved immidately. 
  else {
    computeValue(initialValue);
  }

  return {
    get: () => value,
    set: (newValue) => {
      value = newValue;
      subscribers.forEach(subscriber => subscriber(value));
    },
    subscribe: (callback) => {
      // subscribe
      subscribers.add(callback);
      // unsubscribe
      return () => subscribers.delete(callback)
    }
  }
}


/**
 * Returns Atom getter and setter.
 * 
 * The hook `useSyncExternalStore` basically replaces all this
 * 
 * ```
 * const [value, setValue] = useState(atom.get());
 *   useEffect(() => {
 *   const unsubscribe = atom.subscribe(setValue);
 * 
 *   Call cleaup function to not pollute the store
 *   return () => {
 *     unsubscribe();
 *   }
 * }, [atom]);
 * 
 * return [value, atom.set] as [value: T, setValue: (newValue: T) => void];
 * ```
 * 
 * @param atom 
 * @returns 
 */
export const useAtom = <T>(atom: Atom<T>) => {
  return [useSyncExternalStore(
    atom.subscribe,
    atom.get,
  ), atom.set] as [value: T, setValue: (newValue: T) => void];
}

/**
 * Returns the Atom value only.
 * 
 * @param atom 
 * @returns 
 */
export const useAtomValue = <T>(atom: Atom<T>) => {
  return useSyncExternalStore(atom.subscribe, atom.get);
}

/**
 * Returns the Atom setter only.
 * 
 * @param atom 
 * @returns 
 */
export const useAtomSet = <T>(atom: Atom<T>) => {
  return atom.set;
}

/**
 * A wrapper hook to force a rerender if the data of an async atom
 * has been changed on a refetch.
 * 
 * @param atom 
 * @returns 
 */
export const useAsyncAtom = <T>(atom: Atom<T>) => {
  const data = useAtomValue(atom);
  const [refetch, setRefetch] = useState<T | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setRefetch(await data);
    }
  fetchData();
  }, [data])

  return refetch;
}