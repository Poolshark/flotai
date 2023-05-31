import { atom } from "./flotai";

/**
 * Atom of type `number`.
 */
export const numberAtom = atom(0);

/**
 * Atom of type `string`.
 */
export const textAtom = atom("Hello Wizards");



/**
 * Just for data mocking
 * @param ms 
 * @returns 
 */
export const mockServer = async  <T>(ms?: number, type?: "" | "Refetch"): Promise<T> => {
  if (ms) {
    const timeout = () => new Promise(resolve => setTimeout(resolve, ms));
    await timeout();
  }

  const data = await fetch(`/mockData${type || ""}.json`)
  return await data.json();
}

/**
 * Asynchronous Atom.
 */
export const asyncAtom = atom(() => mockServer(1000, ""), { refetchIntervall: 1000 });
//export const asyncAtom = atom(() => mockServer<unknown>(1000, ""));