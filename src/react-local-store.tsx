import type { Dispatch, ReactElement, Reducer } from 'react';
import * as React from 'react';
const { Children, createContext, useContext, useEffect, useState } = React;

export interface IAction {
  type: string;
  payload?: unknown;
  error?: boolean;
  meta?: object;
}

export type LocalStoreReducer<S> = Reducer<S, IAction>

export type LocalStoreContext<S> = [S, Dispatch<IAction>];

export interface ILocalStoreProvider<S> {
  children?: ReactElement;
  name?: string;
  sync?: boolean;
  initialState?: S;
  reducer?: LocalStoreReducer<S>;
}

const DEFAULT_NAME = '__REACT_LOCAL_STORE__';

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

export function LocalStoreProvider<S extends object>({
  children,
  name = DEFAULT_NAME,
  sync = true,
  initialState = {} as S,
  reducer
}: ILocalStoreProvider<S>): JSX.Element {
  const [value, setValue] = useState(() => {
    const _value = localStorage.getItem(name) || JSON.stringify(initialState);

    localStorage.setItem(name, _value);

    return _value;
  });
  const state = JSON.parse(value) as S;
  const dispatch = (action: IAction) => {
    const nextState = reducer ? reducer(state, action) : { ...state };
    const nextValue = JSON.stringify(nextState);

    localStorage.setItem(name, nextValue);
    setValue(nextValue);
  };

  if (!LocalStoreContexts[name]) {
    LocalStoreContexts[name] = createContext<S>(initialState);
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

  return <Provider value={[state, dispatch]}>{Children.only(children)}</Provider>;
}

export function useLocalStore<S>(name?: string): LocalStoreContext<S> {
  return useContext(LocalStoreContexts[name || DEFAULT_NAME]);
}

export function createLocalStore<S extends object>(
  presetProps: ILocalStoreProvider<S> = {}
): [(props: ILocalStoreProvider<S>) => JSX.Element, () => LocalStoreContext<S>] {
  const PresetLocalStoreProvider = (props: ILocalStoreProvider<S>) => <LocalStoreProvider {...props} {...presetProps} />;
  const usePresetLocalStore = () => useLocalStore<S>(presetProps.name);

  return [PresetLocalStoreProvider, usePresetLocalStore];
}
