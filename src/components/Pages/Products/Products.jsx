import React, { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../api/product";
import ProductModal from "./ProductModal";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, unavailable

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      console.log("Products data:", data);
      const productsData = data.products || [];
      setProducts(productsData);

      // Extract unique categories from products for dropdown
      const uniqueCats = [
        ...new Map(
          productsData
            .filter((p) => p.category)
            .map((p) => [p.category.id, p.category]),
        ).values(),
      ];
      setCategories(uniqueCats);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getStockClass = (count) => {
    if (count > 10) return "high";
    if (count > 0) return "low";
    return "out";
  };

  const getStockLabel = (count) => {
    if (count > 10) return "In Stock";
    if (count > 0) return "Low Stock";
    return "Out of Stock";
  };

  const getStockNote = (count) => {
    if (count > 10) return "Stock level is healthy.";
    if (count > 0) return "Warning: stock is running low.";
    return "Critical: item is out of stock.";
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (filter === "all") return true;
    if (filter === "available")
      return product.is_available === true || product.is_available === 1;
    if (filter === "unavailable")
      return product.is_available === false || product.is_available === 0;
    return true;
  });

  const totalProducts = filteredProducts.length;
  const inStockCount = filteredProducts.filter(
    (product) => product.current_stock > 10,
  ).length;
  const lowStockCount = filteredProducts.filter(
    (product) => product.current_stock > 0 && product.current_stock <= 10,
  ).length;
  const outOfStockCount = filteredProducts.filter(
    (product) => product.current_stock === 0,
  ).length;

  const getStockBadgeClasses = (stockClass) => {
    const baseClasses =
      "px-3 py-1.5 rounded-full text-white text-xs font-bold inline-block whitespace-nowrap";
    const colorClasses = {
      high: "bg-green-500",
      low: "bg-amber-500",
      out: "bg-red-500",
    };
    return `${baseClasses} ${colorClasses[stockClass]}`;
  };

  const getAvailabilityBadgeClasses = (isAvailable) => {
    const baseClasses =
      "px-3 py-1.5 rounded-full text-white text-xs font-bold inline-block whitespace-nowrap";
    return isAvailable
      ? `${baseClasses} bg-green-600`
      : `${baseClasses} bg-gray-500`;
  };

  const getStockNoteClasses = (stockClass) => {
    const baseClasses = "text-sm mt-2";
    const colorClasses = {
      high: "text-green-600",
      low: "text-amber-600",
      out: "text-red-600 font-bold",
    };
    return `${baseClasses} ${colorClasses[stockClass]}`;
  };

  const getSummaryCardClasses = (type = "default") => {
    const baseClasses =
      "bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow";
    const borderColors = {
      default: "",
      success: "border-l-4 border-l-green-500",
      warning: "border-l-4 border-l-amber-500",
      danger: "border-l-4 border-l-red-500",
    };
    return `${baseClasses} ${borderColors[type]}`;
  };

  // CRUD Handlers
  const handleAddProduct = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    setActionLoading(true);
    try {
      const result = await deleteProduct(id);
      if (result.ok) {
        alert("Product deleted successfully");
        fetchProducts();
      } else {
        alert(result.data.message || "Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setActionLoading(true);
    try {
      let result;
      if (editingProduct) {
        result = await updateProduct(editingProduct.id, formData);
      } else {
        result = await createProduct(formData);
      }

      if (result.ok) {
        alert(editingProduct ? "Product updated" : "Product created");
        setModalOpen(false);
        fetchProducts();
      } else {
        // Handle validation errors
        const errors = result.data.errors;
        if (errors) {
          const firstError = Object.values(errors)[0][0];
          alert(firstError);
        } else {
          alert(result.data.message || "Operation failed");
        }
      }
    } catch (err) {
      alert("Error saving product");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-800 font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Products Management
          </h2>
          <p className="text-base text-gray-500">
            Monitor product stock levels and identify low-stock items quickly.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleAddProduct}
            className="px-5 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-all shadow-sm flex items-center gap-2"
          >
            <span>+</span> Add Product
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
              filter === "all"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
              filter === "available"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            Available
          </button>
          <button
            onClick={() => setFilter("unavailable")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm ${
              filter === "unavailable"
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            }`}
          >
            Unavailable
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={getSummaryCardClasses("default")}>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Total Products
              </span>
              <span className="text-4xl font-bold text-gray-800">
                {totalProducts}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                All products in inventory
              </span>
            </div>

            <div className={getSummaryCardClasses("success")}>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                In Stock
              </span>
              <span className="text-4xl font-bold text-gray-800">
                {inStockCount}
              </span>
              <span className="text-xs text-green-600 mt-1">
                ✓ Healthy stock levels
              </span>
            </div>

            <div className={getSummaryCardClasses("warning")}>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Low Stock
              </span>
              <span className="text-4xl font-bold text-gray-800">
                {lowStockCount}
              </span>
              <span className="text-xs text-amber-600 mt-1">
                ⚠ Need reordering soon
              </span>
            </div>

            <div className={getSummaryCardClasses("danger")}>
              <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">
                Out of Stock
              </span>
              <span className="text-4xl font-bold text-gray-800">
                {outOfStockCount}
              </span>
              <span className="text-xs text-red-600 mt-1">
                ✗ Requires immediate attention
              </span>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse bg-white text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Code
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Name
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Category
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Description
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Price
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Stock Status
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Availability
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Image
                  </th>
                  <th className="p-5 font-bold text-xs text-gray-600 border-b border-gray-200 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockClass = getStockClass(product.current_stock);
                  // Debug log
                  console.log(
                    "Rendering product:",
                    product.id,
                    product.image,
                    product.image_url,
                  );
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-blue-50/50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <td className="p-5 text-sm font-semibold text-gray-600 align-top">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {product.product_code}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-semibold text-gray-800 align-top">
                        {product.product_name}
                      </td>
                      <td className="p-5 text-sm align-top">
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium whitespace-nowrap">
                          {product.category?.name || "Uncategorized"}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-gray-600 align-top max-w-md">
                        <p className="line-clamp-2 leading-relaxed">
                          {product.description || "No description available"}
                        </p>
                      </td>
                      <td className="p-5 text-sm font-bold text-blue-600 align-top whitespace-nowrap">
                        ₱
                        {Number(product.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="p-5 text-sm align-top min-w-[200px]">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-700">
                              {product.current_stock} units
                            </span>
                            <span className={getStockBadgeClasses(stockClass)}>
                              {getStockLabel(product.current_stock)}
                            </span>
                          </div>
                          <p className={getStockNoteClasses(stockClass)}>
                            {getStockNote(product.current_stock)}
                          </p>
                        </div>
                      </td>
                      <td className="p-5 text-sm align-top">
                        <span
                          className={getAvailabilityBadgeClasses(
                            product.is_available,
                          )}
                        >
                          {product.is_available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="p-5 text-sm align-top">
                        {product.image ? (
                          <img
                            src={
                              product.image_url ||
                              `http://127.0.0.1:8000/storage/${product.image}`
                            }
                            alt={product.product_name}
                            className="h-10 w-10 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML =
                                '<span class="text-gray-400 text-xs">Broken</span>';
                            }}
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-sm align-top">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                            disabled={actionLoading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4 text-6xl">📦</div>
          <p className="text-gray-600 text-xl mb-3">No products found.</p>
          <p className="text-gray-400 text-sm mb-6">
            {filter !== "all"
              ? "Try changing your filter to see more products."
              : "Add some products to get started."}
          </p>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              Show all products
            </button>
          )}
          {filter === "all" && (
            <button
              onClick={handleAddProduct}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm font-medium"
            >
              Add Your First Product
            </button>
          )}
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        product={editingProduct}
        categories={categories}
        loading={actionLoading}
      />
    </div>
  );
};

export default Products;
