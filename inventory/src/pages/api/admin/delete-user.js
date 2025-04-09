import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  await verifyToken(req, res, async () => {
    await checkRole(["admin"])(req, res, async () => {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "User ID required" });

      try {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted)
          return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "User deleted successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting user" });
      }
    });
  });
}
