import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useGetProfileQuery } from "@/store/api/userApiSlice";
import SalesReport from "@/components/dashboard/SalesReport";
import Users from "@/components/dashboard/Users";
import AccountSetting from "@/components/dashboard/AccountSetting";
import ManageProduct from "@/components/dashboard/ManageProduct";
import Dashboard from "@/components/dashboard/Dashboard";

const DashboardPage = () => {
  const [selectedPage, setSelectedPage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [blockAccess, setBlockAccess] = useState(false);

  const router = useRouter();
  const { data: profileData, error, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (!isLoading) {
      const user = profileData?.user;

      // Unauthorized role
      if (error || !user || user.role !== "company_owner") {
        router.replace("/");
      } else {
        // Check subscription/trial expiration
        const now = new Date();
        const trialEnded =
          user?.inventoryTrialEnddDate &&
          new Date(user.inventoryTrialEnddDate) < now;

        const notSubscribed = !user?.inventorySubscribed;

        if (trialEnded && notSubscribed) {
          setBlockAccess(true);
        }

        setIsAuthorized(true);
      }
    }
  }, [profileData, error, isLoading, router]);

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
    <div className="min-h-screen bg-gray-50 relative">
      <DashboardNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <DashboardSidebar
          setSelectedPage={setSelectedPage}
          sidebarOpen={sidebarOpen}
          userRole={profileData?.user?.role}
        />
        <div
          className={`flex-1 transition-all duration-300 p-5 sm:p-8 overflow-auto bg-gray-50 ${
            sidebarOpen ? "ml-[220px]" : "ml-16"
          }`}
        >
          {renderContent()}
        </div>
      </div>

      {/* 🔒 Block Access Overlay */}
      {blockAccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-md text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Access Blocked
            </h2>
            <p className="text-gray-700 mb-4">
              Your free trial has ended and your subscription is not active.
              Please contact support to regain access.
            </p>
            <div className="text-left text-sm text-gray-600">
              <p>
                <strong>📞 Phone:</strong>{" "}
                <a href="tel:+251902280977" className="text-blue-600 underline">
                  +251902280977
                </a>
              </p>
              <p>
                <strong>📧 Email:</strong>{" "}
                <a
                  href="mailto:kaligetservice@gmail.com"
                  className="text-blue-600 underline"
                >
                  kaligetservice@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
