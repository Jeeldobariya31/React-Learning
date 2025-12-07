// Importing configureStore from Redux Toolkit.
// This function creates the global Redux store.
// It automatically sets up:
// - Redux DevTools support
// - Good default middlewares (like thunk)
// - Better performance & error checking
import { configureStore } from "@reduxjs/toolkit";

// Importing our todo reducer from the slice file.
// A "slice" = state + reducers for a specific feature.
import todoReducer from "../features/Todo/todoSlice";

// ------------------------------------------------------
// 🔥 STORE SETUP
// This is the **global state container** for your app.
// All components read/write data ONLY through this store.
// ------------------------------------------------------

// configureStore() expects an object with a "reducer" field.
// The reducer can be:
//   1️⃣ a single reducer (your case right now)
//   2️⃣ multiple reducers combined as an object (when app grows)
export const store = configureStore({
  /*
    reducer: todoReducer

    Means:
    - The entire Redux state tree is managed by todoReducer.
    - State shape becomes:
        {
          todos: [...],   // from todoSlice initialState
        }

    If you someday add more slices (e.g., authSlice, themeSlice), you would write:
        reducer: {
          todos: todoReducer,
          auth: authReducer,
          theme: themeReducer,
        }
  */
  reducer: todoReducer,
});
