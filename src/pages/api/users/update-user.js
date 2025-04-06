import bcrypt from "bcrypt";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  verifyToken(req, res, async () => {
    const { id } = req.query;
    const updates = { ...req.body };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    try {
      const currentUser = req.user;
      const targetUser = await User.findById(id);
      if (!targetUser)
        return res.status(404).json({ message: "User not found" });

      if (currentUser.role === "admin") {
        // Admin cannot change role or sensitive fields
        delete updates.role;
      } else if (currentUser.role === "company_owner") {
        // Company owners can only update sales that belong to them
        if (
          targetUser.role !== "sales" ||
          String(targetUser.companyOwner) !== String(currentUser._id)
        ) {
          return res
            .status(403)
            .json({ message: "Not authorized to update this user" });
        }
      } else {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
      });
      res
        .status(200)
        .json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Update User Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
