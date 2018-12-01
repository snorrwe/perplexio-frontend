import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import { receiveConfig , receiveUserInfo} from "./actions";
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
    let config = null;
    if (response.status === 200) {
      config = response.data;
      config.baseUrl = baseUrl;
      store.dispatch(receiveConfig(config));
    }
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById("root") as HTMLElement
    );
    registerServiceWorker();
    return config;
  })
  .then(config => {
    return axios
      .get(config.apiBaseUrl + "/userinfo", {
        withCredentials: true
      })
      .then(response => {
          store.dispatch(receiveUserInfo(response.data));
      })
      .catch(error => {
        if (error.status !== 404) {
          console.error("Error while retrieving userinfo", error);
        }
      });
  })
  .catch(error => {
    console.error("Failed to load config!", error);
    return Promise.reject(error);
  });
