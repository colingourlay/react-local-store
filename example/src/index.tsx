declare var React;
declare var ReactDOM;
import { useLocalStore, LocalStoreProvider, IAction, IState } from '../../src/react-local-store';

function App() {
  const { state, dispatch } = useLocalStore();

  return (
    <div>
      <h1>{state.title}</h1>
      <input
        type="text"
        value={state.title}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: 'title', data: event.target.value })}
      />
    </div>
  );
}

interface IAppState extends IState {
  title: string;
}

const initialState = {
  title: 'react-local-store'
} as IAppState;

const reducer = (state: IAppState, action: IAction): IAppState => {
  switch (action.type) {
    case 'title':
      return { ...state, title: action.data } as IAppState;
    default:
      return state;
  }
};

ReactDOM.render(
  <LocalStoreProvider initialState={initialState} reducer={reducer}>
    <App />
  </LocalStoreProvider>,
  document.getElementById('app')
);
