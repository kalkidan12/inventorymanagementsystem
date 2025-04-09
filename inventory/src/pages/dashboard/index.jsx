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
  const [sidebarOpen, setSidebarOpen] = useState(false); // default to false
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [blockAccess, setBlockAccess] = useState(false);
  const [showTrialBanner, setShowTrialBanner] = useState(true);

  const router = useRouter();
  const { data: profileData, error, isLoading } = useGetProfileQuery();

  // Detect screen width on initial load to set sidebar state
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // open for md and above
      } else {
        setSidebarOpen(false); // closed for small screens
      }
    }
  }, []);

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const daysLeft = getDaysLeft(profileData?.user?.inventoryTrialEnddDate);

  useEffect(() => {
    if (!isLoading) {
      const user = profileData?.user;
      if (error || !user || user.role !== "company_owner") {
        router.replace("/");
      } else {
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
      <DashboardNavbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      <div className="flex pt-16">
        <DashboardSidebar
          setSelectedPage={setSelectedPage}
          sidebarOpen={sidebarOpen}
          userRole={profileData?.user?.role}
        />

        <div
          className={`relative flex-1 transition-all duration-300 p-5 sm:p-8 overflow-auto bg-gray-50 ${
            sidebarOpen ? "ml-[220px]" : "ml-16"
          }`}
        >
          {/* 🎯 Trial Notification */}
          {showTrialBanner &&
            !blockAccess &&
            profileData?.user?.inventoryTrialStarted &&
            !profileData?.user?.inventorySubscribed && (
              <div className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8">
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 rounded-lg p-3 mt-1 shadow-lg">
                  <div className="flex justify-between items-start">
                    <p className="text-sm sm:text-base font-medium flex-1 pr-2">
                      🎉 You’re on a <strong>7-day free trial</strong>.{" "}
                      <span className="text-red-600 font-semibold">
                        {daysLeft > 0
                          ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                          : "Trial ended"}
                      </span>
                      . Please contact support for a subscription:
                      <br />
                      <span className="text-sm block mt-1">
                        📞{" "}
                        <a
                          href="tel:+251902280977"
                          className="text-blue-700 underline"
                        >
                          +251902280977
                        </a>{" "}
                        | 📧{" "}
                        <a
                          href="mailto:kaligetservice@gmail.com"
                          className="text-blue-700 underline"
                        >
                          kaligetservice@gmail.com
                        </a>
                      </span>
                    </p>
                    <button
                      onClick={() => setShowTrialBanner(false)}
                      className="text-yellow-900 hover:text-yellow-600 ml-3 text-lg"
                      aria-label="Dismiss"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              </div>
            )}

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
