// utils/ImageUpload.js
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { nanoid } from "nanoid";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const generateTimestampedFilename = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const random = nanoid(6);
  return `product-${yyyy}${mm}${dd}-${hh}${min}${ss}-${random}.webp`;
};

export const uploadImageToLocal = async (buffer, _originalName, mimeType) => {
  try {
    if (!allowedTypes.includes(mimeType)) {
      throw new Error("Invalid image type");
    }

    const uploadsDir = path.resolve(process.cwd(), "../uploads");
    if (!fs.existsSync(uploadsDir))
      fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = generateTimestampedFilename();
    const filePath = path.join(uploadsDir, filename);

    const webpBuffer = await sharp(buffer)
      .resize({ width: 600 })
      .webp({ quality: 70 })
      .toBuffer();

    fs.writeFileSync(filePath, webpBuffer);

    const relativeUrl = `/uploads/${filename}`;

    return relativeUrl;
  } catch (error) {
    return "";
  }
};
