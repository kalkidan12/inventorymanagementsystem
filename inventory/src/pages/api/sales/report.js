// import dbConnect from "@/lib/dbConnect";
// import Product from "@/models/Product";
// import Sales from "@/models/Sales";
// import { verifyToken, checkRole } from "@/lib/auth/token";

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   await dbConnect();

//   try {
//     await verifyToken(req, res, async () => {
//       await checkRole(["company_owner"])(req, res, async () => {
//         const {
//           page = 1,
//           limit = 10,
//           sortField = "saleDate",
//           sortOrder = "desc",
//           startDate,
//           endDate,
//           dateType,
//           productLocation,
//           productType,
//         } = req.query;

//         const query = { companyOwner: req.user._id };

//         let now = new Date();
//         let start, end;

//         if (dateType === "day") {
//           start = new Date(now.setHours(0, 0, 0, 0));
//           end = new Date(now.setHours(23, 59, 59, 999));
//         } else if (dateType === "week") {
//           const firstDay = new Date(now.setDate(now.getDate() - now.getDay()));
//           const lastDay = new Date(firstDay);
//           lastDay.setDate(firstDay.getDate() + 6);
//           start = new Date(firstDay.setHours(0, 0, 0, 0));
//           end = new Date(lastDay.setHours(23, 59, 59, 999));
//         } else if (dateType === "month") {
//           start = new Date(now.getFullYear(), now.getMonth(), 1);
//           end = new Date(
//             now.getFullYear(),
//             now.getMonth() + 1,
//             0,
//             23,
//             59,
//             59,
//             999
//           );
//         } else if (startDate && endDate) {
//           start = new Date(startDate);
//           end = new Date(endDate);
//           end.setHours(23, 59, 59, 999);
//         } else if (startDate) {
//           start = new Date(startDate);
//           start.setHours(0, 0, 0, 0);
//           end = new Date(startDate);
//           end.setHours(23, 59, 59, 999);
//         } else if (endDate) {
//           start = new Date(endDate);
//           start.setHours(0, 0, 0, 0);
//           end = new Date(endDate);
//           end.setHours(23, 59, 59, 999);
//         }

//         if (start && end) {
//           query.saleDate = { $gte: start, $lte: end };
//         }

//         const rawReports = await Sales.find(query)
//           .populate({
//             path: "salesItems.product",
//             model: Product,
//             select:
//               "ProductName ProductImage ProductBarcode ProductTax ProductCost ProductPrice ProductLocation",
//           })
//           .populate({
//             path: "processedBy",
//             select: "name",
//           });

//         const allItems = rawReports.flatMap((report) =>
//           report.salesItems.map((item) => {
//             const product = item.product || {};
//             const taxRate = product.ProductTax || 0;
//             const basePrice = product.ProductPrice || item.pricePerUnit;
//             const priceWithTax = basePrice + (basePrice * taxRate) / 100;

//             return {
//               _id: report._id,
//               saleDate: report.saleDate,
//               processedBy: report.processedBy,
//               product,
//               productName: item.productName,
//               productBarcode: item.productBarcode,
//               quantitySold: item.quantitySold,
//               pricePerUnit: priceWithTax,
//               priceWithoutTax: basePrice,
//               totalItemPrice: item.quantitySold * priceWithTax,
//             };
//           })
//         );

//         const sorted = [...allItems].sort((a, b) => {
//           const valueA = getNestedValue(a, sortField);
//           const valueB = getNestedValue(b, sortField);

//           if (typeof valueA === "number" && typeof valueB === "number") {
//             return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
//           }

//           return sortOrder === "asc"
//             ? String(valueA).localeCompare(String(valueB))
//             : String(valueB).localeCompare(String(valueA));
//         });

//         const paginated = sorted.slice((page - 1) * limit, page * limit);

//         return res.status(200).json({
//           reports: paginated,
//           totalReports: allItems.length,
//           hasNext: page * limit < allItems.length,
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Sales Report Error:", error);
//     return res.status(500).json({ message: "Failed to fetch reports" });
//   }
// }

// function getNestedValue(obj, path) {
//   return path
//     .split(".")
//     .reduce(
//       (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
//       obj
//     );
// }

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
        const {
          page = 1,
          limit = 10,
          sortField = "saleDate",
          sortOrder = "desc",
          startDate,
          endDate,
          dateType,
          productLocation,
          productType,
        } = req.query;

        const query = { companyOwner: req.user._id };

        // 🗓️ Date filtering
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

        // Fetch sales with populated products and users
        const rawReports = await Sales.find(query)
          .populate({
            path: "salesItems.product",
            model: Product,
            select:
              "ProductName ProductImage ProductBarcode ProductTax ProductCost ProductPrice ProductLocation ProductType",
          })
          .populate({
            path: "processedBy",
            select: "name",
          });

        // Flatten & Filter based on productLocation and productType
        const allItems = rawReports.flatMap((report) =>
          report.salesItems
            .filter((item) => {
              const product = item.product;
              if (!product) return false;

              if (
                productLocation &&
                product.ProductLocation !== productLocation
              )
                return false;

              if (productType && product.ProductType !== productType)
                return false;

              return true;
            })
            .map((item) => {
              const product = item.product || {};
              const taxRate = product.ProductTax || 0;
              const basePrice = product.ProductPrice || item.pricePerUnit;
              const priceWithTax = basePrice + (basePrice * taxRate) / 100;

              return {
                _id: report._id,
                saleDate: report.saleDate,
                processedBy: report.processedBy,
                product,
                productName: item.productName,
                productBarcode: item.productBarcode,
                quantitySold: item.quantitySold,
                pricePerUnit: priceWithTax,
                priceWithoutTax: basePrice,
                totalItemPrice: item.quantitySold * priceWithTax,
              };
            })
        );

        // 🔃 Sorting
        const sorted = [...allItems].sort((a, b) => {
          const valueA = getNestedValue(a, sortField);
          const valueB = getNestedValue(b, sortField);

          if (typeof valueA === "number" && typeof valueB === "number") {
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
          }

          return sortOrder === "asc"
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
        });

        // 📄 Pagination
        const paginated = sorted.slice((page - 1) * limit, page * limit);

        return res.status(200).json({
          reports: paginated,
          totalReports: allItems.length,
          hasNext: page * limit < allItems.length,
        });
      });
    });
  } catch (error) {
    console.error("Sales Report Error:", error);
    return res.status(500).json({ message: "Failed to fetch reports" });
  }
}

// 🛠 Helper
function getNestedValue(obj, path) {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : null),
      obj
    );
}
