
import React from "react";
import ReactDOM from "react-dom/client";

// Provider is a special Redux component that:
// - Wraps your entire app
// - Makes the Redux store available to ALL components
import { Provider } from "react-redux";
// Import the global Redux store we created
// This store contains:
// - reducers
// - state
// - middleware
import { store } from "./app/store";

import App from "./App";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>
    {/* 
      🔥 Provider store={store}:
      This component makes the Redux store available to all nested components.
      Without this, useDispatch() and useSelector() would NOT work.
    */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
