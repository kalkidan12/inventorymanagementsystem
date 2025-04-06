import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useVerifyEmailMutation } from "@/store/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import Link from "next/link";

const VerificationSuccess = () => {
  const router = useRouter();
  const { token } = router.query;
  const dispatch = useDispatch();
  const [verifyEmail, { isLoading, isSuccess, isError }] =
    useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyEmail(token)
        .unwrap()
        .then((response) => {
          // Destructure response data
          const { accessToken, user } = response;

          // Store the user info in Redux
          dispatch(setCredentials({ user, accessToken }));

          // Show success toast and redirect
          toast.success("Verification successful! Redirecting...");
          setTimeout(() => {
            router.replace("/dashboard");
          }, 3000);
        })
        .catch((error) => {
          const errorMessage =
            error?.data?.message || "Verification failed. Please try again.";
          toast.error(errorMessage);
        });
    }
  }, [token, verifyEmail, router, dispatch]);

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        {isLoading
          ? "Verifying..."
          : isSuccess
          ? "Verification Successful!"
          : "Verification Failed!"}
      </h1>
      {isSuccess && (
        <>
          <p className="text-gray-600 mb-6">
            Your account has been successfully verified. You will be redirected
            shortly.
          </p>
          <p className="text-gray-600 mb-6">If not, click the button below:</p>
          <Link
            href="/dashboard"
            className="bg-blue-500 text-white py-2 px-6 rounded font-bold"
          >
            Go to Dashboard
          </Link>
        </>
      )}
      {isError && (
        <p className="text-red-500">
          Verification failed. Please try again or contact support.
        </p>
      )}
      <ToastContainer />
    </div>
  );
};

export default VerificationSuccess;
