import React, { useState } from "react";

const RestockModal = ({ items, onClose, onRestock, processing }) => {
  const [restockItems, setRestockItems] = useState(items);
  const [notes, setNotes] = useState("");

  const updateQuantity = (productId, newQuantity) => {
    setRestockItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item,
      ),
    );
  };

  const toggleSelectAll = () => {
    const allSelected = restockItems.every((item) => item.selected);
    setRestockItems((prev) =>
      prev.map((item) => ({ ...item, selected: !allSelected })),
    );
  };

  const toggleSelect = (productId) => {
    setRestockItems((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, selected: !item.selected }
          : item,
      ),
    );
  };

  const handleSubmit = () => {
    const selectedItems = restockItems
      .filter((item) => item.selected)
      .map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

    if (selectedItems.length === 0) {
      alert("Please select at least one item to restock");
      return;
    }

    onRestock(selectedItems, notes);
  };

  const totalSelected = restockItems.filter((i) => i.selected).length;
  const totalQuantity = restockItems
    .filter((i) => i.selected)
    .reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Bulk Restock</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          <p className="text-gray-500 mb-6">
            Select products to restock and set quantities.
          </p>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={totalSelected === restockItems.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Restock Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {restockItems.map((item) => (
                  <tr
                    key={item.product_id}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={item.selected || false}
                        onChange={() => toggleSelect(item.product_id)}
                        className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      />
                    </td>
                    <td className="p-3 text-sm text-gray-800">
                      {item.product_name}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-sm font-medium ${
                          item.current_stock <= 10
                            ? "text-amber-600"
                            : "text-gray-600"
                        }`}
                      >
                        {item.current_stock} units
                      </span>
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product_id,
                            parseInt(e.target.value) || 1,
                          )
                        }
                        disabled={!item.selected}
                        className="w-24 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex gap-6">
            <p className="text-sm text-gray-600">
              Selected:{" "}
              <span className="font-bold text-gray-800">{totalSelected}</span>{" "}
              products
            </p>
            <p className="text-sm text-gray-600">
              Total items to add:{" "}
              <span className="font-bold text-gray-800">{totalQuantity}</span>{" "}
              units
            </p>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Notes (optional):
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this restock..."
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
            disabled={processing || totalSelected === 0}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {processing ? "Restocking..." : "Confirm Restock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestockModal;
