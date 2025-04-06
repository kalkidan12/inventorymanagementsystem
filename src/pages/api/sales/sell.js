import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Sales from "@/models/Sales";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    await verifyToken(req, res, async () => {
      await checkRole(["sales", "company_owner"])(req, res, async () => {
        const { salesItems } = req.body;

        if (
          !salesItems ||
          !Array.isArray(salesItems) ||
          salesItems.length === 0
        ) {
          return res.status(400).json({ message: "No sales items provided" });
        }

        const processedBy = req.user._id;
        const companyOwner =
          req.user.role === "company_owner"
            ? req.user._id
            : req.user.companyOwner;

        if (!companyOwner) {
          return res
            .status(400)
            .json({ message: "Missing company owner for the sale." });
        }

        let totalSaleAmount = 0;
        const salesEntries = [];

        for (const item of salesItems) {
          const barcode = item.productBarcode?.trim();
          const quantityToSell = Number(item.quantitySold);

          if (!barcode || !quantityToSell || quantityToSell <= 0) {
            return res.status(400).json({
              message: `Invalid product barcode or quantity in sales item.`,
            });
          }

          const product = await Product.findOne({
            companyOwner: companyOwner.toString(),
            ProductBarcode: barcode,
          });

          if (!product) {
            return res.status(404).json({
              message: `Product with barcode ${barcode} not found.`,
            });
          }

          if (product.ProductQuantity <= 0) {
            return res.status(400).json({
              message: `Product "${product.ProductName}" is out of stock.`,
            });
          }

          if (product.ProductQuantity < quantityToSell) {
            return res.status(400).json({
              message: `Only ${product.ProductQuantity} left in stock for "${product.ProductName}".`,
            });
          }

          // Deduct stock
          product.ProductQuantity -= quantityToSell;
          await product.save();

          // 💸 Tax calculation (rounded for accuracy)
          const taxRate = product.ProductTax || 0;
          const basePrice = Number(item.pricePerUnit);
          const taxAmount = +((basePrice * taxRate) / 100).toFixed(2);
          const priceWithTax = +(basePrice + taxAmount).toFixed(2);
          const totalItemPrice = +(quantityToSell * priceWithTax).toFixed(2);

          totalSaleAmount += totalItemPrice;

          salesEntries.push({
            product: product._id,
            productName: product.ProductName,
            productBarcode: product.ProductBarcode,
            quantitySold: quantityToSell,
            pricePerUnit: basePrice, // base price (without tax)
            taxRate, // for clarity
            priceWithTax, // taxed price per unit
            totalItemPrice, // quantity * priceWithTax
          });
        }

        const savedSale = await Sales.create({
          salesItems: salesEntries,
          totalSaleAmount: +totalSaleAmount.toFixed(2),
          companyOwner,
          processedBy,
        });

        return res.status(201).json({
          message: "Sale processed successfully",
          totalSaleAmount: +totalSaleAmount.toFixed(2),
          saleId: savedSale._id,
        });
      });
    });
  } catch (error) {
    console.error("Sell API Error:", error);
    return res.status(500).json({ message: "Failed to process sale" });
  }
}
