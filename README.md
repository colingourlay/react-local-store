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
        onChange={event =>
          dispatch({ type: 'title', data: event.target.value })
        }
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

<p><a href="https://glitch.com/edit/#!/remix/react-local-store-getting-started">
  <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix this" height="33">
</a></p>

Now try this:

- Change the value in the field and see that the heading also updates.
- Refresh the page and see that your state was persisted.

**Note**: By default your state will be persisted to `localStorage` under the key: `__REACT_LOCAL_STORE__`. If you want multiple stores, yoi'll need to name them:

- Set the a `name` prop on the provider:
  - `<LocalStoreProvider name="xyz" initialState={...} reducer={...} />`
- Access it by passing the same name as an argument to the hook:
  - `useLocalState('xyz')`
