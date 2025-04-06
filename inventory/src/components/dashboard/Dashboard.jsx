import React, { useState } from "react";
import { useGetDashboardDataQuery } from "@/store/api/dashboardApiSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  useGetProductTypesQuery,
  useGetProductWarehousesQuery,
} from "@/store/api/productApiSlice";

const Dashboard = () => {
  const [tempFilters, setTempFilters] = useState({
    dateType: "all",
    startDate: "",
    endDate: "",
    productType: "",
    productLocation: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...tempFilters });

  const { data, isLoading, isError } = useGetDashboardDataQuery(appliedFilters);
  const { data: typeData } = useGetProductTypesQuery();
  const { data: locData } = useGetProductWarehousesQuery();

  const handleChange = (field, value) => {
    setTempFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    setAppliedFilters({ ...tempFilters });
  };

  const handleReset = () => {
    const reset = {
      dateType: "all",
      startDate: "",
      endDate: "",
      productType: "",
      productLocation: "",
    };
    setTempFilters(reset);
    setAppliedFilters(reset);
  };

  if (isLoading) return <div className="p-6">Loading dashboard...</div>;
  if (isError)
    return <div className="p-6 text-red-600">Failed to load dashboard</div>;

  const {
    totalRevenue,
    totalItemsSold,
    totalStockValue,
    totalProducts,
    totalSalesUsers,
    totalLocations,
    lowStock,
    topProducts,
  } = data;

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📊 Dashboard</h1>

      {/* 🔹 Unfiltered Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Products" value={totalProducts} />
        <StatCard
          title="Stock Value"
          value={`${totalStockValue.toFixed(2)} Birr`}
        />
        <StatCard title="Sales Users" value={totalSalesUsers} />
        <StatCard title="Locations/warehouses" value={totalLocations} />
      </div>

      {/* 🔹 Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
        <select
          value={tempFilters.dateType}
          onChange={(e) => handleChange("dateType", e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="all">All Time</option>
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="range">Custom Range</option>
        </select>

        {tempFilters.dateType === "range" && (
          <>
            <input
              type="date"
              value={tempFilters.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="date"
              value={tempFilters.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="p-2 border rounded"
            />
          </>
        )}

        <select
          value={tempFilters.productType}
          onChange={(e) => handleChange("productType", e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">All Types</option>
          {typeData?.productTypes?.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={tempFilters.productLocation}
          onChange={(e) => handleChange("productLocation", e.target.value)}
          className="p-2 border rounded w-full sm:w-auto"
        >
          <option value="">All Locations</option>
          {locData?.productLocations?.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* 🔘 Buttons */}
        <button
          onClick={handleApply}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        >
          Reset
        </button>
      </div>

      {/* 🔹 Filtered Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={`${totalRevenue.toFixed(2)} Birr`}
        />
        <StatCard title="Items Sold" value={totalItemsSold} />
        <StatCard title="Low Stock Items" value={lowStock.length} />
      </div>

      {/* 🔹 Chart */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="productName" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} sold`, "Units"]}
                labelFormatter={(label) => `Product: ${label}`}
              />
              <Bar dataKey="quantitySold" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No sales found for selected filters.</p>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-4">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold text-blue-700">{value}</p>
  </div>
);

export default Dashboard;
