import React, { useState, useEffect } from "react";
import {
  useGetMessagesQuery,
  useDeleteMessageMutation,
} from "@/store/api/messageApiSlice";
import { toast, ToastContainer } from "react-toastify";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import MessageForm from "../forms/MessageForm";
import ReplyForm from "../forms/ReplyForm"; // ✅ Custom reply component

const Messages = () => {
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, refetch, isLoading, isError, error } = useGetMessagesQuery({
    page: currentPage,
    limit: 10,
    sortField,
    sortOrder,
    searchTerm,
  });

  const [deleteMessage] = useDeleteMessageMutation();

  const [replyModal, setReplyModal] = useState(null);
  const [showMessageForm, setShowMessageForm] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort />;
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id).unwrap();
      toast.success("Message deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete message");
    }
  };

  const handleNextPage = () => {
    if (data?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    refetch();
  }, [currentPage, sortField, sortOrder]);

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>

      {/* Send Message Button */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by email"
            className="px-4 py-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
              refetch();
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Clear
          </button>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={() => setShowMessageForm(true)}
        >
          Send Message
        </button>
      </div>

      {/* Message Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email {renderSortIcon("email")}
                </div>
              </th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("subject")}
              >
                <div className="flex items-center gap-1">
                  Subject {renderSortIcon("subject")}
                </div>
              </th>
              <th className="p-3">Message</th>
              <th
                className="p-3 cursor-pointer"
                onClick={() => handleSort("seen")}
              >
                <div className="flex items-center gap-1">
                  Seen {renderSortIcon("seen")}
                </div>
              </th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-red-500">
                  {error?.data?.message || "Failed to load messages"}
                </td>
              </tr>
            ) : (
              data?.messages.map((msg) => (
                <tr key={msg._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{msg.email}</td>
                  <td className="p-3">{msg.subject}</td>
                  <td className="p-3 truncate max-w-[300px]">{msg.message}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        msg.seen
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {msg.seen ? "Seen" : "Unseen"}
                    </span>
                  </td>
                  <td className="flex items-center justify-center gap-2 p-3 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => setReplyModal(msg)}
                    >
                      Reply
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(msg._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.messages?.length > 0 && (
        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 ${
              currentPage != 1 ? "" : "cursor-not-allowed"
            }`}
          >
            Previous
          </button>
          <span className="font-medium text-gray-600">
            Page {currentPage} of {Math.ceil(data?.totalMessages / 10)}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!data?.hasNextPage}
            className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50 ${
              data?.hasNextPage ? "" : "cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* ✅ Reply Modal using custom ReplyForm */}
      {replyModal && (
        <ReplyForm
          initialValues={replyModal}
          onClose={() => {
            setReplyModal(null);
            refetch();
          }}
        />
      )}

      {/* ✅ Send Message Modal */}
      {showMessageForm && (
        <MessageForm onClose={() => setShowMessageForm(false)} />
      )}

      <ToastContainer />
    </div>
  );
};

export default Messages;
