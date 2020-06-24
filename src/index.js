import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import './index.css';
import './variables.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from './reducers';
import { loadState, saveState } from './localstorage';
// import { act } from "react-dom/test-utils";

// Get existing state from local storage if available
const initialState = loadState();

// Create redux store
const store = createStore(rootReducer, initialState, applyMiddleware(logger));

// Subscribe to future state changes, then store to local storage when called
store.subscribe(() => saveState(store.getState()));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
