import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Sales from "@/models/Sales";
import { verifyToken, checkRole } from "@/lib/auth/token";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["company_owner"])(req, res, async () => {
        const {
          dateType = "all",
          startDate,
          endDate,
          productType,
          productLocation,
        } = req.query;

        const ownerId = req.user._id;

        // 📦 Base product query
        const productQuery = { companyOwner: ownerId };
        const allProducts = await Product.find(productQuery);

        // ⬆️ Unfiltered metrics
        const totalProducts = allProducts.length;
        const totalStockValue = allProducts.reduce(
          (acc, p) => acc + p.ProductCost * p.ProductQuantity,
          0
        );
        const totalLocations = [
          ...new Set(allProducts.map((p) => p.ProductLocation)),
        ].length;

        // const salesUsers = await Sales.distinct("processedBy", {
        //   companyOwner: ownerId,
        // });

        const totalSalesUsers = await User.countDocuments({
          role: "sales",
          companyOwner: ownerId,
        });

        // const totalSalesUsers = salesUsers.length;

        // 🗓️ Date filtering logic
        let start, end;
        const now = new Date();
        switch (dateType) {
          case "day":
            start = new Date(now.setHours(0, 0, 0, 0));
            end = new Date(now.setHours(23, 59, 59, 999));
            break;
          case "week":
            start = new Date(now.setDate(now.getDate() - now.getDay()));
            end = new Date(now.setDate(now.getDate() + 6));
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
          case "month":
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
            break;
          case "year":
            start = new Date(now.getFullYear(), 0, 1);
            end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
          case "range":
            if (startDate && endDate) {
              start = new Date(startDate);
              end = new Date(endDate);
              end.setHours(23, 59, 59, 999);
            }
            break;
        }

        const salesQuery = { companyOwner: ownerId };
        if (start && end) salesQuery.saleDate = { $gte: start, $lte: end };

        const filteredSales = await Sales.find(salesQuery).populate(
          "salesItems.product"
        );

        // 💡 Apply productLocation & productType filter
        const filteredItems = filteredSales.flatMap((sale) =>
          sale.salesItems.filter((item) => {
            const product = item.product;
            if (!product) return false;

            if (productType && product.ProductType !== productType)
              return false;
            if (productLocation && product.ProductLocation !== productLocation)
              return false;

            return true;
          })
        );

        const totalItemsSold = filteredItems.reduce(
          (acc, i) => acc + i.quantitySold,
          0
        );

        const totalRevenue = filteredItems.reduce((acc, i) => {
          const tax = (i.pricePerUnit * (i.product?.ProductTax || 0)) / 100;
          const taxedUnitPrice = i.pricePerUnit + tax;
          return acc + taxedUnitPrice * i.quantitySold;
        }, 0);

        const lowStock = allProducts.filter((p) => p.ProductQuantity <= 5);

        const topMap = {};
        for (const item of filteredItems) {
          const name = item.product?.ProductName || item.productName;
          if (!topMap[name]) topMap[name] = 0;
          topMap[name] += item.quantitySold;
        }

        const topProducts = Object.entries(topMap)
          .map(([productName, quantitySold]) => ({ productName, quantitySold }))
          .sort((a, b) => b.quantitySold - a.quantitySold)
          .slice(0, 10);

        return res.status(200).json({
          totalProducts,
          totalStockValue,
          totalSalesUsers,
          totalLocations,

          totalItemsSold,
          totalRevenue,
          lowStock,
          topProducts,
        });
      });
    });
  } catch (err) {
    console.error("Dashboard API Error:", err);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
}
