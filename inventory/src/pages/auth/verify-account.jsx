import React from "react";
import VerifyAccount from "../../components/auth/VerifyAccount";
import AuthNavbar from "@/components/auth/AuthHeader";
import Head from "next/head";

const VerifyAccountPage = () => {
  return (
    <div>
      <Head>
        <title>Verify Your Account</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AuthNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <VerifyAccount />
      </div>
    </div>
  );
};

export default VerifyAccountPage;
