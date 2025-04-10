import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "Kaliget Contact",
    },
    message: {
      type: String,
      required: true,
    },
    reply: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
