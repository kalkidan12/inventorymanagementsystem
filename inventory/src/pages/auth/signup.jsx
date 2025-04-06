import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import AuthNavbar from "@/components/auth/AuthHeader";
import Head from "next/head";

const SignupPage = () => {
  return (
    <div>
      <Head>
        <title>Sign Up | Inventory Management</title>
        <meta
          name="description"
          content="Create an account to manage your inventory efficiently. Sign up today!"
        />
      </Head>
      <AuthNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
