import * as React from 'react';
const { createContext, useContext, useReducer, useState } = React;

const DEFAULT_NAME = '__REACT_LOCAL_STORE__';

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
  name?: string;
  initialState?: IState;
  reducer: React.Reducer<IState, IAction>;
}

const LocalStoreContexts = {};

export function LocalStoreProvider({ children, name = DEFAULT_NAME, initialState = {}, reducer }: ILocalStoreProvider) {
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

  const Provider = LocalStoreContexts[name].Provider;

  return <Provider value={{ state, dispatch }}>{React.Children.only(children)}</Provider>;
}

export function useLocalStore(name = DEFAULT_NAME): IContext {
  return useContext(LocalStoreContexts[name]);
}
