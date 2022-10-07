declare const React;
declare const ReactDOM;
import { ACTION_TYPES, LocalStoreProvider, useLocalStore } from './store';

function App() {
  const [state, dispatch] = useLocalStore();

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

ReactDOM.createRoot(document.getElementById('app') as HTMLDivElement).render(
  <LocalStoreProvider>
    <App />
  </LocalStoreProvider>
);
