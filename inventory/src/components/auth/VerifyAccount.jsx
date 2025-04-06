import React from "react";

const VerifyAccount = () => {
  const redirectToGmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">
        Verify Your Account
      </h1>
      <p className="text-gray-600 mb-4">
        We've sent a verification email to your inbox. Please check your email
        to complete the verification process.
      </p>
      <button
        onClick={redirectToGmail}
        className="bg-blue-500 text-white py-3 px-4 rounded w-full font-bold mt-2"
      >
        Open Gmail
      </button>
    </div>
  );
};

export default VerifyAccount;
