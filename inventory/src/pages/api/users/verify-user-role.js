import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";

await connectDB();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["sales", "company_owner", "admin"])(req, res, async () => {
      try {
        res.status(200).json({ _id: req.user._id, role: req.user.role });
      } catch (error) {
        res.status(500).json({ message: "Failed to verify user role." });
      }
    });
  });
}
