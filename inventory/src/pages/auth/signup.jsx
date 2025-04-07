import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";

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
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
