import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Navbar from "@/components/navbar/NavBar";

const MenuPage = () => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth) || {};

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!user) {
      router.replace("/auth/login");
    }
  }, [user, router]);

  const handleNavigate = (path) => {
    router.push(path);
  };

  const getMenuOptions = () => {
    if (!user) return [];

    const options = [];

    if (user.role === "admin") {
      options.push({ label: "Admin Panel", path: "/admin" });
    }

    if (user.role === "company_owner") {
      options.push(
        { label: "Dashboard", path: "/dashboard" },
        { label: "Point of Sale", path: "/sales/pos" }
      );
    }

    if (user.role === "sales") {
      options.push({ label: "Point of Sale", path: "/sales/pos" });
    }

    return options;
  };

  const menuOptions = getMenuOptions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <Navbar />
      <div className="flex justify-center items-center pt-24 px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-3xl text-center border border-blue-200">
          {isClient && (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-10">
                Welcome, {user?.name || "User"} 👋
              </h1>

              <div className="flex gap-6 justify-center items-center">
                {menuOptions.map((option) => (
                  <div
                    key={option.path}
                    onClick={() => handleNavigate(option.path)}
                    className="w-40 h-40 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl shadow-md flex items-center justify-center text-lg cursor-pointer transition-transform transform hover:scale-105"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
