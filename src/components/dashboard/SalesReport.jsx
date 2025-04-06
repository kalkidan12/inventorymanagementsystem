import React, { useEffect, useRef, useState } from "react";
import { useGetSalesReportQuery } from "@/store/api/salesApiSlice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useGetProductTypesQuery,
  useGetProductWarehousesQuery,
} from "@/store/api/productApiSlice";
import { useGetSalesTotalQuery } from "@/store/api/salesApiSlice";

const SalesReport = () => {
  const [sortField, setSortField] = useState("saleDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [dateType, setDateType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterParams, setFilterParams] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const [productType, setProductType] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const { data: productTypesData } = useGetProductTypesQuery();
  const { data: productLocationsData } = useGetProductWarehousesQuery();

  const { data, isLoading, isError } = useGetSalesReportQuery({
    page,
    limit: 10,
    sortField,
    sortOrder,
    ...filterParams,
  });
  const { data: totalData, isLoading: totalLoading } =
    useGetSalesTotalQuery(filterParams);
  const totalSales = totalData?.totalSales || 0;

  const reports = data?.reports || [];
  const hasNext = data?.hasNext;
  const modalRef = useRef();

  const handleSort = (field) => {
    setPage(1);
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    if (previewImage) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [previewImage]);

  const columns = [
    {
      label: "Sale Date",
      field: "saleDate",
      bgColor: "bg-blue-100",
      sortable: true,
    },
    {
      label: "Image",
      field: "product.ProductImage",
      bgColor: "bg-orange-100",
      sortable: false,
    },
    {
      label: "Name",
      field: "productName",
      bgColor: "bg-blue-100",
      sortable: true,
    },
    {
      label: "Barcode",
      field: "productBarcode",
      bgColor: "bg-orange-100",
      sortable: true,
    },
    {
      label: "Product Cost",
      field: "product.ProductCost",
      bgColor: "bg-blue-100",
      sortable: true,
    },
    {
      label: "Product Price",
      field: "priceWithoutTax",
      bgColor: "bg-orange-100",
      sortable: true,
    },
    {
      label: "Tax %",
      field: "product.ProductTax",
      bgColor: "bg-orange-100",
      sortable: true,
    },
    {
      label: "Product Price With Tax %",
      field: "pricePerUnit",
      bgColor: "bg-blue-100",
      sortable: true,
    },

    {
      label: "Quantity Sold",
      field: "quantitySold",
      bgColor: "bg-blue-100",
      sortable: true,
    },
    {
      label: "Location",
      field: "product.ProductLocation",
      bgColor: "bg-orange-100",
      sortable: true,
    },
    {
      label: "Processed By",
      field: "processedBy.name",
      bgColor: "bg-blue-100",
      sortable: true,
    },
    {
      label: "Total Price",
      field: "totalItemPrice",
      bgColor: "bg-orange-100",
      sortable: true,
    },
  ];

  const handleImageClick = (url) => setPreviewImage(url);
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setPreviewImage(null);
    }
  };

  const applyFilters = () => {
    setPage(1);
    setFilterParams({
      dateType,
      startDate,
      endDate,
      productType,
      productLocation,
    });
  };

  const resetFilters = () => {
    setDateType("");
    setStartDate("");
    setEndDate("");
    setProductType("");
    setProductLocation("");
    setPage(1);
    setFilterParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50 sm:p-6 font-sans">
      <ToastContainer />
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-xl p-2 sm:p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          📊 Sales Report
        </h1>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🔍 Filter Sales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Date Filter */}
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1">
                Date Filter
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
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Apply
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="w-full bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 text-green-800 font-semibold text-lg rounded-md px-6 py-4 mb-4 shadow-md">
          {totalLoading ? (
            <span>Loading total sales...</span>
          ) : (
            <span>
              Total Sales (Filtered):{" "}
              <strong>{totalSales.toFixed(2)} Birr</strong>
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border shadow-inner">
          <table className="w-full table-fixed text-sm md:text-base text-left">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.field}
                    onClick={() => col.sortable && handleSort(col.field)}
                    className={`p-3 bg-gray-300 ${
                      col.sortable
                        ? "cursor-pointer hover:bg-gray-400"
                        : "cursor-default"
                    } w-[150px]`}
                  >
                    {col.label}
                    {col.sortable && sortField === col.field && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center p-4 text-blue-600"
                  >
                    Loading...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center text-red-600 p-4"
                  >
                    Failed to load reports.
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center text-gray-500 p-4"
                  >
                    No sales records found.
                  </td>
                </tr>
              ) : (
                reports.map((item, i) => (
                  <tr key={`${item._id}-${i}`} className="border-t">
                    <td className="p-3 bg-blue-100">
                      {formatDate(item.saleDate)}
                    </td>
                    <td className="p-3 bg-orange-100">
                      <img
                        src={item.product?.ProductImage}
                        alt="Preview"
                        onClick={() =>
                          handleImageClick(item.product?.ProductImage)
                        }
                        className="h-12 w-12 object-cover rounded cursor-pointer hover:scale-105 transition"
                      />
                    </td>
                    <td className="p-3 bg-blue-100">{item.productName}</td>
                    <td className="p-3 bg-orange-100">{item.productBarcode}</td>
                    <td className="p-3 bg-blue-100">
                      {item.product?.ProductCost?.toFixed(2) ?? "-"} Birr
                    </td>
                    <td className="p-3 bg-orange-100">
                      {item.priceWithoutTax?.toFixed(2)} Birr
                    </td>
                    <td className="p-3 bg-blue-100">
                      {item.product?.ProductTax ?? "-"}%
                    </td>
                    <td className="p-3 bg-orange-100">
                      {item.pricePerUnit?.toFixed(2)} Birr
                    </td>

                    <td className="p-3 bg-blue-100">{item.quantitySold}</td>
                    <td className="p-3 bg-orange-100">
                      {item.product?.ProductLocation || "-"}
                    </td>
                    <td className="p-3 bg-blue-100">
                      {item.processedBy?.name || "-"}
                    </td>
                    <td className="p-3 bg-orange-100 font-semibold text-green-700">
                      {item.totalItemPrice?.toFixed(2)} Birr
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

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

        {/* Pagination */}
        <div className="w-[200px] flex justify-between items-center mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </button>
          <span className="font-semibold text-gray-700">Page {page}</span>
          <button
            onClick={() => hasNext && setPage((prev) => prev + 1)}
            disabled={!hasNext}
            className={`px-4 py-2 rounded ${
              !hasNext
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
