import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useSendNotificationMutation } from "@/store/api/notificationApiSlice";
import { useGetSubscribersQuery } from "@/store/api/notificationApiSlice";
import TinyMceEditor from "../editor/CustomEditor";
import ImageToCloudForm from "./ImageToCloudForm";

const NotificationForm = ({ onClose }) => {
  const [sendNotification] = useSendNotificationMutation();
  const { data: subscribersData } = useGetSubscribersQuery();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [alertTypes] = useState([
    "Info",
    "Warning",
    "Error",
    "Promotions",
    "News Letter",
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editorContent, setEditorContent] = useState(""); // State for editor content
  const [bannerImage, setBannerImage] = useState("");

  // Handle selecting/unselecting an email
  const handleSelectEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Handle "All" checkbox selection
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allEmails = subscribersData?.subscribers.map(
        (subscriber) => subscriber.email
      );
      setSelectedEmails(allEmails || []);
    } else {
      setSelectedEmails([]);
    }
  };

  // Handle the URL update from the ImageToCloudForm component
  const handleImageUpload = (url) => {
    setBannerImage(url);
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const toEmails = selectedEmails.length > 0 ? selectedEmails : "All";

      await sendNotification({
        ...values,
        content: editorContent, // Use content from CustomEditor
        to: toEmails,
      }).unwrap();
      toast.success("Notification sent successfully!");
      onClose();
    } catch (error) {
      toast.error(error.data.message || "Failed to send notification.");
    }
    setSubmitting(false);
  };

  // Filtered subscribers based on search term
  const filteredSubscribers = subscribersData?.subscribers.filter(
    (subscriber) =>
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-4/5 shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Add Notification</h2>
        <Formik
          initialValues={{
            subject: "",
            alertType: "Info",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Subject
                </label>
                <Field
                  type="text"
                  name="subject"
                  placeholder="Notification Subject"
                  className="w-full p-2 mb-2 rounded bg-gray-100 focus:outline-none border-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">To</label>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={
                      selectedEmails.length ===
                      (subscribersData?.subscribers.length || 0)
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="text-gray-700 font-medium">
                    Select All
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="Search emails"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 mb-2 rounded bg-gray-100 focus:outline-none border-none"
                />

                <div className="max-h-[200px] overflow-y-auto border p-2">
                  {filteredSubscribers?.map((subscriber) => (
                    <div
                      key={subscriber.email}
                      className={`px-3 py-1 rounded-lg cursor-pointer mb-1 ${
                        selectedEmails.includes(subscriber.email)
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                      onClick={() => handleSelectEmail(subscriber.email)}
                    >
                      {subscriber.email}
                    </div>
                  ))}
                </div>
              </div>
              {/* Image Upload Component */}
              <div className="mb-4">
                <ImageToCloudForm onUpload={handleImageUpload} />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Content
                </label>
                <TinyMceEditor
                  initialValue={editorContent}
                  handleBodyContent={(content) => setEditorContent(content)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Alert Type
                </label>
                <Field
                  as="select"
                  name="alertType"
                  className="w-full p-2 rounded bg-gray-100 focus:outline-none border-none"
                  required
                >
                  {alertTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Field>
              </div>

              <button
                type="submit"
                className={`${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-500"
                    : "bg-blue-500"
                } text-white py-2 px-4 rounded w-full font-bold`}
                disabled={isSubmitting}
              >
                Send Notification
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

export default NotificationForm;
