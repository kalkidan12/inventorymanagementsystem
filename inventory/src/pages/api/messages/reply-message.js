import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import Message from "@/models/Message";
import { sendReplyEmail } from "@/lib/mailer/mailer";
import validator from "validator";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      const { id, reply, subject } = req.body;

      if (!id || !reply || !subject) {
        return res
          .status(400)
          .json({ message: "Missing required fields: id, subject, or reply." });
      }

      try {
        const message = await Message.findById(id);
        if (!message) {
          return res.status(404).json({ message: "Message not found." });
        }

        const email =
          typeof message.email === "string"
            ? message.email
            : message.email?.[0];

        if (!validator.isEmail(email)) {
          return res
            .status(400)
            .json({ message: "Valid recipient email not found." });
        }

        await sendReplyEmail(email, subject, reply);

        message.reply = reply;
        message.subject = subject;
        message.seen = true;
        await message.save();

        return res.status(200).json({ message: "Reply sent successfully." });
      } catch (error) {
        return res.status(500).json({ message: "Failed to send reply." });
      }
    });
  });
}
