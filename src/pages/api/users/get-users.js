import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  verifyToken(req, res, async () => {
    const {
      page = 1,
      limit = 10,
      sortField = "createdAt",
      sortOrder = "desc",
      searchTerm = "",
    } = req.query;

    const currentUser = req.user;
    const skip = (page - 1) * limit;

    const query = {
      _id: { $ne: currentUser._id },
    };

    if (currentUser.role === "admin") {
      query.role = "company_owner";
    } else if (currentUser.role === "company_owner") {
      query.role = "sales";
      query.companyOwner = currentUser._id;
    } else {
      return res.status(403).json({ message: "Not authorized to view users" });
    }

    // 🔍 Add text search support
    if (searchTerm.trim()) {
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
        { phoneNumber: { $regex: searchTerm, $options: "i" } },
      ];
    }

    try {
      const users = await User.find(query)
        .select("-password")
        .skip(Number(skip))
        .limit(Number(limit))
        .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 });

      const totalUsers = await User.countDocuments(query);

      return res.status(200).json({
        users,
        totalUsers,
        currentPage: Number(page),
        totalPages: Math.ceil(totalUsers / limit),
        hasNext: skip + users.length < totalUsers,
      });
    } catch (err) {
      console.error("Get Users Error:", err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
}
