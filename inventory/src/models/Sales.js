import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema(
  {
    saleDate: { type: Date, default: Date.now }, // When the sale happened
    salesItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        }, // Link to existing product
        productName: { type: String, required: true }, // Product name at sale time
        productBarcode: { type: String, required: true }, // Must match a registered product
        quantitySold: { type: Number, required: true, min: 1 }, // Quantity sold
        pricePerUnit: { type: Number, required: true, min: 0 }, // Price at sale time
        totalItemPrice: { type: Number, required: true, min: 0 }, // Auto-calculated per item
      },
    ],
    totalSaleAmount: { type: Number, required: true, min: 0 }, // Auto-calculated total for all items
    companyOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Link sale to a company
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Sales User who processed it
  },
  {
    timestamps: true,
  },
);

// **Ensure the barcode exists in the Product schema before saving**
SalesSchema.pre("save", async function (next) {
  const Product = mongoose.model("Product");

  for (const item of this.salesItems) {
    const product = await Product.findOne({
      _id: item.product,
      ProductBarcode: item.productBarcode,
    });

    if (!product) {
      return next(
        new Error(
          `Invalid barcode: ${item.productBarcode} does not match any registered product.`,
        ),
      );
    }

    item.totalItemPrice = item.quantitySold * item.pricePerUnit;
  }

  // **Calculate total sale amount**
  this.totalSaleAmount = this.salesItems.reduce(
    (sum, item) => sum + item.totalItemPrice,
    0,
  );

  next();
});

export default mongoose.models.Sales || mongoose.model("Sales", SalesSchema);
