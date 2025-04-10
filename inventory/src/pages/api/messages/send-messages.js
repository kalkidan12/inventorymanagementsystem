import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import { sendReplyEmail } from "@/lib/mailer/mailer";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      const { email, subject, message } = req.body;

      if (!email || !Array.isArray(email) || email.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one recipient required." });
      }

      try {
        await Promise.all(
          email.map((recipient) => sendReplyEmail(recipient, subject, message))
        );
      } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Failed to send messages." });
      }
    });
  });
}
