import React, { useState } from "react";

const AdjustStockModal = ({ product, onClose, onAdjust, processing }) => {
  const [newStock, setNewStock] = useState(product.current_stock);
  const [reason, setReason] = useState("");
  const [adjustmentType, setAdjustmentType] = useState("set"); // 'set', 'add', 'subtract'

  const handleAdjustmentTypeChange = (type) => {
    setAdjustmentType(type);
    if (type === "set") {
      setNewStock(product.current_stock);
    } else if (type === "add") {
      setNewStock(0);
    } else {
      setNewStock(0);
    }
  };

  const calculateNewStock = () => {
    if (adjustmentType === "set") {
      return newStock;
    } else if (adjustmentType === "add") {
      return product.current_stock + newStock;
    } else {
      return Math.max(0, product.current_stock - newStock);
    }
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for the adjustment");
      return;
    }

    const finalStock = calculateNewStock();
    if (finalStock < 0) {
      alert("Stock cannot be negative");
      return;
    }

    onAdjust(product.id, finalStock, reason);
  };

  const finalStock = calculateNewStock();
  const change = finalStock - product.current_stock;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Adjust Stock: {product.product_name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {/* Current Stock */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Current Stock:{" "}
              <span className="font-bold text-gray-800">
                {product.current_stock} units
              </span>
            </p>
          </div>

          {/* Adjustment Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Adjustment Type:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  value="set"
                  checked={adjustmentType === "set"}
                  onChange={() => handleAdjustmentTypeChange("set")}
                  className="text-orange-500 focus:ring-orange-500"
                />
                Set to exact value
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  value="add"
                  checked={adjustmentType === "add"}
                  onChange={() => handleAdjustmentTypeChange("add")}
                  className="text-orange-500 focus:ring-orange-500"
                />
                Add quantity
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="radio"
                  value="subtract"
                  checked={adjustmentType === "subtract"}
                  onChange={() => handleAdjustmentTypeChange("subtract")}
                  className="text-orange-500 focus:ring-orange-500"
                />
                Subtract quantity
              </label>
            </div>
          </div>

          {/* Adjustment Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {adjustmentType === "set"
                ? "New Stock Level:"
                : adjustmentType === "add"
                  ? "Quantity to Add:"
                  : "Quantity to Subtract:"}
            </label>
            <input
              type="number"
              min="0"
              value={newStock}
              onChange={(e) =>
                setNewStock(Math.max(0, parseInt(e.target.value) || 0))
              }
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          {/* Preview */}
          {adjustmentType !== "set" && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">
                Current: {product.current_stock} → New: {finalStock}
              </p>
              <p
                className={`text-sm font-medium ${
                  change > 0
                    ? "text-green-600"
                    : change < 0
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                Change: {change > 0 ? "+" : ""}
                {change} units
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="mb-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reason for Adjustment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Stock count correction, damaged items, etc."
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={processing || !reason.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {processing ? "Adjusting..." : "Confirm Adjustment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustStockModal;
