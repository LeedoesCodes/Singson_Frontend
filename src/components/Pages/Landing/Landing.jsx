import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  StarIcon,
  UserIcon,
  ArrowRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import {
  UtensilsCrossed,
  Coffee,
  Pizza,
  Timer,
  Truck,
  Smile,
  Users,
  ChefHat,
  Soup,
  Sandwich,
  CupSoda,
  LogIn,
  UserPlus,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const Landing = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }

    fetchFeaturedItems();
    fetchCategories();
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${API_URL}/reviews`);
      const data = await response.json();
      setReviews(data.reviews || []);
      setAverageRating(data.average_rating || 0);
      setTotalReviews(data.total_reviews || 0);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const getImageUrl = (product) => {
    if (!product) return null;

    // If the API already provides a full URL
    if (product.image_url) {
      return product.image_url;
    }

    // If the API provides a relative path
    if (product.image) {
      // Handle different possible formats
      if (product.image.startsWith("http")) {
        return product.image;
      } else if (product.image.startsWith("/storage")) {
        return `${API_URL.replace("/api", "")}${product.image}`;
      } else {
        return `${API_URL.replace("/api", "")}/storage/${product.image}`;
      }
    }

    return null;
  };

  const fetchFeaturedItems = async () => {
    try {
      const response = await fetch(
        `${API_URL}/reports/public-best-sellers?limit=3`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Featured items API response:", data); // Debug log

      if (data.products && data.products.length > 0) {
        console.log("First product:", data.products[0]); // Debug log

        const mappedItems = data.products.map((product, index) => {
          // Check if image exists
          console.log(`Product ${index} image:`, product.image); // Debug log
          console.log(`Product ${index} image_url:`, product.image_url); // Debug log

          const imageUrl = getImageUrl(product);
          console.log(`Product ${index} final imageUrl:`, imageUrl); // Debug log

          // Different background colors for fallback
          const bgColors = [
            "bg-gradient-to-br from-orange-100 to-orange-50",
            "bg-gradient-to-br from-amber-100 to-amber-50",
            "bg-gradient-to-br from-yellow-100 to-yellow-50",
          ];

          return {
            id: product.id,
            name: product.name,
            price: `₱${Number(product.price).toFixed(0)}`,
            imageUrl: imageUrl,
            description: product.description || "A student favorite!",
            bgColor: bgColors[index % bgColors.length],
            quantity: product.quantity,
          };
        });
        setFeaturedItems(mappedItems);
        setError("");
      } else {
        setFeaturedItems([]);
      }
    } catch (err) {
      console.error("Failed to fetch featured items:", err);
      setError("Could not load featured items");
      setFeaturedItems([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      if (response.ok && data.products) {
        const uniqueCats = [
          ...new Map(
            data.products
              .filter((p) => p.category)
              .map((p) => [p.category.id, p.category]),
          ).values(),
        ];

        const iconMap = {
          Meals: <Soup className="w-6 h-6" />,
          "Rice Meals": <Soup className="w-6 h-6" />,
          Snacks: <Pizza className="w-6 h-6" />,
          Beverages: <CupSoda className="w-6 h-6" />,
          Drinks: <CupSoda className="w-6 h-6" />,
          Desserts: <ChefHat className="w-6 h-6" />,
          Combos: <UtensilsCrossed className="w-6 h-6" />,
          Noodles: <UtensilsCrossed className="w-6 h-6" />,
        };

        const colorMap = {
          Meals: "bg-red-100 text-red-600",
          "Rice Meals": "bg-red-100 text-red-600",
          Snacks: "bg-orange-100 text-orange-600",
          Beverages: "bg-blue-100 text-blue-600",
          Drinks: "bg-blue-100 text-blue-600",
          Desserts: "bg-pink-100 text-pink-600",
          Combos: "bg-purple-100 text-purple-600",
          Noodles: "bg-yellow-100 text-yellow-600",
        };

        const mappedCategories = uniqueCats.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: iconMap[cat.name] || <UtensilsCrossed className="w-6 h-6" />,
          color: colorMap[cat.name] || "bg-gray-100 text-gray-600",
        }));

        setCategories(mappedCategories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const benefits = [
    {
      icon: <Timer className="w-8 h-8 text-orange-500" />,
      title: "Ready in Minutes",
      description: "No more waiting. Order ahead and pick up when ready.",
    },
    {
      icon: <Truck className="w-8 h-8 text-orange-500" />,
      title: "Real-time Updates",
      description: "Track your order from preparation to pickup.",
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Student Community",
      description: "Join thousands of students who order here daily.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading delicious food...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section with Header */}
      <div className="bg-orange-500 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🍚</div>
          <div className="absolute bottom-10 right-10 text-8xl">🍜</div>
          <div className="absolute top-20 right-20 text-6xl">🥘</div>
        </div>

        {/* Header with Auth Buttons */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              Canteen ni Juan
            </Link>

            {/* Auth Buttons - Only show if user is not logged in */}
            {!user ? (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors border border-white/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-white/90">
                  Welcome, {user.name?.split(" ")[0]}!
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-orange-400 text-white px-4 py-2 rounded-full mb-6">
              <Smile className="w-5 h-5" />
              <span className="text-sm font-medium">Sulit at masarap!</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Sarap dito,
              <span className="block text-orange-100">kain tayo! 🍽️</span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-2xl mx-auto">
              Freshly cooked meals, merienda, and drinks
              <span className="block">for every Juan in the campus</span>
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/menu"
                className="group px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg hover:bg-orange-50 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <UtensilsCrossed className="w-5 h-5" />
                See What's Cooking
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/track"
                className="px-8 py-4 bg-orange-600 text-white rounded-full font-semibold text-lg hover:bg-orange-700 transition-all border-2 border-white/20 flex items-center gap-2"
              >
                <Timer className="w-5 h-5" />
                Track My Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Quick View */}
      {categories.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to="/menu"
                className={`${category.color} p-4 rounded-xl text-center hover:shadow-md transition-shadow`}
              >
                <div className="flex justify-center mb-2">{category.icon}</div>
                <span className="font-medium text-sm">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Items with Images */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Student Favorites Today
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The dishes everyone's talking about this week
          </p>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredItems.map((item, index) => (
              <Link
                to="/menu"
                key={item.id || index}
                className={`${item.bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-orange-100 group hover:-translate-y-1`}
              >
                {/* Product Image */}
                <div className="h-32 mb-4 rounded-lg overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML =
                          '<div class="w-full h-full flex items-center justify-center"><PhotoIcon class="w-12 h-12 text-orange-300" /></div>';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PhotoIcon className="w-12 h-12 text-orange-300" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 text-center line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-orange-600 font-bold text-xl text-center">
                    {item.price}
                  </p>
                  {item.quantity > 0 && (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                      {item.quantity} sold
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 mb-2">
              No featured items available yet.
            </p>
            <p className="text-sm text-gray-400">
              Check back later or browse our full menu!
            </p>
            <Link
              to="/menu"
              className="inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        )}
      </div>

      {/* Why Students Love Us */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <HeartIcon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Why students love us
            </h2>
            <p className="text-gray-600">
              We make campus life a little tastier
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real Customer Reviews Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <Users className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            What our customers say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real reviews from students like you
          </p>

          {/* Overall Rating */}
          {totalReviews > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIconSolid
                    key={star}
                    className={`w-5 h-5 ${
                      star <= averageRating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-700">
                {averageRating} out of 5
              </span>
              <span className="text-sm text-gray-500">
                ({totalReviews} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                    {review.user?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex text-yellow-400 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIconSolid
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-2">"{review.comment}"</p>

                {review.order_id && (
                  <p className="text-xs text-gray-400 mt-2">
                    Verified purchase
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500 mb-2">No reviews yet.</p>
              <p className="text-sm text-gray-400">
                Be the first to leave a review after your order!
              </p>
            </div>
          )}
        </div>

        {/* Write Review CTA - Only show if user is logged in */}
        {user && (
          <div className="text-center mt-10">
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <StarIcon className="w-5 h-5" />
              Write a Review
            </Link>
          </div>
        )}
      </div>

      {/* Call to Action - Only show if user is NOT logged in */}
      {!user && (
        <div className="bg-orange-500 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Gutom ka na ba? 🍚</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who already order here!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-white text-orange-600 rounded-full font-semibold text-lg hover:bg-orange-50 transition-all flex items-center gap-2 shadow-lg"
              >
                <UserIcon className="w-5 h-5" />
                Sign Up - It's Free!
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-orange-600 text-white rounded-full font-semibold text-lg hover:bg-orange-700 transition-all border-2 border-white/20"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-gray-700">
                Canteen ni Juan
              </span>
            </div>
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Laging fresh, laging masarap! 🇵🇭
            </div>
            <div className="flex gap-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <a href="#" className="text-gray-500 hover:text-orange-500">
                FB
              </a>
              <a href="#" className="text-gray-500 hover:text-orange-500">
                IG
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
