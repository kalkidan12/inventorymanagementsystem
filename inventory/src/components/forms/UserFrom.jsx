import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import icons for show/hide functionality
import "react-toastify/dist/ReactToastify.css";

const UserForm = ({ initialValues, isEdit, onClose, handleSubmitUser }) => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  // Formik initial values based on isEdit prop
  const initialFormValues = isEdit
    ? initialValues
    : {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "normal",
        emailVerified: false,
      };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Check if we are editing and the password is empty
      if (isEdit && !values.password) {
        // Remove the password field to avoid updating it
        const { password, ...rest } = values;
        await handleSubmitUser(rest);
      } else {
        await handleSubmitUser(values);
      }

      setSubmitting(false);
      onClose(); // Close the form after submission
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white rounded-lg p-8 w-[400px] shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {isEdit ? "Edit User" : "Add User"}
        </h2>
        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          enableReinitialize={true} // Allow form to reinitialize with new initialValues
          context={{ isEdit }} // Pass the isEdit context to validation schema
        >
          {({ isSubmitting }) => (
            <Form>
              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-2 mb-4 rounded bg-gray-100 focus:outline-none border-none"
                required
              />

              <Field
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-2 mb-4 rounded bg-gray-100 focus:outline-none border-none"
                required
              />

              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 mb-4 rounded bg-gray-100 focus:outline-none border-none"
                required
              />

              {!isEdit && (
                <>
                  <div className="relative mb-4">
                    <Field
                      type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                      name="password"
                      placeholder="Password"
                      className="w-full p-2 rounded bg-gray-100 focus:outline-none pr-10 border-none"
                      required
                    />
                    <div
                      className="absolute top-2 right-2 cursor-pointer text-gray-600"
                      onClick={() => setShowPassword(!showPassword)} // Toggle showPassword state on click
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </div>
                  </div>
                </>
              )}

              <Field
                as="select"
                name="role"
                className="w-full p-2 mb-4 rounded bg-gray-100 focus:outline-none border-none"
                required
              >
                <option value="normal">Normal</option>
                <option value="writer">Writer</option>
                <option value="reviewer">Reviewer</option>
                <option value="admin">Admin</option>
              </Field>

              <label className="flex items-center mb-4">
                <Field
                  type="checkbox"
                  name="emailVerified"
                  className="focus:outline-none border-none"
                />
                <span className="ml-2">Email Verified</span>
              </label>

              <button
                type="submit"
                className={`${
                  isSubmitting ? "bg-gray-500" : "bg-blue-500"
                } text-white py-2 px-4 rounded w-full font-bold`}
                disabled={isSubmitting}
              >
                {isEdit ? "Update User" : "Add User"}
              </button>
            </Form>
          )}
        </Formik>
        <button
          onClick={onClose}
          className="mt-4 text-red-500 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserForm;
