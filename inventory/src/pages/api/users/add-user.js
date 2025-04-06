import connectDB from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth/token";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  await connectDB();

  verifyToken(req, res, async () => {
    const { name, email, password, phoneNumber, companyName, role } = req.body;
    if (!name || !email || !password || !phoneNumber || !companyName || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const creator = req.user;

    // Admin can only create company_owner
    if (creator.role === "admin" && role !== "company_owner") {
      return res
        .status(403)
        .json({ message: "Admin can only create company_owner accounts" });
    }
    // Company owners can only create sales
    if (creator.role === "company_owner" && role !== "sales") {
      return res
        .status(403)
        .json({ message: "Company owners can only create sales accounts" });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists)
        return res.status(400).json({ message: "User already exists" });

      const newUserData = {
        name,
        email,
        password,
        phoneNumber,
        companyName,
        role,
        emailVerified: true,
        invitedBy: creator._id,
      };

      if (creator.role === "company_owner") {
        newUserData.companyOwner = creator._id;
      } else if (creator.role === "admin") {
        // For admin-created company_owner, leave companyOwner as null
        newUserData.companyOwner = null;
      }

      const newUser = await User.create(newUserData);
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Add User Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  });
}
