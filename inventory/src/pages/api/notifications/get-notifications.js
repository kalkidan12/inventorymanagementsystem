import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import Notification from "@/models/Notification";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      const {
        page = 1,
        limit = 5,
        sortField = "createdAt",
        sortOrder = "desc",
        searchTerm = "",
      } = req.query;
      const skip = (page - 1) * limit;

      // Filter for search by 'to' (email) and 'subject'
      let filterOptions = {};
      if (searchTerm) {
        const regex = { $regex: searchTerm, $options: "i" }; // Case-insensitive search
        filterOptions.$or = [{ to: regex }, { subject: regex }];
      }

      try {
        const notifications = await Notification.find(filterOptions)
          .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
          .skip(skip)
          .limit(Number(limit));

        const totalNotifications = await Notification.countDocuments(
          filterOptions
        );
        const hasNextPage = totalNotifications > page * limit;

        res.status(200).json({
          notifications,
          totalNotifications,
          hasNextPage,
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch notifications." });
      }
    });
  });
}
