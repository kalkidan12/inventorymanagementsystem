import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useSignupMutation } from "@/store/api/authApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();
  const [signupSuccess, setSignupSuccess] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    phoneNumber: Yup.string()
      .matches(/^\+?\d{7,15}$/, "Enter a valid phone number")
      .required("Required"),
    companyName: Yup.string().required("Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(/\d/, "Password must contain a number")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values) => {
    try {
      await signup(values).unwrap();
      setSignupSuccess(true);
      toast.success("Signup successful! Please verify your email.");
    } catch (error) {
      toast.error(error.data?.message || "Signup failed");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      {!signupSuccess ? (
        <>
          <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Sign Up
          </h1>
          <Formik
            initialValues={{
              name: "",
              email: "",
              phoneNumber: "",
              companyName: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-4">
              {/* Name */}
              <div>
                <Field
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
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

              {/* Phone Number */}
              <div>
                <Field
                  type="text"
                  name="phoneNumber"
                  placeholder="Phone Number (e.g. 251945678900)"
                  className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
                />
                <ErrorMessage
                  name="phoneNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Company Name */}
              <div>
                <Field
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
                />
                <ErrorMessage
                  name="companyName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Signup Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-4 rounded w-full font-bold mt-2"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </Form>
          </Formik>

          {/* Already have an account? */}
          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link className="text-blue-500 hover:underline" href="/auth/login">
              Login
            </Link>
          </p>
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-6">
            Signup Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            A verification email has been sent. Please check your inbox.
          </p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SignupForm;
