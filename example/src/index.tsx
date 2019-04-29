declare var React;
declare var ReactDOM;
import { ACTION_TYPES, LocalStoreProvider, useLocalStore } from './store';

function App() {
  const { state, dispatch } = useLocalStore();

  return (
    <div>
      <h1>{state.title}</h1>
      <input
        type="text"
        value={state.title}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          dispatch({ type: ACTION_TYPES.UPDATE_TITLE, payload: event.target.value })
        }
      />
    </div>
  );
}

ReactDOM.render(
  <LocalStoreProvider>
    <App />
  </LocalStoreProvider>,
  document.getElementById('app')
);
