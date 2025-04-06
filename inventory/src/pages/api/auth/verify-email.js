import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ message: "Method not allowed" });

  await dbConnect();

  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verification successful" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
