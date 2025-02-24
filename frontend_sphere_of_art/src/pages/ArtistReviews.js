import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsByArtist } from '../redux/slices/reviewSlice';
import { useParams } from 'react-router-dom';

const ArtistReviews = () => {
  const dispatch = useDispatch();
  const { reviews, loading, error } = useSelector((state) => state.review);
  const { artistId } = useParams(); // Ensure your route is like /reviews/artist/:artistId

  useEffect(() => {
    if (artistId) {
      dispatch(fetchReviewsByArtist(artistId));
    }
  }, [artistId, dispatch]);

  if (loading) return <p className="text-white">Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 border border-gray-700 rounded bg-gray-900 shadow">
              <div>
                <p className="font-semibold">
                  Customer: {review.customerId?.username || 'N/A'}
                </p>
                <p className="font-semibold">
                  Email: {review.customerId?.email || 'N/A'}
                </p>
              </div>
              <div className="mt-2">
                <p>
                  <strong>Rating:</strong> {review.rating}
                </p>
                <p>
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
