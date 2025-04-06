import React from "react";
import { useRouter } from "next/router";

const EmailVerified = () => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        Email Verified Successfully! ✅
      </h1>
      <p className="text-gray-600 mb-4">
        Your account has been successfully verified. You can now log in and
        start using the platform.
      </p>
      <button
        onClick={() => router.push("/auth/login")}
        className="bg-blue-500 text-white py-3 px-4 rounded w-full font-bold mt-2"
      >
        Go to Login
      </button>
    </div>
  );
};

export default EmailVerified;
