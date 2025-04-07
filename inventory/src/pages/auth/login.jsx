import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";

const LoginPage = () => {
  return (
    <div>
      <Head>
        <title>Login | Inventory Management</title>
        <meta
          name="description"
          content="Log in to your inventory management system to track your products, sales, and reports efficiently."
        />
      </Head>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
