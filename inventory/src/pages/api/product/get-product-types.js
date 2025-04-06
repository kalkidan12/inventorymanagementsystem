import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });
  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      checkRole(["company_owner"])(req, res, async () => {
        // Convert to string to match stored value
        const ownerId = req.user._id.toString();
        const productTypes = await Product.distinct("ProductType", {
          companyOwner: ownerId,
          ProductType: { $ne: "" },
        });
        return res.status(200).json({
          message: "Product types retrieved successfully",
          productTypes,
        });
      });
    });
  } catch (error) {
    console.error("Get Types Error:", error);
    return res.status(500).json({ message: "Failed to fetch product types" });
  }
}
