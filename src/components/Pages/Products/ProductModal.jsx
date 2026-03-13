import React, { useState, useEffect } from "react";

const ProductModal = ({ isOpen, onClose, onSubmit, product, categories }) => {
  const [formData, setFormData] = useState({
    product_code: "",
    product_name: "",
    description: "",
    price: "",
    category_id: "",
    current_stock: "",
    is_available: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        product_code: product.product_code || "",
        product_name: product.product_name || "",
        description: product.description || "",
        price: product.price || "",
        category_id: product.category_id || "",
        current_stock: product.current_stock || "",
        is_available: product.is_available ?? true,
      });
      // Set image preview
      if (product.image_url) {
        setImagePreview(product.image_url);
      } else if (product.image) {
        setImagePreview(`http://127.0.0.1:8000/storage/${product.image}`);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        product_code: "",
        product_name: "",
        description: "",
        price: "",
        category_id: "",
        current_stock: "",
        is_available: true,
      });
      setImageFile(null);
      setImagePreview(null);
    }
    setErrors({});
  }, [product, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.product_code.trim())
      newErrors.product_code = "Product code is required";
    if (!formData.product_name.trim())
      newErrors.product_name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.current_stock && formData.current_stock !== 0)
      newErrors.current_stock = "Stock is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Build FormData
    const submitData = new FormData();
    submitData.append("product_code", formData.product_code);
    submitData.append("product_name", formData.product_name);
    submitData.append("description", formData.description || "");
    submitData.append("price", formData.price);
    submitData.append("category_id", formData.category_id || "");
    submitData.append("current_stock", formData.current_stock);
    submitData.append("is_available", formData.is_available ? "1" : "0");

    if (imageFile) {
      submitData.append("image", imageFile);
    }

    await onSubmit(submitData);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Code *
              </label>
              <input
                type="text"
                name="product_code"
                value={formData.product_code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.product_code && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.product_code}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.product_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.product_name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Stock *
              </label>
              <input
                type="number"
                name="current_stock"
                value={formData.current_stock}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.current_stock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.current_stock}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              Available for sale
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : product
                  ? "Update Product"
                  : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
