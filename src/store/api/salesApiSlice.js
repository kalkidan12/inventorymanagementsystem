// ✅ Updated: /store/api/salesApiSlice.js
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Sales", "Product"],
  endpoints: (builder) => ({
    processSale: builder.mutation({
      query: (salesData) => ({
        url: `/sales/sell`,
        method: "POST",
        body: salesData,
      }),
      invalidatesTags: [
        { type: "Sales", id: "LIST" },
        { type: "Product", id: "LIST" },
      ],
    }),

    getSalesTotal: builder.query({
      query: (filters) => ({
        url: `/sales/total`,
        method: "GET",
        params: filters,
      }),
    }),

    getSalesReport: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sortField = "saleDate",
        sortOrder = "desc",
        dateType,
        startDate,
        endDate,
        productLocation,
        productType,
      }) => {
        const params = new URLSearchParams({
          page,
          limit,
          sortField,
          sortOrder,
        });

        if (dateType) params.append("dateType", dateType);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (productLocation) params.append("productLocation", productLocation);
        if (productType) params.append("productType", productType);

        return {
          url: `/sales/report?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [{ type: "Sales", id: "LIST" }],
    }),

    getSalesAnalytics: builder.query({
      query: () => ({
        url: `/sales/analytics`,
        method: "GET",
      }),
    }),

    getBestSellingProducts: builder.query({
      query: () => ({
        url: `/sales/best-sellers`,
        method: "GET",
      }),
    }),

    getProductByBarcode: builder.query({
      query: (barcode) => ({
        url: `/product/get-product-by-barcode`,
        method: "GET",
        params: { barcode },
      }),
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
    }),
  }),
});

export const {
  useProcessSaleMutation,
  useGetSalesReportQuery,
  useGetSalesAnalyticsQuery,
  useGetBestSellingProductsQuery,
  useLazyGetProductByBarcodeQuery,
  useGetSalesTotalQuery,
} = salesApi;
