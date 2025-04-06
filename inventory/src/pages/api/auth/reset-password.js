// import bcrypt from "bcrypt";
// import User from "@/models/User";
// import dbConnect from "@/lib/dbConnect";

// export default async function handler(req, res) {
//   if (req.method !== "POST")
//     return res.status(405).json({ message: "Method not allowed" });

//   await dbConnect();
//   const { token, newPassword } = req.body;

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() },
//     }).select("+password"); // ✅ Ensure password is selected

//     if (!user) {
//       return res
//         .status(400)
//         .json({ message: "Invalid or expired reset token" });
//     }

//     console.log("🔹 Old Hashed Password:", user.password);

//     const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
//     user.password = hashedPassword;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;

//     await user.save({ validateBeforeSave: false });

//     console.log("✅ New Hashed Password Stored:", user.password);

//     res.setHeader("Set-Cookie", [
//       "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
//     ]);

//     res
//       .status(200)
//       .json({ message: "Password reset successful, please log in again" });
//   } catch (error) {
//     console.error("Reset Password Error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// }

import bcrypt from "bcrypt";
import User from "@/models/User";
import connectDB from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    // Clear refresh token cookie
    res.setHeader("Set-Cookie", [
      "refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    ]);

    res
      .status(200)
      .json({ message: "Password reset successful, please log in again" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
