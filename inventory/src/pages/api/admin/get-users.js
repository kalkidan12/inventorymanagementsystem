import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  await verifyToken(req, res, async () => {
    await checkRole(["admin"])(req, res, async () => {
      const {
        page = 1,
        limit = 10,
        sortField = "createdAt",
        sortOrder = "desc",
        searchTerm = "",
      } = req.query;

      const skip = (page - 1) * limit;
      const query = {
        role: { $in: ["admin", "company_owner"] },
        _id: { $ne: req.user._id }, // ✅ Exclude current admin
        ...(searchTerm && {
          $or: [
            { name: new RegExp(searchTerm, "i") },
            { email: new RegExp(searchTerm, "i") },
            { phoneNumber: new RegExp(searchTerm, "i") },
          ],
        }),
      };

      try {
        const users = await User.find(query)
          .select("-password")
          .skip(Number(skip))
          .limit(Number(limit))
          .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 });

        const totalUsers = await User.countDocuments(query);

        res.status(200).json({
          users,
          totalUsers,
          currentPage: Number(page),
          totalPages: Math.ceil(totalUsers / limit),
          hasNext: skip + users.length < totalUsers,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to get users" });
      }
    });
  });
}
