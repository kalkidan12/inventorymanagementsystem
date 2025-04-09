import { useState } from "react";
import {
  useGetUsersForAdminQuery,
  useAddUserForAdminMutation,
  useUpdateUserForAdminMutation,
  useDeleteUserForAdminMutation,
} from "@/store/api/adminApiSlice";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

const boolOptions = [
  { label: "True", value: true },
  { label: "False", value: false },
];

const userRoles = ["admin", "company_owner"];

const Users = () => {
  const [search, setSearch] = useState("");
  const [searchApplied, setSearchApplied] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [editingPasswordVisible, setEditingPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "company_owner",
    companyName: "",
    isActive: false,
    emailVerified: false,
    inventoryTrialStarted: false,
    inventorySubscribed: false,
  });

  const { data, isLoading, refetch } = useGetUsersForAdminQuery({
    searchTerm: searchApplied,
    sortField,
    sortOrder,
    page,
  });

  const [addUser] = useAddUserForAdminMutation();
  const [updateUser] = useUpdateUserForAdminMutation();
  const [deleteUser] = useDeleteUserForAdminMutation();

  const sanitizeInput = (val) => (typeof val === "string" ? val.trim() : val);

  const validateUserData = (user, isNew = false) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    const phoneRegex = /^\+?\d{7,15}$/;
    if (
      !user.name ||
      !user.email ||
      !user.phoneNumber ||
      !user.role ||
      !user.companyName
    ) {
      toast.error("All fields except password are required.");
      return false;
    }
    if (!emailRegex.test(user.email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!phoneRegex.test(user.phoneNumber)) {
      toast.error("Invalid phone number.");
      return false;
    }
    if ((isNew || user.password) && user.password.length < 6) {
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

  const handleChange = (e, field, isBool = false) => {
    const value = isBool ? e.target.value === "true" : e.target.value;
    setEditableData((prev) => ({
      ...prev,
      [field]: sanitizeInput(value),
    }));
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setEditableData({ ...user, password: "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditableData({});
  };

  const handleSave = async (id) => {
    const payload = { ...editableData };
    if (!payload.password) delete payload.password;
    if (!validateUserData(payload)) return;

    try {
      await updateUser({ id, ...payload }).unwrap();
      toast.success("User updated!");
      cancelEdit();
      refetch();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("User deleted!");
        refetch();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleAddUser = async () => {
    const payload = { ...formData };
    if (!validateUserData(payload, true)) return;

    try {
      await addUser(payload).unwrap();
      toast.success("User added!");
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "company_owner",
        companyName: "",
        isActive: false,
        emailVerified: false,
        inventoryTrialStarted: false,
        inventorySubscribed: false,
      });
      setShowAddForm(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Add user failed");
    }
  };

  const clearSearch = () => {
    setSearch("");
    setSearchApplied("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Admin Users</h1>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={() => setSearchApplied(search)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={clearSearch}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Clear
        </button>
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <FaPlus className="inline mr-1" />
          {showAddForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {/* ➕ Add Form */}
      {showAddForm && (
        <div className="bg-blue-50 border p-4 mb-6 rounded grid sm:grid-cols-2 gap-4">
          {[
            { name: "name", label: "Full Name" },
            { name: "email", label: "Email" },
            { name: "phoneNumber", label: "Phone Number" },
            { name: "companyName", label: "Company Name" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type="text"
                value={formData[name]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [name]: sanitizeInput(e.target.value),
                  }))
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded"
            >
              {userRoles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: sanitizeInput(e.target.value),
                }))
              }
              className="w-full border px-3 py-2 rounded pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-8"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {[
            "isActive",
            "emailVerified",
            "inventoryTrialStarted",
            "inventorySubscribed",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1">{field}</label>
              <select
                value={formData[field]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [field]: e.target.value === "true",
                  }))
                }
                className="w-full border px-3 py-2 rounded"
              >
                {boolOptions.map(({ label, value }) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="sm:col-span-2 flex justify-end mt-2">
            <button
              onClick={handleAddUser}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* 📋 Table */}
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              {[
                "name",
                "email",
                "phoneNumber",
                "companyName",
                "role",
                "isActive",
                "emailVerified",
                "inventoryTrialStarted",
                "inventoryTrialStartedDate",
                "inventoryTrialEnddDate",
                "inventorySubscribed",
                "password",
                "actions",
              ].map((h) => (
                <th
                  key={h}
                  onClick={() => h !== "actions" && handleSort(h)}
                  className={`px-3 py-2 whitespace-nowrap ${
                    h !== "actions" ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span>{h.charAt(0).toUpperCase() + h.slice(1)}</span>
                    {sortField === h && h !== "actions" && (
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="13" className="p-4 text-center text-gray-500">
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
                    "companyName",
                    "role",
                    "isActive",
                    "emailVerified",
                    "inventoryTrialStarted",
                    "inventoryTrialStartedDate",
                    "inventoryTrialEnddDate",
                    "inventorySubscribed",
                  ].map((f) => (
                    <td key={f} className="px-3 py-2">
                      {editingId === user._id ? (
                        f === "role" ? (
                          <select
                            value={editableData[f]}
                            onChange={(e) => handleChange(e, f)}
                            className="border rounded w-full"
                          >
                            {userRoles.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        ) : typeof user[f] === "boolean" ? (
                          <select
                            value={editableData[f]}
                            onChange={(e) => handleChange(e, f, true)}
                            className="border rounded w-full"
                          >
                            {boolOptions.map(({ label, value }) => (
                              <option key={label} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        ) : f.includes("Date") ? (
                          <input
                            type="date"
                            value={
                              editableData[f]
                                ? moment(editableData[f]).format("YYYY-MM-DD")
                                : ""
                            }
                            onChange={(e) =>
                              setEditableData((prev) => ({
                                ...prev,
                                [f]: e.target.value,
                              }))
                            }
                            className="border rounded w-full"
                          />
                        ) : (
                          <input
                            type="text"
                            value={editableData[f] || ""}
                            onChange={(e) => handleChange(e, f)}
                            className="border rounded w-full"
                          />
                        )
                      ) : f.includes("Date") && user[f] ? (
                        moment(user[f]).format("MMM D YYYY")
                      ) : (
                        user[f]?.toString() || "N/A"
                      )}
                    </td>
                  ))}

                  {/* 🔐 Password */}
                  <td className="px-3 py-2">
                    {editingId === user._id ? (
                      <input
                        type={editingPasswordVisible ? "text" : "password"}
                        placeholder="New password"
                        value={editableData.password}
                        onChange={(e) =>
                          setEditableData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="border rounded w-full"
                      />
                    ) : (
                      "••••••"
                    )}
                  </td>

                  {/* ✏️ Actions */}
                  <td className="px-3 py-2 flex gap-2">
                    {editingId === user._id ? (
                      <>
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded"
                          onClick={() => handleSave(user._id)}
                        >
                          <FaSave />
                        </button>
                        <button
                          className="bg-gray-400 text-white px-2 py-1 rounded"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(user._id)}
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
                <td colSpan="13" className="p-4 text-center text-gray-500">
                  No matching users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 w-full sm:w-64">
        <button
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={!data?.hasNext}
          className={`px-4 py-2 rounded ${
            !data?.hasNext
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Users;
