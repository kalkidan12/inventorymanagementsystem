import bcrypt from "bcrypt";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  verifyToken(req, res, async () => {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      }).select("-password");
      res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
