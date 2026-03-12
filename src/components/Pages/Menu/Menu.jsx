import React, { useEffect, useState, useContext } from "react";
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
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-600">
          Loading menu...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT SIDE - MENU */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
          Canteen Menu
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 break-words">
                  {product.product_name}
                </h3>

                <p className="text-xl font-bold text-blue-600 mb-2">
                  ₱{Number(product.price).toFixed(2)}
                </p>

                <p
                  className={`text-sm mb-3 ${
                    product.current_stock > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {product.current_stock > 0 ? "Available" : "Out of Stock"}
                </p>
              </div>

              <button
                className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors ${
                  product.current_stock > 0
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
                disabled={product.current_stock === 0}
                onClick={() => addToCart(product)}
              >
                Add to Order
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - CART - FIXED */}
      <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-hidden">
        <Cart />
      </div>
    </div>
  );
};

export default Menu;
