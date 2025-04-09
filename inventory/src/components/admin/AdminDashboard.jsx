import React from "react";
import { useGetAdminDashboardDataQuery } from "@/store/api/adminApiSlice";

const AdminDashboard = () => {
  const { data, error, isLoading } = useGetAdminDashboardDataQuery();

  if (isLoading) return <p className="p-6">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading dashboard</p>;

  const {
    totalUsers,
    totalAdmins,
    totalOwners,
    totalSales,
    totalSubscribedUsers,
    totalCompanies,
    totalProducts,
    totalProductPrice,
    totalLocations,
  } = data;

  const stats = [
    { title: "Total Users", value: totalUsers },
    { title: "Admin Users", value: totalAdmins },
    { title: "Company Owners", value: totalOwners },
    { title: "Sales Users", value: totalSales },
    { title: "Subscribed Companies", value: totalSubscribedUsers },
    { title: "Total Companies", value: totalCompanies },
    { title: "Total Products", value: totalProducts },
    { title: "Total Product Value", value: `${totalProductPrice} Birr` },
    { title: "Total Locations", value: totalLocations },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📊 Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} title={stat.title} value={stat.value} />
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-4 hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold text-blue-800">{value}</p>
  </div>
);

export default AdminDashboard;
