import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const StarRating = ({ rating, onRatingChange, starSize = '1x', color = '#ffd700' }) => {
  // Render five stars. For each star, if its index is less than or equal to the rating, show a solid star; otherwise, a regular (outlined) star.
  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      {stars.map((star) => (
        <span
          key={star}
          style={{ cursor: 'pointer' }}
          onClick={() => onRatingChange(star)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onRatingChange(star);
          }}
          role="button"
          tabIndex={0}
        >
          <FontAwesomeIcon
            icon={star <= rating ? solidStar : regularStar}
            size={starSize}
            color={color}
          />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
