import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateReview } from '../redux/slices/reviewSlice';
import Swal from 'sweetalert2';
import StarRating from './StarRating';

const InlineEditReview = ({ review, onFinishEdit }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Comment is required.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setErrorMsg('Please select a rating between 1 and 5.');
      return;
    }
    
    const updatedData = { rating, comment };
    const resultAction = await dispatch(updateReview({ reviewId: review._id, updatedData }));
    
    if (updateReview.fulfilled.match(resultAction)) {
      Swal.fire({
        icon: 'success',
        title: 'Review Updated!',
        text: 'Your review has been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
      onFinishEdit(); // Callback to exit edit mode
    } else {
      setErrorMsg('Failed to update review. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSave} className="p-4 border border-gray-700 rounded bg-black shadow text-white">
      <h3 className="text-xl font-semibold mb-3">Edit Your Review</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">Rating:</label>
        <StarRating rating={rating} onRatingChange={setRating} starSize="2x" />
      </div>
      <div className="mb-4">
        <label htmlFor="editComment" className="block font-medium mb-1">Comment:</label>
        <textarea
          id="editComment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-700 rounded px-2 py-1 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-2">
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
        <button 
          type="button" 
          onClick={onFinishEdit}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
      </div>
      {errorMsg && <p className="mt-2 text-red-500">{errorMsg}</p>}
    </form>
  );
};

export default InlineEditReview;
