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
        // Exclude empty string values
        const productLocations = await Product.distinct("ProductLocation", {
          companyOwner: ownerId,
          ProductLocation: { $ne: "" },
        });
        return res.status(200).json({
          message: "Product locations retrieved successfully",
          productLocations,
        });
      });
    });
  } catch (error) {
    console.error("Get Locations Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch product locations" });
  }
}
