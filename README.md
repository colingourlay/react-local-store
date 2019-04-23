<h1 align="center"><code>react-local-store</code></h1>
<p align="center"><code>localStorage</code>-persisted context for your React apps, with a reducer-style Hook interface</p>

## Getting started

```sh
npm install react-local-store
```

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { useLocalStore, LocalStoreProvider } from 'react-local-store';

function App() {
  const { state, dispatch } = useLocalStore();

  return (
    <div>
      <h1>{state.title}</h1>
      <input
        type="text"
        value={state.title}
        onChange={e => dispatch({ type: 'title', data: e.target.value })}
      />
    </div>
  );
}

ReactDOM.render(
  <LocalStoreProvider
    initialState={{
      title: 'react-local-store'
    }}
    reducer={(state, action) => {
      switch (action.type) {
        case 'title':
          return { ...state, title: action.data };
        default:
          return state;
      }
    }}
  >
    <App />
  </LocalStoreProvider>,
  document.getElementById('root')
);
```
