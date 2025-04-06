import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { verifyToken, checkRole } from "@/lib/auth/token";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["company_owner"])(req, res, async () => {
        const {
          page = 1,
          limit = 10,
          sortField = "createdAt",
          sortOrder = "desc",
          productType,
          productBrand,
          productLocation,
          search,
          dateType,
          startDate,
          endDate,
        } = req.query;

        const skip = (page - 1) * limit;
        const ownerId = req.user._id;
        const query = {
          companyOwner: new mongoose.Types.ObjectId(ownerId),
        };

        if (productType) query.ProductType = productType;
        if (productBrand) query.ProductBrand = productBrand;
        if (productLocation) query.ProductLocation = productLocation;

        if (search) {
          query.$or = [
            { ProductName: { $regex: search, $options: "i" } },
            { ProductBarcode: { $regex: search, $options: "i" } },
          ];
        }

        // 🕓 Date filtering logic
        let now = new Date();
        let start, end;

        if (dateType === "day") {
          start = new Date(now.setHours(0, 0, 0, 0));
          end = new Date(now.setHours(23, 59, 59, 999));
        } else if (dateType === "week") {
          const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
          const lastDay = new Date(
            new Date(firstDay).setDate(firstDay.getDate() + 6)
          );
          start = new Date(firstDay.setHours(0, 0, 0, 0));
          end = new Date(lastDay.setHours(23, 59, 59, 999));
        } else if (dateType === "month") {
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );
        } else if (startDate && endDate) {
          start = new Date(startDate);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        } else if (startDate && !endDate) {
          start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(startDate);
          end.setHours(23, 59, 59, 999);
        } else if (!startDate && endDate) {
          start = new Date(endDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        }

        if (start && end) {
          query.RegistrationDate = { $gte: start, $lte: end };
        }

        const sort = { [sortField]: sortOrder === "asc" ? 1 : -1 };

        const products = await Product.find(query)
          .sort(sort)
          .skip(Number(skip))
          .limit(Number(limit));

        const totalProducts = await Product.countDocuments(query);

        return res.status(200).json({
          message: "Products retrieved successfully",
          products,
          totalProducts,
          hasNext: skip + products.length < totalProducts,
        });
      });
    });
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
}
