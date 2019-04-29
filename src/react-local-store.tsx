import * as React from 'react';
const { createContext, useContext, useEffect, useReducer, useState } = React;

const DEFAULT_NAME = '__REACT_LOCAL_STORE__';

export interface IAction {
  type: string;
  payload?: any;
  error?: boolean;
  meta?: object;
}

export interface IState {
  [prop: string]: any;
}

interface IContext {
  state: any;
  dispatch: React.Dispatch<IAction>;
}

interface ILocalStoreProvider {
  children: React.ReactElement;
  name?: string;
  sync?: boolean;
  initialState?: IState;
  reducer: React.Reducer<IState, IAction>;
}

const rIC =
  window['requestIdleCallback'] ||
  function(handler: Function) {
    const startTime = Date.now();

    setTimeout(
      () =>
        handler({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50.0 - (Date.now() - startTime))
        }),
      1
    );
  };

const LocalStoreContexts = {};

export function LocalStoreProvider({
  children,
  name = DEFAULT_NAME,
  sync = true,
  initialState = {},
  reducer
}: ILocalStoreProvider): JSX.Element {
  const [value, setValue] = useState(() => {
    const _value = localStorage.getItem(name) || JSON.stringify(initialState);

    localStorage.setItem(name, _value);

    return _value;
  });
  const state = JSON.parse(value);
  const [, dispatch] = useReducer((state, action) => {
    const nextState = reducer(state, action);
    const nextValue = JSON.stringify(nextState);

    localStorage.setItem(name, nextValue);
    setValue(nextValue);
  }, state);

  if (!LocalStoreContexts[name]) {
    LocalStoreContexts[name] = createContext({} as IContext);
  }

  useEffect(() => {
    if (sync) {
      let hasEnded = false;

      rIC(function poll() {
        const _value = localStorage.getItem(name);

        if (value !== _value) {
          setValue(_value || JSON.stringify(initialState));
        }

        if (!hasEnded) {
          rIC(poll);
        }
      });

      return () => {
        hasEnded = true;
      };
    }
  }, [state]);

  const Provider = LocalStoreContexts[name].Provider;

  return <Provider value={{ state, dispatch }}>{React.Children.only(children)}</Provider>;
}

export function useLocalStore(name?: string): IContext {
  return useContext(LocalStoreContexts[name || DEFAULT_NAME]);
}

// export function createNamedLocalStore(name: string): any[] {
export function createNamedLocalStore(name: string): [(props: ILocalStoreProvider) => JSX.Element, () => IContext] {
  const NamedLocalStoreProvider = (props: ILocalStoreProvider) => <LocalStoreProvider {...props} name={name} />;
  const useNamedLocalStore = () => useLocalStore(name);

  return [NamedLocalStoreProvider, useNamedLocalStore];
}
