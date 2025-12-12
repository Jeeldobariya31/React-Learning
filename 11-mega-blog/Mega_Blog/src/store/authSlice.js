// 📁 src/store/authSlice.js
// 🔐 Redux Authentication Slice
// Manages: login, logout, user state persistence, updates

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false, // 🔘 false = logged out, true = logged in
  userData: null, // 👤 full user object from Appwrite
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔐 USER LOGIN
    login(state, action) {
      state.status = true;
      state.userData = action.payload; // Appwrite user object
    },

    // 🚪 USER LOGOUT
    logout(state) {
      state.status = false;
      state.userData = null;
    },

    // 🔄 UPDATE USER (name change, email update, etc.)
    updateUser(state, action) {
      if (state.status && state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
  },
});

// Export actions
export const { login, logout, updateUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;
