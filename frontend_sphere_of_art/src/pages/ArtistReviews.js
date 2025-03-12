import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByArtist } from "../redux/slices/reviewSlice";
import { useParams } from "react-router-dom";

const ArtistReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);
  const { artistId } = useParams();

  useEffect(() => {
    if (artistId) {
      dispatch(fetchReviewsByArtist(artistId));
    }
  }, [artistId, dispatch]);

  if (loading) return <p className="text-white text-center">Loading reviews...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-black p-6 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Reviews</h1>
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-lg">No reviews found.</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-5 border border-gray-700 rounded-lg bg-gray-900 shadow-md"
            >
              <div>
                <p className="font-semibold text-lg">
                  Customer: <span className="text-blue-400">{review.customerId?.username || "N/A"}</span>
                </p>
                <p className="text-sm text-white-400">
                  <strong>Email: </strong>{review.customerId?.email || "N/A"}
                </p>
              </div>
              <div className="mt-3">
                <p className="text-lg">
                  <strong>Rating:</strong>{" "}
                  <span className="text-yellow-400">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </p>
                <p className="mt-2 text-gray-300 text-lg">
                  <strong>Comment:</strong> {review.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistReviews;
