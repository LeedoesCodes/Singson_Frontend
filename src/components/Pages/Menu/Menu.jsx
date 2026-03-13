import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../../../context/CartContext";
import Cart from "../../Cart/Cart";
import {
  PhotoIcon,
  CubeIcon,
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const { addToCart, cart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
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
    } catch (error) {
      console.error("Failed to load menu:", error);
      setError("Unable to load menu. Please try again later.");
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* LEFT SIDE - MENU */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Our Menu</h1>
            <p className="text-gray-500">
              Choose from our selection of freshly prepared meals
            </p>
          </div>

          {/* Search and Filters - Fixed */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 sticky top-6 z-10">
            {/* Search Bar */}
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm"
              />
            </div>

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
                All Items
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

          {/* Products Grid */}
          {error ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-500 mb-2">No items found</p>
              <p className="text-sm text-gray-400">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-6">
              {filteredProducts.map((product) => {
                const imageUrl = getImageUrl(product);
                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-sm p-3 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                      !product.is_available || product.current_stock === 0
                        ? "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-sm"
                        : ""
                    }`}
                    onClick={() =>
                      product.is_available &&
                      product.current_stock > 0 &&
                      addToCart(product)
                    }
                  >
                    {/* Product Image - Now shows actual images */}
                    <div className="h-20 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML =
                              '<svg class="w-8 h-8 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                          }}
                        />
                      ) : (
                        <CubeIcon className="w-8 h-8 text-orange-300" />
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
                        {product.current_stock > 0
                          ? product.current_stock
                          : "Out"}
                      </span>
                    </div>

                    {/* Availability Badge */}
                    {!product.is_available && (
                      <div className="mt-1">
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                          Unavailable
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - CART */}
      <div className="w-80 bg-white border-l border-gray-200 h-screen overflow-hidden">
        <Cart />
      </div>
    </div>
  );
};

export default Menu;
