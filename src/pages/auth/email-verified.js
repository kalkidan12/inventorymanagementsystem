import React from "react";
import EmailVerified from "../../components/auth/EmailVerified";
import AuthNavbar from "@/components/auth/AuthHeader";
import Head from "next/head";

const EmailVerifiedPage = () => {
  return (
    <div>
      <Head>
        <title>Email Verified Successfully</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AuthNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <EmailVerified />
      </div>
    </div>
  );
};

export default EmailVerifiedPage;
