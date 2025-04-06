import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    RegistrationDate: { type: Date, default: Date.now },
    ProductName: { type: String, required: true },
    ProductImage: { type: String },
    ProductType: { type: String },
    ProductUnit: { type: String, required: true, default: "piece" },
    ProductTax: { type: Number, required: true, min: 0, default: 0 },
    ProductBrand: { type: String },
    ProductCost: { type: Number, required: true, min: 0 },
    ProductPrice: { type: Number, required: true, min: 0 },
    ProductDescription: { type: String },
    ProductLocation: { type: String },
    ProductQuantity: { type: Number, required: true, min: 0 },
    ProductBarcode: { type: String, required: true },
    companyOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// **Unique barcode constraint per company**
ProductSchema.index({ companyOwner: 1, ProductBarcode: 1 }, { unique: true });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
