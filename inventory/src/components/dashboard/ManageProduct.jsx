import React, { useState, useRef, useEffect } from "react";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/api/productApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductFormModal from "../forms/ProductFormModal";
import {
  useGetProductTypesQuery,
  useGetProductWarehousesQuery,
} from "@/store/api/productApiSlice";

const ManageProduct = () => {
  const [searchName, setSearchName] = useState("");
  const [searchBarcode, setSearchBarcode] = useState("");
  const [dateType, setDateType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [applyFilters, setApplyFilters] = useState(false);
  const [productType, setProductType] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const { data: productTypesData } = useGetProductTypesQuery();
  const { data: productLocationsData } = useGetProductWarehousesQuery();

  const modalRef = useRef();

  const queryParams = {
    page,
    sortField,
    sortOrder,
    startDate: applyFilters ? startDate : undefined,
    endDate: applyFilters ? endDate : undefined,
    dateType: applyFilters ? dateType : undefined,
    search: applyFilters ? `${searchName} ${searchBarcode}`.trim() : undefined,
    productType: applyFilters ? productType : undefined,
    productLocation: applyFilters ? productLocation : undefined,
  };

  const { data, refetch } = useGetProductsQuery(queryParams);
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.products || [];
  const hasNext = data?.hasNext;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleApplyFilters = () => {
    setApplyFilters(true);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchName("");
    setSearchBarcode("");
    setDateType("");
    setStartDate("");
    setEndDate("");
    setProductType("");
    setProductLocation("");
    setApplyFilters(false);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (hasNext) setPage(page + 1);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete product");
      }
    }
  };

  const handleImageClick = (url) => {
    setPreviewImage(url);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setPreviewImage(null);
    }
  };

  useEffect(() => {
    if (previewImage) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [previewImage]);

  const columnBgColors = [
    "bg-blue-100",
    "bg-orange-100",
    "bg-blue-100",
    "bg-orange-100",
    "bg-blue-100",
    "bg-orange-100",
    "bg-blue-100",
    "bg-orange-100",
    "bg-blue-100",
    "bg-orange-100",
  ];

  return (
    <div className="sm:p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <div className="max-w-6xl mx-auto bg-white p-2 sm:p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4 bg-gray-100 p-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Product List
          </h2>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white p-2 sm:p-3 rounded shadow hover:bg-green-700"
          >
            + Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🔍 Filter Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Name
              </label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., shoes"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Barcode */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Barcode
              </label>
              <input
                type="text"
                value={searchBarcode}
                onChange={(e) => setSearchBarcode(e.target.value)}
                placeholder="e.g., PROD232527"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Product Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {productTypesData?.productTypes?.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Location */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Product Location
              </label>
              <select
                value={productLocation}
                onChange={(e) => setProductLocation(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {productLocationsData?.productLocations?.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Date Range
              </label>
              <select
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Dates</option>
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleApplyFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={handleResetFilters}
              className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-auto">
          <table className="min-w-full border rounded-lg bg-white shadow-md">
            <thead>
              <tr className="bg-gray-300 text-gray-800">
                {[
                  "createdAt",
                  "ProductName",
                  "ProductImage",
                  "ProductBarcode",
                  "ProductType",
                  "ProductBrand",
                  "ProductLocation",
                  "Avl. ProductQuantity",
                  "ProductTax %",
                  "ProductCost",
                  "ProductPrice",
                ].map((field, i) => (
                  <th
                    key={field}
                    className="p-3 cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort(field)}
                  >
                    {field === "createdAt"
                      ? "Date"
                      : field.replace("Product", "")}{" "}
                    {sortField === field && (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                ))}
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="14" className="text-center p-4 text-gray-500">
                    No matching products found
                  </td>
                </tr>
              ) : (
                products.map((product, rowIndex) => (
                  <tr key={product._id} className="border-t">
                    {[
                      new Date(product.createdAt).toLocaleDateString(),
                      product.ProductName,
                      product.ProductImage ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${product.ProductImage}`}
                          alt="Preview"
                          onClick={() => handleImageClick(product.ProductImage)}
                          className="h-12 w-12 object-cover rounded cursor-pointer hover:scale-105 transition"
                        />
                      ) : (
                        "-"
                      ),
                      product.ProductBarcode,
                      product.ProductType,
                      product.ProductBrand,
                      product.ProductLocation,
                      product.ProductQuantity,
                      product.ProductTax,
                      product.ProductCost,
                      product.ProductPrice,
                    ].map((val, i) => (
                      <td
                        key={i}
                        className={`p-3 ${
                          columnBgColors[i % columnBgColors.length]
                        }`}
                      >
                        {val}
                      </td>
                    ))}
                    <td className="p-3 flex gap-2 bg-gray-50">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="w-[200px] flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`px-4 py-2 rounded transition ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed opacity-50 text-gray-500"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button
            onClick={handleNextPage}
            disabled={!hasNext}
            className={`px-4 py-2 rounded transition ${
              !hasNext
                ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Product Modal */}
      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={editingProduct}
        refetch={refetch}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="relative bg-white p-2 sm:p-4 rounded-lg shadow-lg w-11/12 sm:max-w-2xl"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full shadow-lg z-50"
            >
              ✕
            </button>
            <div className="flex justify-center items-center">
              <img
                src={previewImage}
                alt="Full Preview"
                className="max-w-full max-h-[80vh] object-contain transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
