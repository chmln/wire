import { SubscribeFn, Immutable } from "../common";

export namespace Input {
  export type Actions<S> = Record<
    string,
    | ((state: Immutable<S>, ...args: never[]) => Immutable<S>)
  >;

  export type Thunks = Record<
    string,
    (...args: never[]) => void | Promise<void>
  >;

  export type StoreWithState<S> = {
    actions: <A extends Actions<S>>(actions: A) => Output.BasicStore<S, A>;
  };
}

export namespace Output {
  export type Actions<S, A extends Input.Actions<S>> = {
    [k in keyof A]: A[k] extends (
      s: Immutable<S>,
      ...args: infer Args
    ) => Immutable<S>
      ? (...args: Args) => void
      : never;
  };

  export type Thunks<T extends Input.Thunks> = T;

  export type BasicStore<S, A extends Input.Actions<S>> = {
    state: Immutable<S>;
    subscribe: (f: SubscribeFn) => () => void;
    actions: Actions<S, A>;
    thunks: <T extends Input.Thunks>(thunks: T) => StoreWithThunks<S, A, T>;
  };

  export type StoreWithThunks<
    S,
    A extends Input.Actions<S>,
    T extends Input.Thunks
  > = Omit<BasicStore<S, A>, "thunks"> & {
    thunks: Thunks<T>;
  };
}
