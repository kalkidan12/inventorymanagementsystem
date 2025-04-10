import { sendAcknowledgeEmail } from "@/lib/mailer/mailer";
import connectDB from "@/lib/dbConnect";
import Message from "@/models/Message";
import validator from "validator";
import rateLimit from "express-rate-limit";
import { promisify } from "util";

// Connect DB
connectDB();

// Rate limiter: 3 requests per IP per day
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: "❌ You have reached the limit of 3 messages per 24 hours.",
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) =>
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    "unknown",
});

// Promisify middleware for Next.js compatibility
const runMiddleware = promisify(limiter);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await runMiddleware(req, res);
  } catch (rateError) {
    return res
      .status(429)
      .json({ message: rateError.message || "Rate limit exceeded." });
  }

  let { email, subject = "", message } = req.body;

  // Sanitize inputs
  email =
    typeof email === "string" ? validator.normalizeEmail(email.trim()) : "";
  subject = validator.escape(subject.trim());
  message = validator.escape(message.trim());

  // Validate inputs
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  if (message.length < 10 || message.length > 1000) {
    return res.status(400).json({
      message: "Message must be between 10 and 1000 characters.",
    });
  }

  if (subject.length > 150) {
    return res.status(400).json({
      message: "Subject must be under 150 characters.",
    });
  }

  try {
    const saved = await Message.create({
      email,
      subject,
      message,
      reply: "",
      seen: false,
    });

    await sendAcknowledgeEmail(email);

    return res.status(201).json({
      message: "Message sent successfully.",
      data: saved,
    });
  } catch (error) {
    console.error("❌ Message Save Error:", error);
    return res.status(500).json({
      message:
        error?.message?.includes("rate") || error?.status === 429
          ? "❌ You have reached the message limit. Try again in 24 hours."
          : "Failed to send message.",
    });
  }
}
