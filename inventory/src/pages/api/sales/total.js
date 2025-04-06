import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Sales from "@/models/Sales";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["company_owner"])(req, res, async () => {
        const { dateType, startDate, endDate, productLocation, productType } =
          req.query;

        const query = { companyOwner: req.user._id };

        // 🗓️ Date Filtering Logic
        let now = new Date();
        let start, end;

        if (dateType === "day") {
          start = new Date(now.setHours(0, 0, 0, 0));
          end = new Date(now.setHours(23, 59, 59, 999));
        } else if (dateType === "week") {
          const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
          const lastDay = new Date(firstDay);
          lastDay.setDate(firstDay.getDate() + 6);
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
        } else if (startDate) {
          start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(startDate);
          end.setHours(23, 59, 59, 999);
        } else if (endDate) {
          start = new Date(endDate);
          start.setHours(0, 0, 0, 0);
          end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
        }

        if (start && end) {
          query.saleDate = { $gte: start, $lte: end };
        }

        // 👉 Fetch sales and populate product details
        const rawReports = await Sales.find(query).populate({
          path: "salesItems.product",
          model: Product,
          select: "ProductPrice ProductTax ProductLocation ProductType",
        });

        // 🔍 Filter salesItems and calculate priceWithTax manually
        let totalSalesWithTax = 0;

        rawReports.forEach((report) => {
          report.salesItems.forEach((item) => {
            const product = item.product;
            if (!product) return;

            // Apply filters
            if (productLocation && product.ProductLocation !== productLocation)
              return;
            if (productType && product.ProductType !== productType) return;

            const basePrice = product.ProductPrice || 0;
            const taxRate = product.ProductTax || 0;
            const priceWithTax = basePrice + (basePrice * taxRate) / 100;
            const totalItemPrice = priceWithTax * item.quantitySold;

            totalSalesWithTax += totalItemPrice;
          });
        });

        return res.status(200).json({
          totalSales: +totalSalesWithTax.toFixed(2),
        });
      });
    });
  } catch (error) {
    console.error("Total Sales Error:", error);
    return res.status(500).json({
      message: "Failed to calculate total sales",
    });
  }
}
