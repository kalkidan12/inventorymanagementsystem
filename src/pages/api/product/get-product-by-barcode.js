import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["company_owner", "sales", "admin"])(
        req,
        res,
        async () => {
          const { barcode } = req.query;

          if (!barcode) {
            return res.status(400).json({ message: "Barcode is required" });
          }

          const product = await Product.findOne({
            ProductBarcode: barcode,
            companyOwner: req.user.companyOwner || req.user._id,
          });

          if (!product) {
            return res.status(404).json({ message: "Product not found" });
          }

          return res.status(200).json(product);
        }
      );
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
