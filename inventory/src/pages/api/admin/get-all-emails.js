import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await connectDB();

  verifyToken(req, res, () => {
    checkRole(["admin"])(req, res, async () => {
      try {
        // Fetch only company_owner emails
        const users = await User.find({ role: "company_owner" }).select(
          "email"
        );

        const emailList = users
          .map((u) => u.email)
          .filter((email) => typeof email === "string" && email.trim() !== "");

        return res.status(200).json(emailList);
      } catch (error) {
        console.error("❌ Error fetching emails:", error);
        res.status(500).json({ message: "Failed to fetch user emails" });
      }
    });
  });
}
