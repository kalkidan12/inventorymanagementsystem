import React, { useState } from "react";
import { useReplyMessageMutation } from "@/store/api/messageApiSlice";
import { toast } from "react-toastify";

const ReplyForm = ({ initialValues, onClose }) => {
  const [reply, setReply] = useState("");
  const [subject, setSubject] = useState("");
  const [replyMessage, { isLoading }] = useReplyMessageMutation();

  const handleSubmit = async () => {
    if (!reply.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }

    try {
      await replyMessage({
        id: initialValues._id,
        reply,
        subject,
      }).unwrap();

      toast.success("Reply sent successfully!");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send reply.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-lg max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Reply to <span className="text-blue-600">{initialValues?.email}</span>
        </h2>

        {/* User Message Display */}
        <div className="bg-gray-100 border border-gray-300 text-gray-800 p-4 mb-4 rounded w-full max-h-[300px] overflow-y-auto whitespace-pre-line">
          {initialValues?.message}
        </div>

        {/* Subject Field */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Reply Subject"
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Reply Textarea */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Reply</label>
          <textarea
            rows={6}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write your reply..."
            className="w-full px-4 py-2 border rounded resize-none"
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyForm;
