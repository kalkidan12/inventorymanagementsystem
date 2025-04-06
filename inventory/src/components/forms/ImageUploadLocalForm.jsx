import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaCopy, FaTimes, FaEye, FaUpload, FaSpinner } from "react-icons/fa";

const ImageUploadLocalForm = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return toast.error("No file selected");

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/upload/local", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      setUploadedImageUrl(data.url);
      onUpload(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const togglePreview = () => setIsPreviewOpen(!isPreviewOpen);
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(uploadedImageUrl);
    toast.info("URL copied to clipboard");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h3 className="text-xl font-bold mb-4">Upload Product Image</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border rounded mb-3"
      />
      <div className="flex gap-3">
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
          <button
            type="button"
            onClick={togglePreview}
            className="flex items-center p-2 bg-blue-500 text-white rounded"
          >
            {isPreviewOpen ? (
              <>
                <FaTimes className="mr-2" /> Hide
              </>
            ) : (
              <>
                <FaEye className="mr-2" /> Preview
              </>
            )}
          </button>
        )}
      </div>

      {uploadedImageUrl && (
        <div className="mt-3 flex items-center">
          <input
            type="text"
            value={uploadedImageUrl}
            readOnly
            className="w-full p-2 border rounded mr-2"
          />
          <button onClick={handleCopyUrl} className="p-2 bg-gray-300 rounded">
            <FaCopy />
          </button>
        </div>
      )}

      {isPreviewOpen && imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-auto rounded shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadLocalForm;
