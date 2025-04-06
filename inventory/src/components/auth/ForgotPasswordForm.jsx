import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useForgotPasswordMutation } from "@/store/api/authApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordForm = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [emailSent, setEmailSent] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values) => {
    try {
      console.log("📤 Sending Forgot Password Request:", values); // Debugging

      // Ensure the API receives the correct payload format
      await forgotPassword({ email: values.email }).unwrap();

      setEmailSent(true);
      toast.success("✅ Password reset email sent! Check your inbox.", {
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
      console.error("❌ Forgot Password Error:", error);

      toast.error(
        `Error: ${error.data?.message || "Failed to send reset email"}`,
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
      {!emailSent ? (
        <>
          <h1 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Forgot Password
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            Enter your email and we’ll send you a link to reset your password.
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full p-3 bg-gray-200 rounded-lg border-none focus:outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white py-3 px-4 rounded w-full font-bold mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Email"}
                </button>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-6">
            ✅ Email Sent!
          </h1>
          <p className="text-gray-600 mb-6">
            A password reset link has been sent to your email. Please check your
            inbox.
          </p>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ForgotPasswordForm;
