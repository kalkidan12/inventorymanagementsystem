import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: ({
        dateType,
        startDate,
        endDate,
        productType,
        productLocation,
      } = {}) => {
        const params = new URLSearchParams();
        if (dateType) params.append("dateType", dateType);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (productType) params.append("productType", productType);
        if (productLocation) params.append("productLocation", productLocation);

        return { url: `/dashboard?${params.toString()}` };
      },
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
