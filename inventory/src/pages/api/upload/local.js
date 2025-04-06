import fs from "fs";
import { IncomingForm } from "formidable";
import { uploadImageToLocal } from "@/utils/ImageUpload";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) throw new Error("Failed to parse form");

      const file = files.image;
      if (!file || !file[0]?.filepath) {
        return res.status(400).json({ message: "Image file missing" });
      }

      const { filepath, originalFilename, mimetype } = file[0];
      const buffer = fs.readFileSync(filepath);

      const url = await uploadImageToLocal(buffer, originalFilename, mimetype);

      return res.status(200).json({ url });
    } catch (error) {
      console.error("Image Upload Error:", error);
      return res.status(500).json({ message: "Image upload failed" });
    }
  });
}
