import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../../api/product";
import { restockProducts, adjustStock } from "../../../api/inventory";
import RestockModal from "./components/modal/RestockModal";
import AdjustStockModal from "./components/AdjustStockModal";
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockItems, setRestockItems] = useState([]);
  const [processing, setProcessing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      const productsData = data.products || [];
      setProducts(productsData);

      // Extract unique categories
      const uniqueCategories = [
        ...new Map(
          productsData
            .filter((p) => p.category)
            .map((p) => [p.category.id, p.category]),
        ).values(),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0)
      return { class: "out", label: "Out of Stock", color: "#ef4444" };
    if (stock <= 10)
      return { class: "low", label: "Low Stock", color: "#f59e0b" };
    return { class: "good", label: "In Stock", color: "#10b981" };
  };

  const handleRestock = () => {
    // Get low stock products to suggest for restock
    const lowStockProducts = products.filter((p) => p.current_stock <= 10);
    setRestockItems(
      lowStockProducts.map((p) => ({
        product_id: p.id,
        product_name: p.product_name,
        current_stock: p.current_stock,
        quantity: 10, // Default restock quantity
        selected: true, // Default selected
      })),
    );
    setShowRestockModal(true);
  };

  const handleAdjustStock = (product) => {
    setSelectedProduct(product);
    setShowAdjustModal(true);
  };

  const handleBulkRestock = async (items, notes) => {
    try {
      setProcessing(true);
      const result = await restockProducts(items, notes);
      if (result.ok) {
        alert("Stock restocked successfully!");
        fetchProducts(); // Refresh products
        setShowRestockModal(false);
      } else {
        alert(result.data?.message || "Failed to restock");
      }
    } catch (err) {
      alert("Error restocking products");
    } finally {
      setProcessing(false);
    }
  };

  const handleSingleAdjust = async (productId, newStock, reason) => {
    try {
      setProcessing(true);
      const result = await adjustStock(productId, newStock, reason);
      if (result.ok) {
        alert("Stock adjusted successfully!");
        fetchProducts(); // Refresh products
        setShowAdjustModal(false);
        setSelectedProduct(null);
      } else {
        alert(result.data?.message || "Failed to adjust stock");
      }
    } catch (err) {
      alert("Error adjusting stock");
    } finally {
      setProcessing(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "all" || product.category?.id === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Statistics
  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.current_stock > 10).length,
    lowStock: products.filter(
      (p) => p.current_stock > 0 && p.current_stock <= 10,
    ).length,
    outOfStock: products.filter((p) => p.current_stock <= 0).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.current_stock, 0),
  };

  const getStatColor = (type) => {
    const colors = {
      total: "text-blue-600",
      inStock: "text-green-600",
      lowStock: "text-amber-600",
      outOfStock: "text-red-600",
      value: "text-purple-600",
    };
    return colors[type] || "text-gray-800";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-500">
            Manage stock levels and track inventory
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/inventory/logs"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
          >
            <DocumentTextIcon className="w-5 h-5" />
            View Logs
          </Link>
          <Link
            to="/inventory/low-stock"
            className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-medium flex items-center gap-2"
          >
            <ExclamationTriangleIcon className="w-5 h-5" />
            Low Stock Alerts
          </Link>
          <button
            onClick={handleRestock}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Bulk Restock
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="block text-sm text-gray-500 mb-2">
            Total Products
          </span>
          <span className={`block text-3xl font-bold ${getStatColor("total")}`}>
            {stats.total}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="block text-sm text-gray-500 mb-2">In Stock</span>
          <span
            className={`block text-3xl font-bold ${getStatColor("inStock")}`}
          >
            {stats.inStock}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="block text-sm text-gray-500 mb-2">Low Stock</span>
          <span
            className={`block text-3xl font-bold ${getStatColor("lowStock")}`}
          >
            {stats.lowStock}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="block text-sm text-gray-500 mb-2">Out of Stock</span>
          <span
            className={`block text-3xl font-bold ${getStatColor("outOfStock")}`}
          >
            {stats.outOfStock}
          </span>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <span className="block text-sm text-gray-500 mb-2">
            Inventory Value
          </span>
          <span className={`block text-3xl font-bold ${getStatColor("value")}`}>
            ₱{stats.totalValue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-white"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">Loading inventory...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-red-50 rounded-xl">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product) => {
                  const status = getStockStatus(product.current_stock);
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">
                            {product.product_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.product_code}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        {product.category?.name || "Uncategorized"}
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-800">
                        ₱{Number(product.price).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-sm font-medium ${
                            status.class === "out"
                              ? "text-red-600"
                              : status.class === "low"
                                ? "text-amber-600"
                                : "text-green-600"
                          }`}
                        >
                          {product.current_stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: status.color + "20",
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-gray-800">
                        ₱{(product.price * product.current_stock).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleAdjustStock(product)}
                          className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Adjust Stock"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-600">
                Page{" "}
                <span className="font-bold text-gray-800">{currentPage}</span>{" "}
                of <span className="font-bold text-gray-800">{totalPages}</span>
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-sm transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showRestockModal && (
        <RestockModal
          items={restockItems}
          onClose={() => setShowRestockModal(false)}
          onRestock={handleBulkRestock}
          processing={processing}
        />
      )}

      {showAdjustModal && selectedProduct && (
        <AdjustStockModal
          product={selectedProduct}
          onClose={() => {
            setShowAdjustModal(false);
            setSelectedProduct(null);
          }}
          onAdjust={handleSingleAdjust}
          processing={processing}
        />
      )}
    </div>
  );
};

export default Inventory;
