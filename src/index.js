import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import "./index.css";
import "./variables.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import rootReducer from "./reducers";
// import { act } from "react-dom/test-utils";

// Use Local Storage to save state
const initialState = localStorage.getItem("bobcat-store")
  ? JSON.parse(localStorage.getItem("bobcat-store"))
  : { wishlist: {}, scheduled: {} };

const store = createStore(rootReducer, initialState, applyMiddleware(logger));

// eslint-disable-next-line
const saveState = () =>
  localStorage.setItem("bobcat-store", JSON.stringify(store.getState()));

// store.subscribe(saveState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
