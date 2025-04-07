import React, { useEffect } from "react";
import VerificationSuccess from "../../components/auth/VerificationSuccess";
import { useRouter } from "next/router";
import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";

const VerificationSuccessfulPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the home page after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <Head>
        <title>Verification Successful</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <VerificationSuccess />
      </div>
    </div>
  );
};

export default VerificationSuccessfulPage;
