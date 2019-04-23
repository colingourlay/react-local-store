<h1 align="center"><code>react-local-store</code></h1>
<p align="center"><code>localStorage</code>-persisted context for your React apps, accessible through Hooks</p>
<p align="center">
  <a href="https://www.npmjs.com/package/react-local-store"><img alt="NPM latest published version" src="https://img.shields.io/npm/v/react-local-store.svg?style=flat-square&color=f0f"></a> <img alt="Formats: CommonJS, ECMAScript Modules" src="https://img.shields.io/badge/formats-cjs%2C%20esm-f0f.svg?style=flat-square"> <img alt="GZip size" src="https://img.shields.io/badge/gzip-560%20B-f0f.svg?style=flat-square"> <sup>🤭 — <em>OMG, so tiny!</em></sup> 
</p>

## Reasons to not use this

- You're using a pre-[Hooks](https://reactjs.org/docs/hooks-intro.html) version of React
- You'll be using state that can't be serialised to JSON (i.e. functions)
- You want to access state outside of functional components
- You don't want to use a reducer to modify state

Alright, still with me? great.

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
          dispatch({ type: 'UPDATE_TITLE', data: event.target.value })
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

Want to take this code for a spin right now? Glitch has got you covered. Hit that button down below to fork the example above and have a play around:

<p><a href="https://glitch.com/edit/#!/remix/react-local-store-getting-started">
  <img src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fremix%402x.png?1513093958726" alt="remix this" height="33">
</a></p>

Once you're in there, give this a try:

- Change the value in the field and see that the heading also updates.
- Refresh the page and see that your state was persisted.
- Open the app in another tab to see that its context is not only shared, but synchronised with the current tab.

**Note**: By default your state will be persisted to `localStorage` under the key: `__REACT_LOCAL_STORE__`. If you want multiple stores, you'll need to name them:

- Set the a `name` prop on the provider:
  - `<LocalStoreProvider name="xyz" initialState={...} reducer={...} />`
- Access it by passing the same name as an argument to the hook:
  - `useLocalStore('xyz')`
