import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    content: { type: String, required: true },
    to: { type: [String], required: true },
    alertType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
