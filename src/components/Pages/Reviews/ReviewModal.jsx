import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const ReviewModal = ({ isOpen, onClose, onSubmit, order }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setLoading(true);
    await onSubmit({
      order_id: order.id,
      rating,
      comment,
    });
    setLoading(false);
    setRating(0);
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Review Your Experience
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Order #{order?.order_number}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience? *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= (hover || rating) ? (
                    <StarIconSolid className="w-8 h-8 text-yellow-400" />
                  ) : (
                    <StarIcon className="w-8 h-8 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              placeholder="Tell us about your experience with our canteen..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
