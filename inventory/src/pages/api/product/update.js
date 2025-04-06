import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["company_owner"])(req, res, async () => {
        const {
          id,
          ProductName,
          ProductBarcode,
          ProductPrice,
          ProductQuantity,
          ...rest
        } = req.body;

        const companyOwnerId = req.user._id;

        const existingProduct = await Product.findOne({
          _id: id,
          companyOwner: companyOwnerId,
        });

        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }

        // Ensure barcode is unique within the company if changed
        if (
          ProductBarcode &&
          ProductBarcode !== existingProduct.ProductBarcode
        ) {
          const barcodeExists = await Product.findOne({
            companyOwner: companyOwnerId,
            ProductBarcode,
          });

          if (barcodeExists) {
            return res.status(400).json({
              message: "Barcode must be unique within the company",
            });
          }
        }

        // Update fields
        existingProduct.ProductName = ProductName;
        existingProduct.ProductBarcode = ProductBarcode;
        existingProduct.ProductPrice = ProductPrice;
        existingProduct.ProductQuantity = ProductQuantity;

        Object.assign(existingProduct, rest);

        await existingProduct.save();

        return res.status(200).json({
          message: "Product updated successfully",
          product: existingProduct,
        });
      });
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    return res.status(500).json({ message: "Failed to update product" });
  }
}
