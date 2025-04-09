import React, { useState, useEffect } from "react";
import {
  FaThLarge,
  FaChartBar,
  FaUsers,
  FaUserCog,
  FaBoxes,
} from "react-icons/fa";

const DashboardSidebar = ({ setSelectedPage, sidebarOpen, userRole }) => {
  const [selectedOption, setSelectedOption] = useState("Dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOption = localStorage.getItem("selectedOption");
      if (storedOption) {
        setSelectedOption(storedOption);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedOption", selectedOption);
    }
    setSelectedPage(selectedOption);
  }, [selectedOption, setSelectedPage]);

  const menuItems = [
    { name: "Dashboard", icon: <FaThLarge /> },
    { name: "Manage Products", icon: <FaBoxes /> },
    { name: "Sales Report", icon: <FaChartBar /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "My Account", icon: <FaUserCog /> },
  ];

  return (
    <div
      className={`fixed top-16 left-0 h-full bg-gradient-to-b from-blue-800 to-blue-600 text-white shadow-lg transition-all duration-300 z-50 ${
        sidebarOpen ? "w-56" : "w-16"
      }`}
    >
      <ul className="flex flex-col py-4">
        {menuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => setSelectedOption(item.name)}
            className={`cursor-pointer px-4 py-3 flex items-center space-x-3 transition-all duration-200 
              ${
                selectedOption === item.name
                  ? "bg-blue-500 shadow-inner"
                  : "hover:bg-blue-700"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            {sidebarOpen && (
              <span className="text-md font-medium truncate">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardSidebar;
