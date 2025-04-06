export const uploadToCloudinary = async (file) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Get the signature and timestamp from the API route
  const response = await fetch("/api/cloud/cloudinary-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      folder: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER,
      timestamp,
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      format: "webp", // Include the format parameter here
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get signature");
  }

  const { signature } = await response.json();

  // Upload the image to Cloudinary using the signed parameters
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append("format", "webp"); // Include the format parameter in the upload

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await uploadResponse.json();
  return data.secure_url;
};
