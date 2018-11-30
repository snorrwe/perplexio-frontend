import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import { receiveConfig } from "./actions";
import App from "./containers/App";
import "./index.css";
import reducer from "./reducers";
import registerServiceWorker from "./registerServiceWorker";

const middleware = [thunk];
if (process.env.NODE_ENV !== "production") {
  middleware.push(createLogger() as any);
}

const store = createStore(reducer, applyMiddleware(...middleware));
let local = window.location;
let baseUrl =
  local.protocol + "//" + local.host + "/" + local.pathname.split("/")[1];
axios
  .get(baseUrl + "/config.json")
  .then(response => {
    if (response.status === 200) {
      store.dispatch(receiveConfig(response.data));
    }
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
    registerServiceWorker();
  })
  .catch(error => {
    console.error("Failed to load config!", error);
    return Promise.reject(error);
  });
