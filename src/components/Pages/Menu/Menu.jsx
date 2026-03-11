import React, { useEffect, useState, useContext } from "react";
import "./Menu.scss";
import { CartContext } from "../../../context/CartContext";
import Cart from "../../Cart/Cart";

const API_URL = "http://127.0.0.1:8000/api";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to load menu:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="menu-page">
        <h2>Loading menu...</h2>
      </div>
    );
  }

  return (
    <div className="menu-layout">
      {/* LEFT SIDE - MENU */}
      <div className="menu-page">
        <h1 className="menu-title">Canteen Menu</h1>

        <div className="menu-grid">
          {products.map((product) => (
            <div className="menu-card" key={product.id}>
              <div>
                <h3 className="product-name">{product.product_name}</h3>

                <p className="product-price">
                  ₱{Number(product.price).toFixed(2)}
                </p>

                <p
                  className={`product-stock ${
                    product.current_stock > 0 ? "available" : "out"
                  }`}
                >
                  {product.current_stock > 0 ? "Available" : "Out of Stock"}
                </p>
              </div>

              <button
                className="order-btn"
                disabled={product.current_stock === 0}
                onClick={() => addToCart(product)}
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - CART */}
      <Cart />
    </div>
  );
};

export default Menu;
