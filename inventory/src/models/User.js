import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\+?\d{7,15}$/, "Please enter a valid phone number"],
    },
    role: { type: String, default: "company_owner" }, // admin, company_owner, sales

    companyName: { type: String, required: true },
    companyOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // For sales users linked to company_owner
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    emailVerified: { type: Boolean, default: true }, //temporarily this is true because email sending server is slow

    // 🎯 Trial (company_owner only)
    inventoryTrialStartedDate: { type: Date, default: null },
    inventoryTrialEnddDate: { type: Date, default: null },

    // Subscription (company_owner only)
    lastSubscriptionDate: { type: Date, default: null },
    subscriptionEndDate: { type: Date, default: null },
    inventorySubscribed: { type: Boolean, default: false },

    // 🔐 Email verification / Reset
    verificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// 🔐 Hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🧠 Compare password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ✅ Auto-start trial for company_owner on signup
UserSchema.pre("save", function (next) {
  if (this.isNew && this.role === "company_owner") {
    const now = new Date();
    this.inventoryTrialStartedDate = now;
    this.inventoryTrialEnddDate = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000
    ); // 7 days
    this.inventorySubscribed = false;
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
