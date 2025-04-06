import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { FaCopy, FaTimes, FaEye, FaUpload, FaSpinner } from "react-icons/fa";

const ImageToCloudForm = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("No file selected.", { position: "top-right" });
      return;
    }

    setIsUploading(true);
    try {
      const uploadResult = await uploadToCloudinary(selectedFile);
      setUploadedImageUrl(uploadResult);
      toast.success("Image uploaded successfully!", { position: "top-right" });
      onUpload(uploadResult); // Pass the URL to the parent component
    } catch (error) {
      toast.error("Failed to upload image.", { position: "top-right" });
    } finally {
      setIsUploading(false);
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(uploadedImageUrl);
    toast.info("Image URL copied to clipboard!", { position: "top-right" });
  };

  // Toggle preview visibility
  const togglePreview = () => {
    setIsPreviewOpen(!isPreviewOpen);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="text-xl font-bold mb-4">Upload Image</h3>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4 flex gap-3">
        <button
          type="button"
          onClick={handleImageUpload}
          disabled={!selectedFile || isUploading}
          className="flex items-center p-2 bg-blue-500 text-white rounded"
        >
          {isUploading ? (
            <>
              <FaSpinner className="mr-2 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <FaUpload className="mr-2" /> Upload
            </>
          )}
        </button>
        {imagePreview && (
          <div className="m">
            <button
              type="button"
              onClick={togglePreview}
              className="flex items-center p-2 text-md bg-blue-500 text-white rounded"
            >
              {isPreviewOpen ? (
                <>
                  <FaTimes className="mr-2" /> Close Preview
                </>
              ) : (
                <>
                  <FaEye className="mr-2" /> Show Preview
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {uploadedImageUrl && (
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="text"
              value={uploadedImageUrl}
              readOnly
              className="w-full p-2 border rounded mr-2"
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-2 bg-gray-300 rounded"
            >
              <FaCopy />
            </button>
          </div>
        </div>
      )}

      {isPreviewOpen && imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Uploaded Preview"
            className="w-full h-auto rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ImageToCloudForm;
