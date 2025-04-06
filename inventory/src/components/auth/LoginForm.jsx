import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useLoginMutation } from "@/store/api/authApiSlice";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import Link from "next/link";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const result = await login(values).unwrap();
      const { accessToken, user } = result;
      if (!user.isVerified) {
        toast.error(
          "Your email is not verified. Please check your inbox for a verification link.",
          { position: "top-right" }
        );
        return;
      }
      dispatch(setCredentials({ user, accessToken }));
      // Role-based redirection
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "company_owner") {
        router.replace("/dashboard");
      } else if (user.role === "sales") {
        router.replace("/sales/pos");
      } else {
        router.replace("/");
      }
      toast.success("Login successful!", { position: "top-right" });
    } catch (error) {
      toast.error(error?.data?.message || "Login failed", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
        Login
      </h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="space-y-4">
          {/* Email Field */}
          <div>
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>
          {/* Password Field */}
          <div className="relative">
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
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
          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-blue-500 hover:underline text-sm"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 px-4 rounded w-full font-bold mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </Form>
      </Formik>
      <p className="mt-4 text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
