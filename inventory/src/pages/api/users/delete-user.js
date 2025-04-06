import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });
  await connectDB();

  verifyToken(req, res, async () => {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "User ID required" });
    try {
      const targetUser = await User.findById(id);
      if (!targetUser)
        return res.status(404).json({ message: "User not found" });

      const creator = req.user;
      if (creator.role === "admin") {
        // Admin can only delete company_owner users.
        if (targetUser.role !== "company_owner") {
          return res
            .status(403)
            .json({ message: "Admin can only delete company_owner accounts" });
        }
        // Delete all sales under this company_owner
        await User.deleteMany({ companyOwner: targetUser._id });
      } else if (creator.role === "company_owner") {
        // Company owners can only delete sales that belong to them.
        if (
          targetUser.role !== "sales" ||
          String(targetUser.companyOwner) !== String(creator._id)
        ) {
          return res
            .status(403)
            .json({ message: "You can only delete your own sales accounts" });
        }
      } else {
        return res
          .status(403)
          .json({ message: "Not authorized to delete user" });
      }

      await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete User Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
