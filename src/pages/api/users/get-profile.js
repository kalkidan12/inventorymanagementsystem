import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  verifyToken(req, res, async () => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ user });
    } catch (error) {
      console.error("Get Profile Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
