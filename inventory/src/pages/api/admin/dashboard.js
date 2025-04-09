import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await connectDB();

  await verifyToken(req, res, async () => {
    await checkRole(["admin"])(req, res, async () => {
      try {
        const [totalUsers, totalAdmins, totalOwners, totalSales] =
          await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "company_owner" }),
            User.countDocuments({ role: "sales" }),
          ]);

        const totalSubscribedUsers = await User.countDocuments({
          inventorySubscribed: true,
        });

        const uniqueCompanies = await User.distinct("companyName", {
          role: "company_owner",
        });

        const totalProducts = await Product.countDocuments();
        const totalProductPrice = await Product.aggregate([
          {
            $group: {
              _id: null,
              total: { $sum: "$ProductPrice" },
            },
          },
        ]);

        const totalWarehouses = await Product.distinct("ProductWarehouse");

        return res.status(200).json({
          totalUsers,
          totalAdmins,
          totalOwners,
          totalSales,
          totalSubscribedUsers,
          totalCompanies: uniqueCompanies.length,
          totalProducts,
          totalProductPrice:
            totalProductPrice.length > 0 ? totalProductPrice[0].total : 0,
          totalLocations: totalWarehouses.length,
        });
      } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Failed to load dashboard metrics" });
      }
    });
  });
}
