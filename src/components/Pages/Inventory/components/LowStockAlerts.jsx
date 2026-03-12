import React, { useState, useEffect } from "react";
import {
  getLowStockProducts,
  restockProducts,
} from "../../../../api/inventory";
import { useNavigate } from "react-router-dom";
import {
  ArrowPathIcon,
  ArrowLeftIcon,
  CubeIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const LowStockAlerts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [threshold, setThreshold] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockQuantities, setRestockQuantities] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setLoading(true);
      const result = await getLowStockProducts();

      if (result.ok) {
        setProducts(result.data.products || []);
        setThreshold(result.data.threshold || 10);
      } else {
        setError(result.data?.message || "Failed to fetch low stock products");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0)
      return {
        class: "out",
        label: "Out of Stock",
        color: "text-red-600 bg-red-100",
        icon: XCircleIcon,
      };
    if (stock <= 5)
      return {
        class: "critical",
        label: "Critical",
        color: "text-red-600 bg-red-100",
        icon: ExclamationCircleIcon,
      };
    if (stock <= 10)
      return {
        class: "low",
        label: "Low Stock",
        color: "text-amber-600 bg-amber-100",
        icon: ExclamationTriangleIcon,
      };
    return {
      class: "good",
      label: "Good",
      color: "text-emerald-600 bg-emerald-100",
      icon: CheckCircleIcon,
    };
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });

    // Initialize quantity if not set
    if (!restockQuantities[productId]) {
      setRestockQuantities((prev) => ({
        ...prev,
        [productId]: 10, // Default restock quantity
      }));
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      const allIds = products.map((p) => p.id);
      setSelectedProducts(allIds);

      // Initialize quantities for all products
      const quantities = {};
      allIds.forEach((id) => {
        quantities[id] = 10;
      });
      setRestockQuantities(quantities);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setRestockQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, quantity),
    }));
  };

  const handleBulkRestock = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to restock");
      return;
    }

    const items = selectedProducts.map((id) => ({
      product_id: id,
      quantity: restockQuantities[id] || 10,
    }));

    try {
      setProcessing(true);
      const result = await restockProducts(
        items,
        "Bulk restock from low stock alerts",
      );

      if (result.ok) {
        alert("Products restocked successfully!");
        fetchLowStockProducts(); // Refresh the list
        setSelectedProducts([]);
        setRestockQuantities({});
        setShowRestockModal(false);
      } else {
        alert(result.data?.message || "Failed to restock products");
      }
    } catch (err) {
      alert("Error restocking products");
    } finally {
      setProcessing(false);
    }
  };

  const handleQuickRestock = (productId) => {
    setSelectedProducts([productId]);
    setRestockQuantities({ [productId]: 10 });
    setShowRestockModal(true);
  };

  // Group products by status
  const outOfStock = products.filter((p) => p.current_stock <= 0);
  const critical = products.filter(
    (p) => p.current_stock > 0 && p.current_stock <= 5,
  );
  const lowStock = products.filter(
    (p) => p.current_stock > 5 && p.current_stock <= threshold,
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading low stock alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchLowStockProducts}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Low Stock Alerts</h1>
          <p className="text-sm text-gray-500">
            Products with stock level below {threshold} units
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/inventory")}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Inventory
          </button>
          <button
            onClick={fetchLowStockProducts}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {outOfStock.length}
              </p>
            </div>
            <XCircleIcon className="w-8 h-8 text-red-500" />
          </div>
          {outOfStock.length > 0 && (
            <button
              onClick={() => {
                const firstOutOfStock = outOfStock[0];
                handleQuickRestock(firstOutOfStock.id);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              Restock now <span>→</span>
            </button>
          )}
        </div>

        <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-500 font-medium">Critical (≤5)</p>
              <p className="text-2xl font-bold text-gray-800">
                {critical.length}
              </p>
            </div>
            <ExclamationCircleIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">
                Low Stock (≤{threshold})
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {lowStock.length}
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {products.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Select All</span>
            </label>
            <span className="text-sm text-gray-500">
              {selectedProducts.length} product
              {selectedProducts.length !== 1 ? "s" : ""} selected
            </span>
          </div>

          {selectedProducts.length > 0 && (
            <button
              onClick={() => setShowRestockModal(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <CubeIcon className="w-4 h-4" />
              Bulk Restock Selected
            </button>
          )}
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            All Stock Levels Are Healthy!
          </h3>
          <p className="text-gray-500">
            No products are currently below the {threshold} units threshold.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Out of Stock Section */}
          {outOfStock.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                <XCircleIcon className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-700">Out of Stock</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {outOfStock.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={selectedProducts.includes(product.id)}
                    onSelect={() => handleSelectProduct(product.id)}
                    onQuickRestock={() => handleQuickRestock(product.id)}
                    getStockStatus={getStockStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Critical Section */}
          {critical.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-red-600">
                  Critical Stock (1-5 units)
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {critical.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={selectedProducts.includes(product.id)}
                    onSelect={() => handleSelectProduct(product.id)}
                    onQuickRestock={() => handleQuickRestock(product.id)}
                    getStockStatus={getStockStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low Stock Section */}
          {lowStock.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-700">
                  Low Stock (6-{threshold} units)
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {lowStock.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={selectedProducts.includes(product.id)}
                    onSelect={() => handleSelectProduct(product.id)}
                    onQuickRestock={() => handleQuickRestock(product.id)}
                    getStockStatus={getStockStatus}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  Bulk Restock
                </h2>
                <button
                  onClick={() => {
                    setShowRestockModal(false);
                    if (selectedProducts.length === 0) {
                      setSelectedProducts([]);
                      setRestockQuantities({});
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Set quantities for each selected product
              </p>

              <div className="space-y-4">
                {selectedProducts.map((id) => {
                  const product = products.find((p) => p.id === id);
                  if (!product) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {product.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Current stock: {product.current_stock} units
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          value={restockQuantities[id] || 10}
                          onChange={(e) =>
                            handleQuantityChange(
                              id,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                        />
                        <span className="text-sm text-gray-500">units</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRestockModal(false);
                    if (selectedProducts.length === 0) {
                      setSelectedProducts([]);
                      setRestockQuantities({});
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkRestock}
                  disabled={processing}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      Restocking...
                    </>
                  ) : (
                    <>
                      <CubeIcon className="w-4 h-4" />
                      Confirm Restock
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Product Row Component
const ProductRow = ({
  product,
  selected,
  onSelect,
  onQuickRestock,
  getStockStatus,
}) => {
  const status = getStockStatus(product.current_stock);
  const StatusIcon = status.icon;

  return (
    <div className="px-4 py-3 flex items-center gap-4 hover:bg-gray-50">
      <input
        type="checkbox"
        checked={selected}
        onChange={onSelect}
        className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">{product.product_name}</p>
            <p className="text-xs text-gray-400">{product.product_code}</p>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Current Stock:</span>
            <span
              className={`font-medium ${
                product.current_stock <= 0
                  ? "text-red-600"
                  : product.current_stock <= 5
                    ? "text-red-500"
                    : "text-amber-600"
              }`}
            >
              {product.current_stock} units
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500">Price:</span>
            <span className="font-medium">₱{product.price}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500">Category:</span>
            <span className="text-gray-600">
              {product.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onQuickRestock}
        className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium whitespace-nowrap flex items-center gap-1"
      >
        <CubeIcon className="w-4 h-4" />
        Quick Restock
      </button>
    </div>
  );
};

export default LowStockAlerts;
