import React from "react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";

const ForgotPasswordPage = () => {
  return (
    <div>
      <Head>
        <title>Forgot Password | Inventory Management</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
