// src/store/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/store/api/authApiSlice";

const getInitialState = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    return {
      user: user ? JSON.parse(user) : null,
      accessToken: accessToken && accessToken !== "null" ? accessToken : null,
    };
  }
  return { user: null, accessToken: null };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("selectedOption");
      localStorage.removeItem("accessToken");
    },
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken;
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.user = payload.user;
        localStorage.setItem("user", JSON.stringify(payload.user));
        localStorage.setItem("accessToken", payload.accessToken);
      }
    );
    builder.addMatcher(
      authApi.endpoints.verifyEmail.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.user = payload.user;
        localStorage.setItem("user", JSON.stringify(payload.user));
        localStorage.setItem("accessToken", payload.accessToken);
      }
    );
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
