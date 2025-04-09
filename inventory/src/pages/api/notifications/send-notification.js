import connectDB from "@/lib/dbConnect";
import { verifyToken, checkRole } from "@/lib/auth/token";
import Notification from "@/models/Notification";
import User from "@/models/User";
import {
  sendMail,
  generateNotificationEmail,
} from "../../../lib/mailer/mailer";

connectDB();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      const { subject, content, to, alertType } = req.body;

      try {
        let recipientEmails = [];

        if (to === "All") {
          // Fetch all subscribed users' emails
          const users = await User.find({
            unsubscribed: false,
          }).select("email");
          recipientEmails = users.map((user) => user.email);
        } else {
          // Add specific email addresses from `to` field, removing empty strings
          recipientEmails = to.filter((email) => email.trim() !== "");
        }

        if (recipientEmails.length === 0) {
          return res.status(400).json({ message: "No recipients found." });
        }

        // Send email to each recipient
        await Promise.all(
          recipientEmails.map((email) => {
            const emailContent = generateNotificationEmail(content, email);
            return sendMail({
              to: email,
              subject,
              html: emailContent,
            });
          })
        );

        // Save the notification to the database
        const newNotification = new Notification({
          subject,
          content,
          to: recipientEmails.length > 0 ? recipientEmails : ["All"],
          alertType,
        });

        const savedNotification = await newNotification.save();

        res.status(201).json(savedNotification);
      } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ message: "Failed to send notification." });
      }
    });
  });
}
