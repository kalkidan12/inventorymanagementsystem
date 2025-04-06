import React from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthNavbar from "@/components/auth/AuthHeader";
import Head from "next/head";

const ForgotPasswordPage = () => {
  return (
    <div>
      <Head>
        <title>Forgot Password | Inventory Management</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AuthNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
