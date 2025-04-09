import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  await verifyToken(req, res, async () => {
    await checkRole(["admin"])(req, res, async () => {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "User ID is required" });

      try {
        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching user" });
      }
    });
  });
}
