// import {
//   useDeleteNotificationMutation,
//   useGetNotificationsQuery,
// } from "@/store/api/notificationApiSlice";
// import React, { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import NotificationForm from "../forms/NotificationForm";
// import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// const Notifications = () => {
//   const [sortField, setSortField] = useState("createdAt");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const {
//     data: notifications,
//     refetch,
//     isLoading,
//     isError,
//     error,
//   } = useGetNotificationsQuery({
//     page: currentPage,
//     limit: 5,
//     sortField,
//     sortOrder,
//     searchTerm,
//   });

//   const [deleteNotification] = useDeleteNotificationMutation();
//   const [showForm, setShowForm] = useState(false);
//   const [viewNotification, setViewNotification] = useState(null);

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//     refetch();
//   };

//   const renderSortIndicator = (field) => {
//     if (sortField === field) {
//       return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
//     }
//     return <FaSort />; // Neutral sort icon when no sorting is applied
//   };

//   const handleDelete = async (id) => {
//     try {
//       await deleteNotification(id).unwrap();
//       toast.success("Notification deleted successfully!");
//       refetch();
//     } catch (error) {
//       toast.error(error.data.message || "Failed to delete notification.");
//     }
//   };

//   const handlePreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//       refetch();
//     }
//   };

//   const handleNextPage = () => {
//     if (notifications?.hasNextPage) {
//       setCurrentPage((prev) => prev + 1);
//       refetch();
//     }
//   };

//   useEffect(() => {}, [notifications]);

//   if (isLoading) {
//     return <p>Loading Notifications...</p>;
//   }

//   if (isError) {
//     return <p>Failed to load Notifications: {error.data.message}</p>;
//   }

//   return (
//     <div className="w-full">
//       <button
//         className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
//         onClick={() => setShowForm(true)}
//       >
//         Add Notification
//       </button>

//       {showForm && <NotificationForm onClose={() => setShowForm(false)} />}

//       {/* Search Box */}
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="Search by email or subject"
//         className="ml-2 w-[300px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
//       />

//       <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
//         <thead>
//           <tr>
//             <th
//               className="px-6 py-3 bg-gray-200 text-left cursor-pointer"
//               onClick={() => handleSort("createdAt")}
//             >
//               <div className="flex items-center">
//                 Created At {renderSortIndicator("createdAt")}
//               </div>
//             </th>
//             <th
//               className="px-6 py-3 bg-gray-200 text-left cursor-pointer"
//               onClick={() => handleSort("to")}
//             >
//               <div className="flex items-center">
//                 To {renderSortIndicator("to")}
//               </div>
//             </th>
//             <th
//               className="px-6 py-3 bg-gray-200 text-left cursor-pointer"
//               onClick={() => handleSort("subject")}
//             >
//               <div className="flex items-center">
//                 Subject {renderSortIndicator("subject")}
//               </div>
//             </th>
//             <th
//               className="px-6 py-3 bg-gray-200 text-left cursor-pointer"
//               onClick={() => handleSort("alertType")}
//             >
//               <div className="flex items-center">
//                 Alert Type {renderSortIndicator("alertType")}
//               </div>
//             </th>
//             <th className="px-6 py-3 bg-gray-200 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {notifications?.notifications?.map((notification) => (
//             <tr key={notification._id}>
//               <td className="border px-6 py-4">
//                 {new Date(notification.createdAt).toLocaleDateString()}
//               </td>
//               <td className="border px-6 py-4">{notification.to.join(", ")}</td>
//               <td className="border px-6 py-4">{notification.subject}</td>
//               <td className="border px-6 py-4">{notification.alertType}</td>
//               <td className="border px-6 py-4">
//                 <div className="flex flex-col space-y-2">
//                   <button
//                     className="bg-green-500 text-white py-1 px-3 rounded w-[70px]"
//                     onClick={() => setViewNotification(notification)}
//                   >
//                     View
//                   </button>
//                   <button
//                     className="bg-red-500 text-white py-1 px-3 rounded w-[70px]"
//                     onClick={() => handleDelete(notification._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Pagination Controls */}
//       {notifications?.notifications?.length > 0 && (
//         <div className="flex justify-between items-center mt-4 w-1/4 mx-auto">
//           <button
//             className={`${
//               currentPage === 1
//                 ? "bg-gray-500  cursor-not-allowed"
//                 : "bg-blue-500"
//             } text-white py-2 px-4 rounded`}
//             onClick={handlePreviousPage}
//             disabled={currentPage === 1}
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             {currentPage} of {Math.ceil(notifications?.totalNotifications / 10)}
//           </span>
//           <button
//             className={`${
//               notifications?.hasNextPage
//                 ? "bg-blue-500"
//                 : "bg-gray-500 cursor-not-allowed"
//             } text-white py-2 px-4 rounded`}
//             onClick={handleNextPage}
//             disabled={!notifications?.hasNextPage}
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* View Notification Details */}
//       {viewNotification && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg p-8 w-4/5 shadow-lg max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4">
//               {viewNotification.subject}
//             </h2>
//             <div
//               className="prose max-w-none text-gray-700"
//               dangerouslySetInnerHTML={{ __html: viewNotification.content }}
//             />
//             <button
//               onClick={() => setViewNotification(null)}
//               className="mt-4 text-red-500 hover:underline text-sm"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default Notifications;

import React from "react";

const Notifications = () => {
  return <div>Notifications</div>;
};

export default Notifications;
