import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import Notification from "@/models/Notification";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      const { id } = req.query;

      try {
        const deletedNotification = await Notification.findByIdAndDelete(id);
        if (!deletedNotification) {
          return res.status(404).json({ message: "Notification not found." });
        }
        res.status(200).json({ message: "Notification deleted successfully." });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete notification." });
      }
    });
  });
}
