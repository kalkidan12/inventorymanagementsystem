import React from "react";
import { useRouter } from "next/router"; // For navigation
import { FaArrowLeft } from "react-icons/fa";

const PageNotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>

      {/* Button to go back to home */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        {" "}
        <FaArrowLeft className="mr-2" />
        Go Back to Home
      </button>
    </div>
  );
};

export default PageNotFound;
