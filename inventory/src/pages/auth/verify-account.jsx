import React from "react";
import VerifyAccount from "../../components/auth/VerifyAccount";
import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";

const VerifyAccountPage = () => {
  return (
    <div>
      <Head>
        <title>Verify Your Account</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <VerifyAccount />
      </div>
    </div>
  );
};

export default VerifyAccountPage;
