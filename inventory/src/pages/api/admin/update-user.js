import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  await verifyToken(req, res, async () => {
    await checkRole(["admin"])(req, res, async () => {
      const { id } = req.query;
      let updateData = req.body;

      if (!id) return res.status(400).json({ message: "User ID required" });

      try {
        // 🔐 Handle optional fields
        const fieldsToSanitize = [
          "lastSubscriptionDate",
          "subscriptionEndDate",
        ];
        fieldsToSanitize.forEach((field) => {
          if (updateData[field]) {
            updateData[field] = new Date(updateData[field]);
          }
        });

        // ❌ Don't update password if it's empty
        if (updateData.password === "") {
          delete updateData.password;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, {
          new: true,
        }).select("-password");

        if (!updatedUser)
          return res.status(404).json({ message: "User not found" });

        return res.status(200).json({
          message: "User updated",
          user: updatedUser,
        });
      } catch (err) {
        console.error("Update error:", err);
        return res.status(500).json({ message: "Error updating user" });
      }
    });
  });
}
