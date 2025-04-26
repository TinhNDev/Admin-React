import React from "react";
import moment from "moment";
import "moment/locale/vi";

const ReviewList = ({ reviews, type }) => {
  // Helper function to get rating and comment based on type
  const getRatingAndComment = (review) => {
    if (type === "driver") {
      return {
        rating: review.dri_rating,
        comment: review.dri_comment,
      };
    }
    return {
      rating: review.res_rating,
      comment: review.res_comment,
    };
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => {
      const { rating } = getRatingAndComment(review);
      return sum + rating;
    }, 0);

    return (totalRating / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Đánh giá từ khách hàng
          </h3>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 font-medium text-gray-800">
                  {averageRating}
                </span>
                <span className="ml-1 text-sm text-gray-500">
                  ({reviews.length} đánh giá)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => {
            const { rating, comment } = getRatingAndComment(review);
            return (
              <div
                key={review.id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {review.name}
                        </h4>
                        <div className="flex items-center mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {moment(review.createdAt).format("DD/MM/YYYY HH:mm")}
                      </div>
                    </div>

                    {comment && (
                      <div className="text-gray-700 mb-3 whitespace-pre-line rounded-lg bg-gray-50 p-3">
                        {comment}
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {review.phone_number}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="bg-gray-100 rounded-full p-3 mb-4">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900">
                Chưa có đánh giá nào
              </h4>
              <p className="mt-1 text-gray-500">
                Các đánh giá từ khách hàng sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
