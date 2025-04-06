import AuthNavbar from "@/components/auth/AuthHeader";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import Head from "next/head";
import { useRouter } from "next/router";

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  if (!token) {
    return <p className="text-center text-red-500">Invalid or missing token</p>;
  }

  return (
    <div>
      <Head>
        <title>Reset Password | Inventory Management</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AuthNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
