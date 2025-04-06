// import crypto from "crypto";
// import User from "@/models/User";
// import dbConnect from "@/lib/dbConnect";
// import { sendResetEmail } from "@/lib/auth/email";

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   await dbConnect();

//   const { email } = req.body;

//   // Validate email format
//   if (
//     !email ||
//     typeof email !== "string" ||
//     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
//   ) {
//     return res.status(400).json({ message: "Invalid email format" });
//   }

//   try {
//     const user = await User.findOne({ email: email.trim() }).select("+email"); // ✅ Select only email, avoid required phoneNumber issue

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Generate password reset token
//     const resetToken = crypto.randomBytes(20).toString("hex");
//     user.resetToken = resetToken;
//     user.resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
//     await user.save({ validateBeforeSave: false }); // ✅ Avoid requiring phoneNumber validation

//     // Send the reset email
//     await sendResetEmail(email.trim(), resetToken);

//     return res
//       .status(200)
//       .json({ message: "Password reset email sent. Check your inbox." });
//   } catch (error) {
//     console.error("Forgot password error:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// }

import crypto from "crypto";
import User from "@/models/User";
import connectDB from "@/lib/dbConnect";
import { sendResetEmail } from "@/lib/auth/email";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { email } = req.body;
  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const user = await User.findOne({ email: email.trim() });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    await sendResetEmail(email.trim(), resetToken);
    res
      .status(200)
      .json({ message: "Password reset email sent. Check your inbox." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
