import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { AiOutlineLogout } from "react-icons/ai";
import { useLogoutMutation } from "@/store/api/authApiSlice";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useRouter } from "next/router";

const AdminNavbar = ({ toggleSidebar }) => {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-blue-700 to-blue-500 text-white z-50 shadow-md flex items-center justify-between px-4">
      {/* Left: Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="text-2xl focus:outline-none hover:text-gray-300 transition"
      >
        <FaBars />
      </button>

      {/* Right: Logout */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-sm font-medium px-4 py-1.5 rounded shadow disabled:opacity-60"
        >
          <AiOutlineLogout className="text-lg" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
