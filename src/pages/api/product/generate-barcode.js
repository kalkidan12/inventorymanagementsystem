import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await dbConnect();
    await verifyToken(req, res, async () => {
      const companyOwnerId = req.user._id;
      let uniqueBarcode;
      let isUnique = false;
      while (!isUnique) {
        const randomCode = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
        uniqueBarcode = `PROD${randomCode}`;
        const existingProduct = await Product.findOne({
          ProductBarcode: uniqueBarcode,
          companyOwner: companyOwnerId,
        });
        if (!existingProduct) {
          isUnique = true;
        }
      }
      return res
        .status(200)
        .json({ message: "Barcode generated", barcode: uniqueBarcode });
    });
  } catch (error) {
    console.error("Barcode generation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
