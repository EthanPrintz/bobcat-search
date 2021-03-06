import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import "./variables.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import createStore from "./redux/createStore";
import { loadState, saveState } from "./localstorage";
// import { act } from "react-dom/test-utils";

const initialState = loadState();
const store = createStore(initialState);
store.subscribe(() => saveState(store.getState()));

const queryClient = new QueryClient();

render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
