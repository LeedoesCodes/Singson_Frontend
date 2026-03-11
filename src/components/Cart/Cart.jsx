import React, { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { placeOrder } from "../../api/order";
import "./Cart.scss";

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
    <div className="cart">
      <h2>Your Order</h2>

      {message && <p className="cart-success">{message}</p>}
      {error && <p className="cart-error">{error}</p>}

      {cart.length === 0 && <p className="cart-empty">No items yet.</p>}

      {cart.map((item) => (
        <div className="cart-item" key={item.id}>
          <div className="cart-item-info">
            <strong>{item.product_name}</strong>
            <p>
              ₱{Number(item.price).toFixed(2)} × {item.quantity}
            </p>
          </div>

          <button
            className="remove-btn"
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="cart-footer">
          <h3>Total: ₱{Number(total).toFixed(2)}</h3>

          <button
            className="place-order"
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
