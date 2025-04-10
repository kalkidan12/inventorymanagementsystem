import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Admin"],
  endpoints: (builder) => ({
    getUsersForAdmin: builder.query({
      query: ({
        page = 1,
        limit = 10,
        searchTerm = "",
        sortField = "createdAt",
        sortOrder = "desc",
      }) => ({
        url: "/admin/get-users",
        method: "GET",
        params: { page, limit, searchTerm, sortField, sortOrder },
      }),
      providesTags: (result) =>
        result?.users
          ? [
              ...result.users.map(({ _id }) => ({
                type: "Admin",
                id: _id,
              })),
              { type: "Admin", id: "LIST" },
            ]
          : [{ type: "Admin", id: "LIST" }],
    }),
    getAllUserEmails: builder.query({
      query: () => ({
        url: "/admin/get-all-emails",
        method: "GET",
      }),
    }),

    getUserForAdmin: builder.query({
      query: (id) => ({
        url: "/admin/get-user",
        method: "GET",
        params: { id },
      }),
      providesTags: (result, error, id) => [{ type: "Admin", id }],
    }),

    addUserForAdmin: builder.mutation({
      query: (newUser) => ({
        url: "/admin/add-user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: [{ type: "Admin", id: "LIST" }],
    }),

    updateUserForAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: "/admin/update-user",
        method: "PUT",
        params: { id },
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Admin", id },
        { type: "Admin", id: "LIST" },
      ],
    }),

    deleteUserForAdmin: builder.mutation({
      query: (id) => ({
        url: "/admin/delete-user",
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Admin", id },
        { type: "Admin", id: "LIST" },
      ],
    }),
    getProfileForAdmin: builder.query({
      query: () => ({
        url: "/admin/get-profile",
        method: "GET",
      }),
    }),
    updateProfileForAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin/update-profile",
        method: "PUT",
        body: data,
      }),
    }),
    getAdminDashboardData: builder.query({
      query: () => ({
        url: "/admin/dashboard",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProfileForAdminQuery,
  useAddUserForAdminMutation,
  useDeleteUserForAdminMutation,
  useGetUserForAdminQuery,
  useGetUsersForAdminQuery,
  useUpdateProfileForAdminMutation,
  useUpdateUserForAdminMutation,
  useGetAdminDashboardDataQuery,
  useGetAllUserEmailsQuery,
} = adminApi;
