import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithAuth from "../utils/baseQueryWithAuth";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        sortField = "createdAt",
        sortOrder = "desc",
        dateType,
        startDate,
        endDate,
        productType,
        productBrand,
        productLocation, // ✅ New filter support
      }) => ({
        url: `/product/list`,
        method: "GET",
        params: {
          page,
          limit,
          search,
          sortField,
          sortOrder,
          dateType,
          startDate,
          endDate,
          productType,
          productBrand,
          productLocation,
        },
      }),
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({
                type: "Product",
                id: _id,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    addProduct: builder.mutation({
      query: (newProduct) => ({
        url: `/product/create`,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...updatedProduct }) => ({
        url: `/product/update`,
        method: "PUT",
        body: { id, ...updatedProduct },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/delete`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    getProductTypes: builder.query({
      query: () => ({
        url: `/product/get-product-types`,
        method: "GET",
      }),
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
    getProductWarehouses: builder.query({
      query: () => ({
        url: `/product/get-product-locations`,
        method: "GET",
      }),
      providesTags: [{ type: "Product", id: "LIST" }],
    }),
    // Use a lazy query for barcode generation
    generateBarcode: builder.query({
      query: () => ({
        url: `/product/generate-barcode`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductTypesQuery,
  useGetProductWarehousesQuery,
  useLazyGenerateBarcodeQuery,
} = productApi;
