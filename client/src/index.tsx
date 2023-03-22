import React from "react";
import ReactDOM from "react-dom";
// import "./index.css";
import 'react-notifications/lib/notifications.css';
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux-store";
import { NotificationContainer } from "react-notifications";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
    <NotificationContainer />
  </React.StrictMode>,
  document.getElementById("root")
);
