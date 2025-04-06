import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["company_owner"])(req, res, async () => {
        const {
          ProductName,
          ProductBarcode,
          ProductPrice,
          ProductQuantity,
          ...rest
        } = req.body;

        // Ensure companyOwner is attached from the verified token
        const companyOwnerId = req.user._id;

        const existingProduct = await Product.findOne({
          companyOwner: companyOwnerId,
          ProductBarcode,
        });

        if (existingProduct) {
          return res
            .status(400)
            .json({ message: "Barcode must be unique within the company" });
        }

        const newProduct = await Product.create({
          ProductName,
          ProductBarcode,
          ProductPrice,
          ProductQuantity,
          companyOwner: companyOwnerId,
          ...rest,
        });

        return res.status(201).json({
          message: "Product created successfully",
          product: newProduct,
        });
      });
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    return res.status(500).json({ message: "Failed to create product" });
  }
}
