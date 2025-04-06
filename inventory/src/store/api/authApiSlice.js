import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "/api/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: "/api/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/api/auth/reset-password",
        method: "POST",
        body: { token, newPassword },
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: `/api/auth/verify-email/?token=${token}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useLogoutMutation,
} = authApi;
