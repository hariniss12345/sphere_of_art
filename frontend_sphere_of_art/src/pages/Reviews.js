import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsByCustomer, deleteReview } from '../redux/slices/reviewSlice';
import { useNavigate, useParams } from 'react-router-dom';
import InlineEditReview from './InlineEditReview';
import Swal from 'sweetalert2';

const Reviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviews, loading, error } = useSelector((state) => state.review);
  const { customerId } = useParams(); // Ensure route: /reviews/customer/:customerId
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    if (customerId) {
      dispatch(fetchReviewsByCustomer(customerId));
    }
  }, [customerId, dispatch]);

  const handleEdit = (reviewId) => {
    setEditingReviewId(reviewId);
  };

  const handleDelete = (reviewId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this review?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteReview(reviewId));
        Swal.fire('Deleted!', 'Your review has been deleted.', 'success');
      }
    });
  };

  const finishEdit = () => {
    setEditingReviewId(null);
  };

  if (loading) return <p className="text-white">Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 border border-gray-700 rounded bg-gray-900 shadow">
              {editingReviewId === review._id ? (
                <InlineEditReview review={review} onFinishEdit={finishEdit} />
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">
                        Artist: {review.artistId?.username || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Email: {review.artistId?.email || 'N/A'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(review._id)}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p>
                      <strong>Rating:</strong> {review.rating}
                    </p>
                    <p>
                      <strong>Comment:</strong> {review.comment}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
