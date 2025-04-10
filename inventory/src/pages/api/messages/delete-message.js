import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import Message from "@/models/Message";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      const { id } = req.query;

      try {
        const deleted = await Message.findByIdAndDelete(id);
        if (!deleted)
          return res.status(404).json({ message: "Message not found." });

        res.status(200).json({ message: "Message deleted." });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete message." });
      }
    });
  });
}
