import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sortField = "createdAt",
        sortOrder = "desc",
        searchTerm = "",
      }) => ({
        url: "/messages/get-contact-messages",
        method: "GET",
        params: { page, limit, sortField, sortOrder, searchTerm },
      }),
      providesTags: (result) =>
        result?.messages
          ? [
              ...result.messages.map(({ _id }) => ({
                type: "Message",
                id: _id,
              })),
              { type: "Message", id: "LIST" },
            ]
          : [{ type: "Message", id: "LIST" }],
    }),

    sendContactMessage: builder.mutation({
      query: (data) => ({
        url: "/messages/send-contact-message",
        method: "POST",
        body: data,
      }),
    }),

    sendMessages: builder.mutation({
      query: (data) => ({
        url: "/messages/send-messages",
        method: "POST",
        body: data,
      }),
    }),

    replyMessage: builder.mutation({
      query: ({ id, reply, subject }) => ({
        url: "/messages/reply-message",
        method: "POST",
        body: { id, reply, subject },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Message", id }],
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: "/messages/delete-message",
        method: "DELETE",
        params: { id },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Message", id }],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendContactMessageMutation,
  useSendMessagesMutation,
  useReplyMessageMutation,
  useDeleteMessageMutation,
} = messageApi;
