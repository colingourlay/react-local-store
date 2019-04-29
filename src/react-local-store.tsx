import * as React from 'react';
const { createContext, useContext, useEffect, useState } = React;

const DEFAULT_NAME = '__REACT_LOCAL_STORE__';
const DEFAULT_REDUCER = (state: {}) => ({ ...state });

export interface IAction {
  type: string;
  payload?: any;
  error?: boolean;
  meta?: object;
}

export interface IState {
  [prop: string]: any;
}

export type Context = [any, React.Dispatch<IAction>];

export interface ILocalStoreProvider {
  children?: React.ReactElement;
  name?: string;
  sync?: boolean;
  initialState?: IState;
  reducer?: React.Reducer<IState, IAction>;
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
  reducer = DEFAULT_REDUCER
}: ILocalStoreProvider): JSX.Element {
  const [value, setValue] = useState(() => {
    const _value = localStorage.getItem(name) || JSON.stringify(initialState);

    localStorage.setItem(name, _value);

    return _value;
  });
  const state = JSON.parse(value);
  const dispatch = (action: IAction) => {
    const nextState = reducer(state, action);
    const nextValue = JSON.stringify(nextState);

    localStorage.setItem(name, nextValue);
    setValue(nextValue);
  };

  if (!LocalStoreContexts[name]) {
    LocalStoreContexts[name] = createContext(undefined);
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

  return <Provider value={[state, dispatch]}>{React.Children.only(children)}</Provider>;
}

export function useLocalStore(name?: string): Context {
  return useContext(LocalStoreContexts[name || DEFAULT_NAME]);
}

export function createLocalStore(
  presetProps: ILocalStoreProvider | { name?: string } = {}
): [(props: ILocalStoreProvider) => JSX.Element, () => Context] {
  const PresetLocalStoreProvider = (props: ILocalStoreProvider) => <LocalStoreProvider {...props} {...presetProps} />;
  const usePresetLocalStore = () => useLocalStore(presetProps.name);

  return [PresetLocalStoreProvider, usePresetLocalStore];
}
