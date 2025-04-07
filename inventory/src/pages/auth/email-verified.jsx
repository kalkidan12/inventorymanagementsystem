import React from "react";
import EmailVerified from "../../components/auth/EmailVerified";
import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";

const EmailVerifiedPage = () => {
  return (
    <div>
      <Head>
        <title>Email Verified Successfully</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <EmailVerified />
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
