import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useResetPasswordMutation } from "@/store/api/authApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

const ResetPasswordForm = ({ token }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[0-9]/, "Password must have at least one number")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleSubmit = async (values) => {
    try {
      await resetPassword({ token, newPassword: values.password }).unwrap();
      toast.success("Password reset successfully! Redirecting to login...", {
        position: "top-right",
      });

      setTimeout(() => {
        router.replace("/auth/login");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error?.data?.message || "Reset password failed, try again!";
      toast.error(errorMessage, { position: "top-right" });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Reset Password
      </h1>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          {/* Password Field */}
          <div className="relative">
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <Field
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
            />
            <div
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-4 rounded w-full font-bold mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </button>
        </Form>
      </Formik>

      {/* Toast Container for showing notifications */}
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordForm;
