import { checkRole, verifyToken } from "@/lib/auth/token";
import connectDB from "@/lib/dbConnect";
import Message from "@/models/Message";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      try {
        const {
          page = 1,
          limit = 10,
          sortField = "createdAt",
          sortOrder = "desc",
          searchTerm = "",
        } = req.query;

        const skip = (page - 1) * limit;

        const filter = {};
        if (searchTerm?.trim()) {
          filter.email = { $regex: searchTerm.trim(), $options: "i" };
        }

        const sort = {};
        sort[sortField] = sortOrder === "asc" ? 1 : -1;

        const messages = await Message.find(filter)
          .sort(sort)
          .skip(Number(skip))
          .limit(Number(limit));

        const totalMessages = await Message.countDocuments(filter);
        const hasNextPage = skip + messages.length < totalMessages;

        return res.status(200).json({
          messages,
          totalMessages,
          hasNextPage,
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Failed to get messages." });
      }
    });
  });
}
