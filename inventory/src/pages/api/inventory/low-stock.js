import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  try {
    await verifyToken(req, res);
    checkRole(["company_owner"])(req, res, async () => {
      const companyOwner = req.user._id;
      const { threshold = 5 } = req.query; // Default low-stock threshold is 5

      const lowStockProducts = await Product.find({
        companyOwner,
        ProductQuantity: { $lte: Number(threshold) },
      }).select("ProductName ProductQuantity ProductBarcode ProductLocation");

      return res.status(200).json({
        message: "Low-stock products retrieved successfully",
        lowStockProducts,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch low-stock products" });
  }
}
