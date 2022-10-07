import { createLocalStore } from '../../src/react-local-store';

const ACTION_TYPES = { UPDATE_TITLE: 'UPDATE_TITLE' };

export interface AppState {
  title: string;
}

const [LocalStoreProvider, useLocalStore] = createLocalStore<AppState>({
  initialState: {
    title: 'react-local-store'
  },
  reducer: (prevState, action) => {
    switch (action.type) {
      case ACTION_TYPES.UPDATE_TITLE:
        return { ...prevState, title: action.payload as string };
      default:
        return { ...prevState };
    }
  }
});

export { ACTION_TYPES, LocalStoreProvider, useLocalStore };
