import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/users/get-profile",
        method: "GET",
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/update-profile",
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: ({
        page = 1,
        limit = 5,
        searchTerm = "",
        sortField = "createdAt",
        sortOrder = "desc",
      }) => ({
        url: "/users/get-users",
        method: "GET",
        params: { page, limit, searchTerm, sortField, sortOrder },
      }),

      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ _id }) => ({ type: "User", id: _id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: "/users/get-user",
        method: "GET",
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    // Endpoint to get the user role. This is used in the dashboard to confirm user permissions.
    getUserRole: builder.query({
      query: () => ({
        url: "/users/verify-user-role",
        method: "GET",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/users/update-user",
        method: "PUT",
        params: { id },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: "/users/add-user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: "/users/delete-user",
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useGetUserRoleQuery,
  useUpdateUserMutation,
  useAddUserMutation,
  useDeleteUserMutation,
} = userApi;
