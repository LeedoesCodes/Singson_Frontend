import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { placeOrder } from "../../api/order";

const Cart = () => {
  const { cart, removeFromCart, total, clearCart } = useContext(CartContext);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      setMessage("");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const result = await placeOrder(cart);

      if (result.ok) {
        setMessage(
          `Order placed successfully. Order ID: ${result.data.order.id}`,
        );
        clearCart();
      } else {
        setError(result.data.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Place order failed:", err);
      setError("Unable to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-5 h-screen sticky top-0 overflow-y-auto overflow-x-hidden">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Order</h2>

      {message && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg mb-3 text-sm break-words">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg mb-3 text-sm break-words">
          {error}
        </div>
      )}

      {cart.length === 0 && (
        <p className="text-gray-500 text-sm">No items yet.</p>
      )}

      <div className="space-y-1">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-start gap-2 py-2 border-b border-gray-100"
          >
            <div className="flex-1 min-w-0 pr-2">
              <strong className="block text-gray-900 mb-1 break-words">
                {item.product_name}
              </strong>
              <p className="text-gray-500 text-sm whitespace-nowrap">
                ₱{Number(item.price).toFixed(2)} × {item.quantity}
              </p>
            </div>

            <button
              className="bg-red-600 hover:bg-red-700 text-white border-none px-2 py-1.5 rounded-md cursor-pointer text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-5">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Total: ₱{Number(total).toFixed(2)}
          </h3>

          <button
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white border-none rounded-lg font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            onClick={handlePlaceOrder}
            disabled={submitting}
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
