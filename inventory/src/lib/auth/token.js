import jwt from "jsonwebtoken";
import User from "@/models/User";

// Ensure required environment variables are set
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables."
  );
}

/**
 * Generate a short-lived access token (15 minutes).
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id.toString(), role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

/**
 * Generate a long-lived refresh token (7 days).
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id || user._id.toString(), role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

/**
 * Middleware to verify the access token.
 * If valid, attaches the user object to req.user.
 */
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not Authorized." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

/**
 * Middleware to check if the user has one of the allowed roles.
 */
export const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      message: "Access denied. You do not have the required permissions.",
    });
  }
  next();
};

/**
 * Refresh token endpoint logic.
 * Uses the refresh token stored in an HTTP‑only cookie to generate a new access token.
 */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired refresh token." });
  }
};
