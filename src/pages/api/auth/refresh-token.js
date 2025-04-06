import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();
  // The refresh token is stored in the cookie
  const { refreshToken } = req.cookies;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token is required." });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    const accessToken = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(401).json({ message: "Invalid or expired refresh token." });
  }
}
