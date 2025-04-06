import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "@/store/slices/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include", // Important to send HTTP-only cookies
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    // Attempt to refresh the token
    const refreshResult = await baseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );
    if (refreshResult?.data?.accessToken) {
      api.dispatch(
        setCredentials({
          accessToken: refreshResult.data.accessToken,
          user: api.getState().auth.user,
        })
      );
      // Retry the original query with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export default baseQueryWithAuth;
