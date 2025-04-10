import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken, checkRole } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  await verifyToken(req, res, async () => {
    await checkRole(["admin"])(req, res, async () => {
      const {
        name,
        email,
        password,
        phoneNumber,
        role,
        companyName,
        emailVerified = false,
        inventorySubscribed = false,
        lastSubscriptionDate,
        subscriptionEndDate,
      } = req.body;

      console.log(req.body);

      if (
        !name ||
        !email ||
        !password ||
        !phoneNumber ||
        !role ||
        !companyName
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      if (!["admin", "company_owner"].includes(role)) {
        return res.status(400).json({ message: "Invalid role." });
      }

      const existing = await User.findOne({ email });
      if (existing)
        return res.status(409).json({ message: "Email already in use." });

      try {
        const creator = req.user;

        const user = await User.create({
          name,
          email,
          password,
          phoneNumber,
          role,
          companyName,
          invitedBy: creator._id,
          emailVerified,
          inventorySubscribed,
          lastSubscriptionDate: lastSubscriptionDate
            ? new Date(lastSubscriptionDate)
            : null,
          subscriptionEndDate: subscriptionEndDate
            ? new Date(subscriptionEndDate)
            : null,
        });

        return res.status(201).json({
          message: "User created successfully.",
          user: { ...user._doc, password: undefined },
        });
      } catch (err) {
        console.error("Add user error:", err);
        return res.status(500).json({ message: "Failed to create user." });
      }
    });
  });
}
