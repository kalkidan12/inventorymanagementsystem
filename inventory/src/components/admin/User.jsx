import React, { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useAddUserMutation,
  useUpdateUserMutation,
} from "@/store/api/userApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserForm from "../forms/UserFrom";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    field: "createdAt",
    order: "desc",
  });

  // Fetch user data with pagination, search, and sorting
  const {
    data: userData,
    refetch,
    isLoading,
    isError,
    error,
  } = useGetUsersQuery({
    page: currentPage,
    limit: 5,
    searchTerm,
    sortField: sortConfig.field,
    sortOrder: sortConfig.order,
  });

  const [deleteUser] = useDeleteUserMutation();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Handle delete user
  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully!", { position: "top-right" });
      refetch(); // Refetch user data after deletion
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete user.", {
        position: "top-right",
      });
    }
  };

  // Handle form submission for add/edit
  const handleSubmitUser = async (user) => {
    try {
      if (selectedUser) {
        // Edit user
        await updateUser({ id: selectedUser._id, ...user }).unwrap();
        toast.success("User updated successfully!", { position: "top-right" });
      } else {
        // Add user
        await addUser(user).unwrap();
        toast.success("User added successfully!", { position: "top-right" });
      }
      setIsFormOpen(false); // Close the form
      refetch(); // Refetch user data after adding/editing user
    } catch (error) {
      toast.error(error?.data?.message || "Failed operation.", {
        position: "top-right",
      });
    }
  };

  // Handle edit button click
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  // Handle add button click
  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  // Handle sorting
  const handleSort = (field) => {
    let order = "asc";
    if (sortConfig.field === field && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ field, order });
    refetch();
  };

  const getSortIcon = (field) => {
    if (sortConfig.field !== field) return <FaSort />;
    if (sortConfig.order === "asc") return <FaSortUp />;
    return <FaSortDown />;
  };

  useEffect(() => {}, [userData]);
  if (isLoading) {
    return <p>Loading users...</p>;
  }

  if (isError) {
    return <p>Failed to load users: {error?.data?.message}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        {/* Add User Button */}
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add User
        </button>

        {/* Search Box */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users Table */}
      <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-200 text-left">
              <button
                onClick={() => handleSort("createdAt")}
                className="flex items-center"
              >
                Joined Date
                <span className="ml-2">{getSortIcon("createdAt")}</span>
              </button>
            </th>
            <th className="px-6 py-3 bg-gray-200 text-left">
              <button
                onClick={() => handleSort("firstName")}
                className="flex items-center"
              >
                First Name
                <span className="ml-2">{getSortIcon("firstName")}</span>
              </button>
            </th>
            <th className="px-6 py-3 bg-gray-200 text-left">
              <button
                onClick={() => handleSort("lastName")}
                className="flex items-center"
              >
                Last Name
                <span className="ml-2">{getSortIcon("lastName")}</span>
              </button>
            </th>
            <th className="px-6 py-3 bg-gray-200 text-left">
              <button
                onClick={() => handleSort("email")}
                className="flex items-center"
              >
                Email
                <span className="ml-2">{getSortIcon("email")}</span>
              </button>
            </th>
            <th className="px-6 py-3 bg-gray-200 text-left">
              <button
                onClick={() => handleSort("emailVerified")}
                className="flex items-center"
              >
                Email Verified
                <span className="ml-2">{getSortIcon("emailVerified")}</span>
              </button>
            </th>
            <th className="px-6 py-3 bg-gray-200 text-left">
              <button
                onClick={() => handleSort("role")}
                className="flex items-center"
              >
                Role
                <span className="ml-2">{getSortIcon("role")}</span>
              </button>
            </th>
            <th className="px-6 py-3 bg-gray-200 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData?.users?.map((user) => (
            <tr key={user._id}>
              <td className="border px-6 py-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-6 py-4">{user.firstName}</td>
              <td className="border px-6 py-4">{user.lastName}</td>
              <td className="border px-6 py-4">{user.email}</td>
              <td className="border px-6 py-4">
                {user.emailVerified ? "Yes" : "No"}
              </td>
              <td className="border px-6 py-4">{user.role}</td>
              <td className="border px-6 py-4">
                <button
                  className="bg-green-500 text-white py-1 px-3 rounded mr-2 mb-2 w-[70px]"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded w-[75px]"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${
            currentPage === 1 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
          }  text-white py-2 px-4 rounded`}
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">Page {currentPage}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!userData?.hasNextPage}
          className={`${
            !userData?.hasNextPage
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500"
          }  text-white py-2 px-4 rounded`}
        >
          Next
        </button>
      </div>

      {/* User Form Modal */}
      {isFormOpen && (
        <UserForm
          initialValues={selectedUser}
          isEdit={!!selectedUser}
          onClose={() => setIsFormOpen(false)}
          handleSubmitUser={handleSubmitUser}
        />
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Users;
