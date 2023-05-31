/**
 * The main Atom type.
 */
export interface Atom<T> {

  // The getter function
  get: () => T | null

  // The setter function
  set: (newValue: T | null) => void

  // The () => void is used as an unsubscribe function
  // to cleaup the store once a value has been set by
  // a subscriber.
  subscribe: (callback: (newValue: T | null) => void) => () => void
}

/**
 * The Atom getter type.
 */
export type AtomGetter<T> = <TTarget>(get: (atom: Atom<TTarget>) => TTarget | null) => T | null