// AccountSetting.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/api/userApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AccountSetting = () => {
  const { user } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data, isLoading: loadingProfile } = useGetProfileQuery();

  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    if (data?.user) {
      setFormData((prev) => ({
        ...prev,
        name: data.user.name || "",
        phoneNumber: data.user.phoneNumber || "",
        companyName: data.user.companyName || "",
      }));
    }
  }, [data]);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const sanitizeInput = (value) => value.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: sanitizeInput(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.companyName || !formData.phoneNumber) {
      return toast.error("All fields except password are required.");
    }

    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      return toast.error("Enter a valid phone number.");
    }

    if (formData.password && !passwordMatch) {
      return toast.error("Passwords do not match.");
    }

    try {
      const payload = { ...formData };
      if (!formData.password) delete payload.password;
      delete payload.confirmPassword;

      await updateProfile(payload).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update profile.");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center h-full text-lg">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="bg-gray-100 sm:p-6 min-h-screen">
      <ToastContainer position="top-right" />

      <div className="bg-white max-w-3xl mx-auto p-6 rounded shadow relative">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Account Settings
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email (Read Only)</label>
            <input
              type="email"
              value={data?.user?.email || ""}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="+123456789"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded pr-10"
                placeholder="Leave blank to keep current"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded pr-10 ${
                  !passwordMatch && formData.confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {!passwordMatch && formData.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 01-8 8z"
                  />
                </svg>
              )}
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSetting;
