import React, { useState, useEffect } from "react";
import { getProducts } from "../../../api/product";
import { placeOrder } from "../../../api/order";
import { useNavigate } from "react-router-dom";
import {
  PhotoIcon,
  CubeIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const POSInterface = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [processing, setProcessing] = useState(false);

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

  const addToCart = (product) => {
    if (!product.is_available) {
      alert(`${product.product_name} is currently unavailable`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.current_stock) {
          alert(`Only ${product.current_stock} items available in stock`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId);
    if (newQuantity > product.current_stock) {
      alert(`Only ${product.current_stock} items available in stock`);
      return;
    }
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    // Debug: Check if token exists
    const token = localStorage.getItem("token");
    console.log("Token exists:", !!token);
    if (token) {
      console.log("Token first 20 chars:", token.substring(0, 20) + "...");
    } else {
      alert("You need to be logged in. Please log out and log in again.");
      return;
    }

    try {
      setProcessing(true);
      const result = await placeOrder(cart);
      console.log("Order result:", result);

      if (result.ok) {
        alert(`Order #${result.data.order.order_number} created successfully!`);
        setCart([]);
        navigate("/orders");
      } else {
        alert(result.data.message || "Failed to create order");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Error creating order");
    } finally {
      setProcessing(false);
    }
  };

  const getImageUrl = (product) => {
    if (product.image_url) {
      return product.image_url;
    } else if (product.image) {
      return `http://127.0.0.1:8000/storage/${product.image}`;
    }
    return null;
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category?.id === selectedCategory;
    const matchesSearch =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Point of Sale
          </h1>
          <p className="text-gray-500">
            Process customer orders quickly and efficiently
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Products Section - Scrollable */}
          <div className="lg:w-2/3">
            {/* Search and Filters - Fixed within products section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 sticky top-6 z-10">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
              />

              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === "all"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      selectedCategory === category.id
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid - Scrollable area */}
            <div className="overflow-auto max-h-[calc(100vh-280px)] pr-1">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredProducts.map((product) => {
                    const imageUrl = getImageUrl(product);
                    return (
                      <div
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={`bg-white rounded-xl shadow-sm p-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                          !product.is_available || product.current_stock === 0
                            ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-sm"
                            : ""
                        }`}
                      >
                        {/* Product Image - Now shows actual images */}
                        <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                                e.target.parentElement.innerHTML =
                                  '<svg class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                              }}
                            />
                          ) : (
                            <CubeIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <h3 className="font-medium text-sm text-gray-800 line-clamp-1">
                          {product.product_name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                          {product.category?.name || "Uncategorized"}
                        </p>

                        {/* Price and Stock */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-orange-600">
                            ₱{Number(product.price).toFixed(0)}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                              product.current_stock > 10
                                ? "bg-green-100 text-green-700"
                                : product.current_stock > 0
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.current_stock}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Cart Section - Fixed, doesn't scroll */}
          <div className="lg:w-1/3">
            <div
              className="bg-white rounded-xl shadow-sm flex flex-col sticky top-6"
              style={{ height: "calc(100vh - 180px)" }}
            >
              {/* Cart Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    Current Order
                  </h2>
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
                    {cart.length} {cart.length === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>

              {/* Cart Items - Scrollable within fixed cart */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Cart is empty</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Click on products to add them
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                      {/* Item Header */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-gray-800 line-clamp-1">
                            {item.product_name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            ₱{Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        >
                          <span className="text-lg">×</span>
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, item.quantity - 1);
                            }}
                            className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 bg-white text-sm font-medium border-x border-gray-200 min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQuantity(item.id, item.quantity + 1);
                            }}
                            className="px-2 py-1 bg-white hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-sm text-orange-600">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer - Fixed at bottom */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-600">
                    Total
                  </span>
                  <span className="text-xl font-bold text-orange-600">
                    ₱{calculateTotal().toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || processing}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSInterface;
