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

    // Validate that customer is logged in.
    if (!customerId) {
      setErrorMsg('Customer not logged in.');
      return;
    }

    // Validate comment field
    if (!comment.trim()) {
      setErrorMsg('Comment is required.');
      return;
    }

    // Validate rating (must be between 1 and 5)
    if (rating < 1 || rating > 5) {
      setErrorMsg('Please select a rating between 1 and 5.');
      return;
    }

    // Ensure orderId and artistId are available
    if (!orderId || !artistId) {
      setErrorMsg('Missing order ID or artist ID.');
      return;
    }

    const reviewData = { orderId, customerId, artistId, rating, comment };
    console.log('Submitting Review:', reviewData);

    const resultAction = await dispatch(createReview(reviewData));

    if (createReview.fulfilled.match(resultAction)) {
      // Reset the form fields
      setRating(1);
      setComment('');
      setErrorMsg('');

      // Display SweetAlert success notification
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
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
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
          className="mt-1 block w-full border rounded px-2 py-1"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Review
      </button>

      {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
    </form>
  );
};

export default AddReview;
