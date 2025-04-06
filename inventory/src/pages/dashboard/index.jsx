import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useGetUserRoleQuery } from "@/store/api/userApiSlice";
import SalesReport from "@/components/dashboard/SalesReport";
import Users from "@/components/dashboard/Users";
import AccountSetting from "@/components/dashboard/AccountSetting";
import ManageProduct from "@/components/dashboard/ManageProduct";
import Dashboard from "@/components/dashboard/Dashboard";

const DashboardPage = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false); // ✅ prevent UI flash

  const router = useRouter();
  const { data: userRoleData, error, isLoading } = useGetUserRoleQuery();

  useEffect(() => {
    if (!isLoading) {
      if (error || !userRoleData || userRoleData.role !== "company_owner") {
        router.replace("/");
      } else {
        setIsAuthorized(true); // ✅ allow rendering after auth passes
      }
    }
  }, [userRoleData, error, isLoading, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-sm animate-pulse">Authenticating...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (selectedPage) {
      case "Dashboard":
        return <Dashboard />;
      case "Manage Products":
        return <ManageProduct />;
      case "Sales Report":
        return <SalesReport />;
      case "Users":
        return <Users />;
      case "My Account":
        return <AccountSetting />;
      default:
        return <ManageProduct />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <DashboardSidebar
          setSelectedPage={setSelectedPage}
          sidebarOpen={sidebarOpen}
          userRole={userRoleData.role}
        />
        <div
          className={`flex-1 transition-all duration-300 p-5 sm:p-8 overflow-auto bg-gray-50 ${
            sidebarOpen ? "ml-[220px]" : "ml-16"
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
