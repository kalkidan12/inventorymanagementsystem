// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { authApi } from "./api/authApiSlice";
import { productApi } from "./api/productApiSlice";
import { dashboardApi } from "./api/dashboardApiSlice";
import { salesApi } from "./api/salesApiSlice";
import { userApi } from "./api/userApiSlice";
import authReducer from "./slices/authSlice";
import posReducer from "./slices/posSlice";
import { adminApi } from "./api/adminApiSlice";
import { messageApi } from "./api/messageApiSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [salesApi.reducerPath]: salesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    auth: authReducer,
    pos: posReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware,
      productApi.middleware,
      dashboardApi.middleware,
      salesApi.middleware,
      userApi.middleware,
      adminApi.middleware,
      messageApi.middleware
    ),
});

setupListeners(store.dispatch);
