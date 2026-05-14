import { useState, useEffect } from "react";
import {
  useAddProductMutation,
  useUpdateProductMutation,
  useGetProductTypesQuery,
  useGetProductWarehousesQuery,
  useLazyGenerateBarcodeQuery,
} from "@/store/api/productApiSlice";
import ImageToCloudForm from "@/components/forms/ImageToCloudForm";
// import ImageUploadLocalForm from "@/components/forms/ImageUploadLocalForm";
import { FaEye, FaTimes, FaSync, FaQrcode } from "react-icons/fa";
import { Html5QrcodeScanner } from "html5-qrcode";
import { toast } from "react-toastify";

export default function ProductFormModal({
  isOpen,
  onClose,
  initialData = {},
  refetch,
}) {
  const isEdit = Boolean(initialData?._id);

  const [formData, setFormData] = useState({
    ProductName: "",
    ProductImage: "",
    ProductType: "",
    ProductUnit: "",
    ProductTax: "",
    ProductBrand: "",
    ProductCost: "",
    ProductPrice: "",
    ProductDescription: "",
    ProductLocation: "",
    ProductQuantity: "",
    ProductBarcode: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showImage, setShowImage] = useState(true);
  const [scannerActive, setScannerActive] = useState(false);

  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [triggerBarcode] = useLazyGenerateBarcodeQuery();

  const { data: productTypesData } = useGetProductTypesQuery();
  const { data: productLocationsData } = useGetProductWarehousesQuery();

  useEffect(() => {
    if (initialData) {
      setFormData({ ...formData, ...initialData });
      setImagePreview(initialData.ProductImage || null);
      setShowImage(!!initialData.ProductImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (url) => {
    setFormData({ ...formData, ProductImage: url });
    setImagePreview(url);
    setShowImage(true);
  };

  const startScanner = () => {
    setScannerActive(true);
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
      scanner.render(
        (decodedText) => {
          setFormData((prev) => ({ ...prev, ProductBarcode: decodedText }));
          scanner.clear();
          setScannerActive(false);
          toast.success("Barcode scanned successfully");
        },
        (err) => console.error("QR Scan Error:", err),
      );
    }, 500);
  };

  const handleGenerateBarcode = async () => {
    try {
      const result = await triggerBarcode().unwrap();
      if (result?.barcode) {
        setFormData({ ...formData, ProductBarcode: result.barcode });
        toast.success("Barcode generated successfully");
      } else {
        toast.error("Failed to generate barcode");
      }
    } catch (err) {
      toast.error("Barcode generation error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProduct({ id: initialData._id, ...formData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await addProduct(formData).unwrap();
        toast.success("Product added successfully");
      }
      onClose();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save product");
    }
  };

  const productTypes = productTypesData?.productTypes || [];
  const productLocations = productLocationsData?.productLocations || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg p-6 overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-4 p-1 bg-gray-100">
          <h2 className="text-xl font-bold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="md:flex md:gap-4">
            <input
              type="text"
              name="ProductName"
              placeholder="Product Name"
              value={formData.ProductName}
              onChange={handleChange}
              className="w-full md:w-1/2 p-2 border rounded mb-2 md:mb-0"
              required
            />
            <input
              type="number"
              name="ProductQuantity"
              placeholder="Quantity"
              value={formData.ProductQuantity}
              onChange={handleChange}
              className="w-full md:w-1/2 p-2 border rounded"
              required
            />
          </div>

          {/* <ImageUploadLocalForm onUpload={handleImageUpload} /> */}
          <ImageToCloudForm onUpload={handleImageUpload} />
          {imagePreview && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowImage(!showImage)}
                className="text-sm text-blue-600 mb-2"
              >
                {showImage ? "Hide Preview" : "Show Preview"}
              </button>
              {showImage && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, ProductImage: "" });
                    }}
                    className="absolute top-2 right-2 bg-white text-black p-1 rounded-full shadow"
                  >
                    ✖
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              name="ProductType"
              placeholder="Product Type"
              value={formData.ProductType}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
            />
            <select
              name="ProductType"
              value={formData.ProductType}
              onChange={handleChange}
              className="w-1/3 p-2 border rounded"
            >
              <option value="">Select Type</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="md:flex md:gap-4">
            <input
              type="text"
              name="ProductBrand"
              placeholder="Brand"
              value={formData.ProductBrand}
              onChange={handleChange}
              className="w-full md:w-1/2 p-2 border rounded mb-2 md:mb-0"
            />
            <input
              type="text"
              name="ProductUnit"
              placeholder="Unit (e.g., KG)"
              value={formData.ProductUnit}
              onChange={handleChange}
              className="w-full md:w-1/2 p-2 border rounded"
            />
          </div>

          <input
            type="number"
            name="ProductTax"
            placeholder="Tax %"
            value={formData.ProductTax}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <div className="flex gap-2">
            <input
              type="text"
              name="ProductLocation"
              placeholder="Location"
              value={formData.ProductLocation}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
            />
            <select
              name="ProductLocation"
              value={formData.ProductLocation}
              onChange={handleChange}
              className="w-1/3 p-2 border rounded"
            >
              <option value="">Select Location</option>
              {productLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              name="ProductBarcode"
              placeholder="Barcode"
              value={formData.ProductBarcode}
              onChange={handleChange}
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={handleGenerateBarcode}
              className="hidden md:block bg-gray-700 text-white px-3 py-2 rounded"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={startScanner}
              className="hidden md:block bg-green-600 text-white px-3 py-2 rounded"
            >
              Scan
            </button>
            <button
              type="button"
              onClick={handleGenerateBarcode}
              className="md:hidden p-2 bg-gray-700 text-white rounded"
            >
              <FaSync />
            </button>
            <button
              type="button"
              onClick={startScanner}
              className="md:hidden p-2 bg-green-600 text-white rounded"
            >
              <FaQrcode />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="ProductCost"
              placeholder="Cost"
              value={formData.ProductCost}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="ProductPrice"
              placeholder="Price"
              value={formData.ProductPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <textarea
            name="ProductDescription"
            placeholder="Description or Notes"
            value={formData.ProductDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <button
            type="submit"
            disabled={isAdding || isUpdating}
            className={`w-full py-2 rounded mt-4 ${
              isAdding || isUpdating
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isAdding || isUpdating
              ? "Submitting..."
              : isEdit
                ? "Update Product"
                : "Add Product"}
          </button>
        </form>

        {scannerActive && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded">
              <div id="reader" className="w-64 h-64"></div>
              <button
                onClick={() => setScannerActive(false)}
                className="mt-2 w-full bg-red-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
