<h1 align="center"><pre>react-local-store</pre></h1>
<p align="center"><code>localStorage</code>-persisted context for your React apps, accessible through Hooks</p>
<p align="center">
  <a href="https://www.npmjs.com/package/react-local-store"><img alt="NPM latest published version" src="https://img.shields.io/npm/v/react-local-store.svg?style=flat-square&color=blue"></a> <img alt="Formats: CommonJS, ECMAScript Modules" src="https://img.shields.io/badge/formats-cjs%2C%20esm-blue.svg?style=flat-square"> <img alt="GZip size" src="https://img.shields.io/badge/gzip-1%20kB-blue.svg?style=flat-square">&nbsp;<sup>🤭&nbsp;—&nbsp;<em>OMG,&nbsp;so&nbsp;tiny!</em></sup> 
</p>

## Reasons to not use this

- You're using a pre-[Hooks](https://reactjs.org/docs/hooks-intro.html) version of React (`<16.8`)
- You'll be using state that can't be serialised to JSON (i.e. functions)
- You update state often in short time periods (`localStorage` is 😴)
- You want to access state outside of functional components
- You don't want to use a [reducer](https://reactjs.org/docs/hooks-reference.html#usereducer) to modify state (check out [context-storage](https://github.com/leonardodino/context-storage) instead)

Alright, still with me? great…

## Getting started

```sh
npm install react-local-store
```

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { LocalStoreProvider, useLocalStore } from 'react-local-store';

function App() {
  const { state, dispatch } = useLocalStore();

  return (
    <div>
      <h1>{state.title}</h1>
      <input
        type="text"
        defaultValue={state.title}
        onChange={event =>
          dispatch({ type: 'UPDATE_TITLE', payload: event.target.value })
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
        case 'UPDATE_TITLE':
          return { ...state, title: action.payload };
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

Want to take this code for a spin right now? Glitch has got you covered. Hit that button down below to fork the example above and have a play around:

<p><a href="https://glitch.com/edit/#!/remix/react-local-store-getting-started">
  <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix this" height="33">
</a></p>

Once you're in there, give this a try:

- Change the value in the field and see that the heading also updates.
- Refresh the page and see that your state was persisted.
- Open the app in another tab to see that its context is not only shared, but synchronised with the current tab.

## API

### `<LocalStoreProvider />` and `useLocalStore()`

Provide global state to your entire app, enabled React's context API, then access (and update) it using Hooks

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { LocalStoreProvider, useLocalStore } from 'react-local-store';

const ACTION_TYPES = { INCREMENT: 'INCREMENT' };

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.INCREMENT:
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}

function App() {
  const { state, dispatch } = useLocalStore();

  return (
    <button onClick={() => dispatch({ type: ACTION_TYPES.INCREMENT })}>
      {state.count}
    </button>
  );
}

ReactDOM.render(
  <LocalStoreProvider initialState={{ count: 0 }} reducer={reducer}>
    <App />
  </LocalStoreProvider>,
  document.getElementById('root')
);
```

#### Synced global state

By default, global state change listeners are used (using `window.requestIdleCallback` or a simple polyfill) so that changes to your store is trigger a re-render in every app instance, including those in other browser tabs. If you want to disable the listener, set the `sync` prop to `false` in your Provider:

```jsx
<LocalStoreProvider sync={false}>
  <App />
</LocalStoreProvider>
```

#### Custom store names

By default your state will be persisted to `localStorage` under the key: `__REACT_LOCAL_STORE__`. If you want to have multiple stores (or use something other than the default), you'll need to name them with `LocalStoreProvider`'s `name` prop and `useLocalStore`'s optional argument:

```jsx
/* ... */

function App() {
  const { state, dispatch } = useLocalStore('custom-store-name');

  /* ... */
}

ReactDOM.render(
  <LocalStoreProvider name="custom-store-name" initialState={...} reducer={...}>
    <App />
  </LocalStoreProvider>,
  document.getElementById('root')
);
```

### `createLocalStore(props)`

Writing custom store names across various components in different files can start to get a bit tedious, and isn't very DRY, so you have the option of creating your own preset Providers and Hooks, with the `createLocalStore` factory.

In `store.js`:

```jsx
import { createLocalStore } from 'react-local-store';

const ACTION_TYPES = { INCREMENT: 'INCREMENT' };

function reducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.INCREMENT:
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}

const [LocalStoreProvider, useLocalStore] = createLocalStore({
  name: 'custom-store-name',
  initialState: { count: 0 },
  reducer
});

export { ACTION_TYPES, LocalStoreProvider, useLocalStore };
```

In `index.js`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { ACTION_TYPES, LocalStoreProvider, useLocalStore } from './store';

function App() {
  const { state, dispatch } = useLocalStore();

  return (
    <button onClick={() => dispatch({ type: ACTION_TYPES.INCREMENT })}>
      {state.count}
    </button>
  );
}

ReactDOM.render(
  <LocalStoreProvider>
    <App />
  </LocalStoreProvider>,
  document.getElementById('root')
);
```

Any props you omit when creating your custom store will be expected when you use it. For example, you can create a custom store, only specifying the `name`, and still supply your own `initialState`, `reducer` and (optionally) `sync` props when creating Provider instances.
