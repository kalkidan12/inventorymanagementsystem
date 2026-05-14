import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { folder, timestamp, upload_preset, format } = req.body;

    // Generate the signature including the format parameter
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        upload_preset,
        format, // Include the format in the signature
      },
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    );

    res.status(200).json({ signature, timestamp });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
