import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import User from "@/models/User";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      try {
        const users = await User.find({
          role: "company_owner",
        }).select("email");

        res.status(200).json({ users });
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch users." });
      }
    });
  });
}
