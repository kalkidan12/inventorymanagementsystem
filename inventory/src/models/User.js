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
    role: { type: String, default: "company_owner" }, // possible roles: admin, company_owner, sales
    companyName: { type: String, required: true },
    // For non-admin users, this references the company owner they belong to.
    companyOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Who invited/created this user
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isActive: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },

    inventoryTrialStarted: { type: Boolean, default: false },
    inventoryTrialEnddDate: { type: Date },
    inventoryTrialStartedDate: { type: Date },
    inventorySubscribed: { type: Boolean, default: false },
    inventorySubscriptionEnddDate: { type: Date },
    inventorySubscriptionStartedDate: { type: Date },

    verificationToken: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
