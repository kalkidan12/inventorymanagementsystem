import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";
import { useSendMessagesMutation } from "@/store/api/messageApiSlice";
import { useGetAllUserEmailsQuery } from "@/store/api/adminApiSlice";

const MessageForm = ({ onClose }) => {
  const [sendMessage] = useSendMessagesMutation();
  const { data: emailData, isLoading, isError } = useGetAllUserEmailsQuery();
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  // 🧠 Make sure emailData is an array
  const allEmails = Array.isArray(emailData) ? emailData : [];

  // Filter based on search term
  const filteredEmails = allEmails.filter((email) =>
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedEmails(checked ? [...allEmails] : []);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const emailsToSend = [
      ...selectedEmails,
      ...manualEmail
        .split(",")
        .map((e) => e.trim())
        .filter((e) => !!e),
    ];

    const uniqueEmails = [...new Set(emailsToSend)];

    if (uniqueEmails.length === 0) {
      toast.error("Please provide at least one recipient email.");
      setSubmitting(false);
      return;
    }

    try {
      await sendMessage({
        ...values,
        email: uniqueEmails,
      }).unwrap();
      toast.success("Message sent successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Send Message</h2>

        {isLoading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load users.</p>
        ) : (
          <Formik
            initialValues={{ subject: "", message: "" }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Subject */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">Subject</label>
                  <Field
                    type="text"
                    name="subject"
                    placeholder="Message Subject"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>

                {/* Manual Email Input */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Additional Emails (comma separated)
                  </label>
                  <input
                    type="text"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="e.g. test1@example.com, test2@example.com"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                {/* Select Emails */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">
                    Select Emails
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={
                        selectedEmails.length === allEmails.length &&
                        allEmails.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="mr-2"
                    />
                    <span>Select All</span>
                  </div>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search email..."
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                  />

                  <div className="h-[150px] overflow-y-auto border p-2 rounded space-y-1">
                    {filteredEmails.length > 0 ? (
                      filteredEmails.map((email) => {
                        const isSelected = selectedEmails.includes(email);
                        return (
                          <div
                            key={email}
                            onClick={() => handleSelectEmail(email)}
                            className={`cursor-pointer px-3 py-1 rounded transition-all duration-150 ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            }`}
                          >
                            {email}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-400">No users found.</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="block font-medium mb-1">Message</label>
                  <Field
                    as="textarea"
                    name="message"
                    rows={5}
                    placeholder="Write your message..."
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white rounded`}
                  >
                    Send Message
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default MessageForm;
