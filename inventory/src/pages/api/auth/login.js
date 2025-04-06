import bcrypt from "bcrypt";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { generateAccessToken, generateRefreshToken } from "@/lib/auth/token";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  const { email, password } = req.body;

  try {
    // Find user and ensure password is selected
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.emailVerified)
      return res
        .status(401)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate tokens:
    // - Access token: short-lived (15 minutes)
    // - Refresh token: long-lived (7 days) stored in HTTP-only cookie
    const accessToken = generateAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    // Set refresh token as HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      serialize("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      })
    );

    res.status(200).json({
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.emailVerified,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
