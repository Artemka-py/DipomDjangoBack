import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import reducer from "./store/reducers/auth";
import BugBattle from "bugbattle";

BugBattle.initialize(
  "zLjvOGurHVEfdYBvQrXAEBTAd6Cl2I0T",
  BugBattle.FEEDBACK_BUTTON
);
BugBattle.enableCrashDetector(true);
BugBattle.setMainColor("#3c94e5");

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  reducer,
  composeEnhances(applyMiddleware(thunk))
);

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

reportWebVitals();
