import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createReview } from '../redux/slices/reviewSlice';
import AuthContext from '../context/Auth';
import StarRating from './StarRating';

const AddReview = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { orderId, artistId } = useParams(); // Get orderId and artistId from the URL
  const { userState } = useContext(AuthContext);
  const customerId = userState?.user?.id;

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerId) {
      setErrorMsg('Customer not logged in.');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Comment is required.');
      return;
    }

    if (rating < 1 || rating > 5) {
      setErrorMsg('Please select a rating between 1 and 5.');
      return;
    }

    if (!orderId || !artistId) {
      setErrorMsg('Missing order ID or artist ID.');
      return;
    }

    const reviewData = { orderId, customerId, artistId, rating, comment };

    const resultAction = await dispatch(createReview(reviewData));

    if (createReview.fulfilled.match(resultAction)) {
      setRating(1);
      setComment('');
      setErrorMsg('');

      Swal.fire({
        icon: 'success',
        title: 'Review Added!',
        text: 'Your review has been submitted successfully.',
        timer: 2000,
        showConfirmButton: false,
      });

      onSuccess && onSuccess();
    } else {
      setErrorMsg('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <form 
        onSubmit={handleSubmit} 
        className="p-4 border border-gray-700 rounded shadow bg-gray-900 text-white w-full max-w-lg"
      >
        <h3 className="text-xl font-semibold mb-3">Add Your Review</h3>

        <div className="mb-4">
          <label className="block font-medium mb-1">Rating:</label>
          <StarRating rating={rating} onRatingChange={setRating} starSize="2x" />
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block font-medium mb-1">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Review
        </button>

        {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default AddReview;
