// 📁 src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // ✅ import your slice reducer

const store = configureStore({
  reducer: {
    auth: authReducer, // ✅ Add reducer here
  },
});

export default store;
