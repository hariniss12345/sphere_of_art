import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewsByCustomer, deleteReview } from "../redux/slices/reviewSlice";
import { useNavigate, useParams } from "react-router-dom";
import InlineEditReview from "./InlineEditReview";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Reviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reviews, loading, error } = useSelector((state) => state.review);
  const { customerId } = useParams();
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
      title: "Are you sure?",
      text: "Do you really want to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteReview(reviewId));
        Swal.fire("Deleted!", "Your review has been removed.", "success");
      }
    });
  };

  const finishEdit = () => {
    setEditingReviewId(null);
  };

  if (loading) return <p className="text-white text-center">Loading reviews...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-200">Your Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-400">No reviews found.</p>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 border border-gray-700 rounded-lg bg-gray-900 shadow-md transition duration-300 transform hover:scale-105"
            >
              {editingReviewId === review._id ? (
                <InlineEditReview review={review} onFinishEdit={finishEdit} />
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">
                        Artist: <span className="text-blue-400">{review.artistId?.username || "N/A"}</span>
                      </p>
                      <p className="text-sm text-gray-400">Email: {review.artistId?.email || "N/A"}</p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(review._id)}
                        className="bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faEdit} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Rating & Comment Section */}
                  <div className="mt-3">
                    <p className="text-lg">
                      <strong>Rating:</strong>{" "}
                      <span className="text-yellow-400">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </p>
                    <p className="mt-2 text-gray-300">
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
