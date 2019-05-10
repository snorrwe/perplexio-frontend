import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import App from "./containers/App";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import "./index.css";

let local = window.location;
let baseUrl =
  local.protocol + "//" + local.host + "/" + local.pathname.split("/")[1];

axios
  .get(baseUrl + "/config.json")
  .then(response => {
    let config: any = null;
    if (response.status === 200) {
      config = response.data;
      if (config == null) {
        config = {};
      }
      config.baseUrl = baseUrl;
    }
    const client = new ApolloClient({
      uri: config.apiBaseUrl + "/graphql",
      credentials: "include"
    });
    ReactDOM.render(
      <ApolloProvider client={client}>
        <App config={config} />
      </ApolloProvider>,
      document.getElementById("root") as HTMLElement
    );
    registerServiceWorker();
    return config;
  })
  .catch(error => {
    console.error("Failed to load config!", error);
    return Promise.reject(error);
  });
