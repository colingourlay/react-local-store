import { IAction, IState, createLocalStore } from '../../src/react-local-store';

const ACTION_TYPES = { UPDATE_TITLE: 'UPDATE_TITLE' };

interface IAppState extends IState {
  title: string;
}

const initialState = {
  title: 'react-local-store'
} as IAppState;

const reducer = (state: IAppState, action: IAction): IAppState => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_TITLE:
      return { ...state, title: action.payload } as IAppState;
    default:
      return state;
  }
};

const [LocalStoreProvider, useLocalStore] = createLocalStore({ initialState, reducer });

export { ACTION_TYPES, LocalStoreProvider, useLocalStore };
