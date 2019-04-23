import * as React from 'react';
const { createContext, useContext, useReducer, useState } = React;

const DEFAULT_KEY = '__REACT_LOCAL_STORE__';

export interface IAction {
  type: string;
  data?: any;
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
  key?: string;
  initialState?: IState;
  reducer: React.Reducer<IState, IAction>;
}

const LocalStoreContext = createContext({} as IContext);

export function LocalStoreProvider({ children, key = DEFAULT_KEY, initialState = {}, reducer }: ILocalStoreProvider) {
  const [value, setValue] = useState(() => {
    const _value = localStorage.getItem(key) || JSON.stringify(initialState);

    localStorage.setItem(key, _value);

    return _value;
  });
  const state = JSON.parse(value);
  const [, dispatch] = useReducer((state, action) => {
    const nextState = reducer(state, action);
    const nextValue = JSON.stringify(nextState);

    localStorage.setItem(key, nextValue);
    setValue(nextValue);
  }, state);

  return (
    <LocalStoreContext.Provider value={{ state, dispatch }}>{React.Children.only(children)}</LocalStoreContext.Provider>
  );
}

export const LocalStoreConsumer = LocalStoreContext.Consumer;

export function useLocalStore(): IContext {
  return useContext(LocalStoreContext);
}
