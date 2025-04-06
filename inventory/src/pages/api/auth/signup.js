import crypto from "crypto";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/auth/email";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { name, email, password, phoneNumber, companyName } = req.body;

  // Validation
  if (!name || !email || !password || !phoneNumber || !companyName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Create user with plain password (will be hashed by the model hook)
    const newUser = new User({
      name,
      email,
      password,
      phoneNumber,
      companyName,
      verificationToken,
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Signup successful, check your email to verify your account.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
