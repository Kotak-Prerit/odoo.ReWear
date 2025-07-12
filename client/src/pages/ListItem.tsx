import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../utils/cloudinary";

interface ItemFormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  tags: string;
  size: string;
  price: string;
  images: string[];
}

const ListItem = () => {
  const navigate = useNavigate();
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [formData, setFormData] = useState<ItemFormData>({
    title: "",
    description: "",
    category: "",
    condition: "",
    tags: "",
    size: "",
    price: "",
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categories for dropdown
  const categories = [
    "T-Shirts",
    "Jeans",
    "Crop-Top",
    "Leggings",
    "Dresses",
    "Shoes",
    "Jackets",
    "Hoodies",
    "Skirts",
    "Shorts",
    "Accessories",
    "Others",
  ];

  // Conditions for dropdown
  const conditions = [
    { value: "new", label: "New" },
    { value: "like-new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  // Sizes for dropdown
  const sizes = [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL",
    "Free Size",
    "Custom",
  ];

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Upload images to Cloudinary
  const handleImageUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = Array.from(selectedFiles).map((file) =>
        uploadImageToCloudinary(file)
      );

      const imageUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));

      // Clear file input
      setSelectedFiles(null);
      const fileInput = document.getElementById("images") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Error uploading images. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Remove image from the list
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to list an item");
      navigate("/login");
      return;
    }

    if (formData.images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        alert("Item listed successfully!");
        navigate("/dashboard");
      } else {
        const error = await response.json();
        alert(error.message || "Error listing item");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error listing item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-blue-300 flex items-center justify-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Please Log In
          </h2>
          <p className="text-gray-700 mb-6">
            You need to be logged in to list an item.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-blue-300">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md shadow-lg border-b border-blue-100 px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logo.svg"
              alt="ReWear Logo"
              className="h-12 w-12 mr-3 drop-shadow-lg"
            />
            <span className="text-2xl font-extrabold text-blue-700 tracking-wide drop-shadow">
              ReWear
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-700 font-semibold">Item Listing</span>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8 max-w-4xl">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            List Your Item
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Images *
                  </label>
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                    >
                      <div className="space-y-2">
                        <div className="text-4xl">📷</div>
                        <div className="text-lg font-medium">
                          Upload Product Images
                        </div>
                        <div className="text-sm text-gray-500">
                          Click to select multiple images
                        </div>
                      </div>
                    </label>
                  </div>

                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedFiles.length} file(s) selected
                      </p>
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {uploading ? "Uploading..." : "Upload Images"}
                      </button>
                    </div>
                  )}

                  {/* Display uploaded images */}
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {formData.images.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Product Details */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      aria-label="Select category"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Condition *
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      aria-label="Select condition"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Condition</option>
                      {conditions.map((condition) => (
                        <option key={condition.value} value={condition.value}>
                          {condition.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Size *
                    </label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      required
                      aria-label="Select size"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Size</option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (INR) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter price in INR"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. vintage, summer, casual"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Add relevant tags to help others find your item
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting || formData.images.length === 0}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Listing Item..." : "List Item"}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Make sure to upload at least one image before submitting
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
