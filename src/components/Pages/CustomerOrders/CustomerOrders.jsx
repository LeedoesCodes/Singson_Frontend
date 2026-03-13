import React, { useEffect, useState } from "react";
import { getOrders } from "../../../api/order";
import { submitReview, getMyReviews } from "../../../api/review";
import ReviewModal from "../Reviews/ReviewModal";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom"; // Add useNavigate

const CustomerOrders = () => {
  const navigate = useNavigate(); // Add this
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchMyReviews();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getOrders();
      if (result.ok) {
        setOrders(result.data || []);
      } else {
        setError(result.data?.message || "Failed to load orders");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    try {
      const data = await getMyReviews();
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    const result = await submitReview(reviewData);
    if (result.ok) {
      alert("Thank you for your review!");
      fetchMyReviews();
    } else {
      alert(result.data.message || "Failed to submit review");
    }
  };

  const handleTrackOrder = (orderNumber) => {
    navigate(`/track/${orderNumber}`);
  };

  const hasReviewedOrder = (orderId) => {
    return reviews.some((review) => review.order_id === orderId);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            You haven't placed any orders yet.
          </p>
          <Link
            to="/menu"
            className="mt-4 inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const reviewed = hasReviewedOrder(order.id);

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      Order #{order.order_number}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.status === "completed" && !reviewed && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReviewModal(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
                      >
                        <StarIcon className="w-4 h-4" />
                        Write Review
                      </button>
                    )}
                    {reviewed && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                        <StarIconSolid className="w-4 h-4" />
                        Reviewed
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 text-left">Item</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Price</th>
                        <th className="py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id} className="border-b last:border-0">
                          <td className="py-3">
                            {item.product?.product_name || "Product"}
                          </td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-right">
                            ₱{Number(item.price).toFixed(2)}
                          </td>
                          <td className="py-3 text-right font-medium">
                            ₱{(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="pt-3 text-right font-bold">
                          Total:
                        </td>
                        <td className="pt-3 text-right font-bold text-orange-600">
                          ₱{Number(order.total_amount).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Order Footer with Actions */}
                <div className="px-6 py-3 bg-gray-50 border-t flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {order.items?.length} item(s)
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleTrackOrder(order.order_number)}
                      className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center gap-1"
                    >
                      Track Order
                      <span className="text-lg">→</span>
                    </button>
                    {order.status === "completed" && !reviewed && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowReviewModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center gap-1"
                      >
                        <StarIcon className="w-4 h-4" />
                        Write Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleSubmitReview}
        order={selectedOrder}
      />
    </div>
  );
};

export default CustomerOrders;
