import { useState } from "react";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProfileQuery,
} from "@/store/api/userApiSlice";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const Users = () => {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "sales",
  });

  const { data: profileData } = useGetProfileQuery();
  const companyName = profileData?.user?.companyName || "";

  const { data, isLoading, refetch } = useGetUsersQuery({
    searchTerm: search,
    sortField,
    sortOrder,
    page,
  });

  const [addUser] = useAddUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const sanitizeInput = (val) => val.trim();

  const validateUserData = (user, isNew = false) => {
    const { name, email, phoneNumber, password } = user;
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?\d{7,15}$/;

    if (!name || !email || !phoneNumber || (isNew && !password)) {
      toast.error("All fields are required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Invalid phone number.");
      return false;
    }
    if ((isNew || password) && password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prev) =>
      sortField === field && prev === "asc" ? "desc" : "asc"
    );
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditableData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      companyName: user.companyName,
      password: "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditableData({});
  };

  const handleChange = (e, field) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: sanitizeInput(e.target.value),
    }));
  };

  const handleSave = async (id) => {
    const updatedData = { ...editableData };
    if (!updatedData.password) {
      delete updatedData.password;
    }

    if (!validateUserData(updatedData)) return;

    try {
      await updateUser({ id, ...updatedData }).unwrap();
      setEditingId(null);
      toast.success("User updated!");
      refetch();
    } catch {
      toast.error("Update failed");
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const cancelDelete = () => {
    setDeleteConfirm({ open: false, id: null });
  };

  const proceedDelete = async () => {
    try {
      await deleteUser(deleteConfirm.id).unwrap();
      toast.success("User deleted!");
      cancelDelete();
      refetch();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: sanitizeInput(e.target.value),
    }));
  };

  const handleAddUser = async () => {
    if (!validateUserData(formData, true)) return;
    try {
      await addUser({ ...formData, companyName }).unwrap();
      toast.success("User added!");
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "sales",
      });
      setShowForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Add user failed");
    }
  };

  return (
    <div className="sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 max-w-7xl mx-auto">
        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search sales by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaPlus className="inline mr-1" />
            {showForm ? "Cancel" : "Add User"}
          </button>
        </div>

        {/* Add User Form */}
        {showForm && (
          <div className="grid sm:grid-cols-2 gap-4 bg-blue-50 border rounded p-4 mb-6">
            {["name", "email", "phoneNumber"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded"
              />
            ))}
            <select
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="sales">Sales</option>
            </select>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleFormChange}
                className="w-full border px-3 py-2 rounded pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <input
              value={companyName}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
            />
            <div className="sm:col-span-2 flex justify-end">
              <button
                onClick={handleAddUser}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add User
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                {[
                  "name",
                  "email",
                  "phoneNumber",
                  "role",
                  "companyName",
                  "password",
                  "Actions",
                ].map((field) => (
                  <th
                    key={field}
                    className="p-3 text-left whitespace-nowrap cursor-pointer"
                    onClick={() => field !== "Actions" && handleSort(field)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field && (sortOrder === "asc" ? " ↑" : " ↓")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : data?.users?.length ? (
                data.users.map((user) => (
                  <tr key={user._id} className="border-t">
                    {[
                      "name",
                      "email",
                      "phoneNumber",
                      "role",
                      "companyName",
                    ].map((field) => (
                      <td key={field} className="p-2 whitespace-nowrap">
                        {editingId === user._id ? (
                          field === "role" ? (
                            <select
                              value={editableData.role}
                              onChange={(e) => handleChange(e, field)}
                              className="w-full border rounded"
                            >
                              <option value="sales">Sales</option>
                            </select>
                          ) : (
                            <input
                              value={editableData[field] || ""}
                              onChange={(e) => handleChange(e, field)}
                              className="w-full border rounded"
                            />
                          )
                        ) : (
                          user[field]
                        )}
                      </td>
                    ))}

                    {/* Password Column */}
                    <td className="p-2 whitespace-nowrap">
                      {editingId === user._id ? (
                        <div className="relative">
                          <input
                            type={editingPasswordVisible ? "text" : "password"}
                            placeholder="New Password"
                            value={editableData.password || ""}
                            onChange={(e) =>
                              setEditableData((prev) => ({
                                ...prev,
                                password: e.target.value,
                              }))
                            }
                            className="w-full border rounded px-3 py-1 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1.5 text-sm"
                            onClick={() =>
                              setEditingPasswordVisible((prev) => !prev)
                            }
                          >
                            {editingPasswordVisible ? (
                              <FaEyeSlash />
                            ) : (
                              <FaEye />
                            )}
                          </button>
                        </div>
                      ) : (
                        "••••••"
                      )}
                    </td>

                    <td className="p-2 flex gap-2">
                      {editingId === user._id ? (
                        <>
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded"
                            onClick={() => handleSave(user._id)}
                          >
                            <FaSave />
                          </button>
                          <button
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={() => handleEdit(user)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() => confirmDelete(user._id)}
                          >
                            <FaTrash />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No matching users.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="w-[200px] flex justify-between items-center mt-4">
          <button
            className={`px-4 py-2 rounded ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            className={`px-4 py-2 rounded ${
              !data?.hasNext
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={!data?.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm.open && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to delete this user?
              </h3>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded border hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={proceedDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Users;
