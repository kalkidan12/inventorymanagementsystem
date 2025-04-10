import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetUserRoleQuery } from "@/store/api/userApiSlice";
import Users from "@/components/admin/Users";
import AccountSetting from "@/components/admin/AccountSetting";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Messages from "@/components/admin/Messages";

const DashboardPage = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false); // ✅ prevent UI flash

  const router = useRouter();
  const { data: userRoleData, error, isLoading } = useGetUserRoleQuery();

  useEffect(() => {
    if (!isLoading) {
      if (error || !userRoleData || userRoleData.role !== "admin") {
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
        return <AdminDashboard />;
      case "Users":
        return <Users />;
      case "Messages":
        return <Messages />;
      case "My Account":
        return <AccountSetting />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <AdminSidebar
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
