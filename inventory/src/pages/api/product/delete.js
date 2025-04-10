import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["company_owner"])(req, res, async () => {
        const { id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: "Invalid product ID" });
        }

        const product = await Product.findOne({
          _id: id,
          companyOwner: req.user._id,
        });

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        // ✅ Step 1: Remove the image from /uploads
        if (product.ProductImage) {
          try {
            // Make sure it's a relative path starting with /uploads/
            if (product.ProductImage.startsWith("/uploads/")) {
              const uploadsDir = path.resolve(process.cwd(), "../uploads");
              const filePath = path.join(
                uploadsDir,
                path.basename(product.ProductImage)
              );

              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            }
          } catch (err) {
            console.warn("Failed to delete product image:", err);
          }
        }

        // ✅ Step 2: Delete the product from DB
        await Product.deleteOne({ _id: id });

        return res
          .status(200)
          .json({ message: "Product and image deleted successfully" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete product" });
  }
}
