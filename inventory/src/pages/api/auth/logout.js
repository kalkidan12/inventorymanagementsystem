import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  try {
    // Clear the refresh token cookie
    res.setHeader("Set-Cookie", [
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        expires: new Date(0),
        path: "/",
      }),
    ]);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
