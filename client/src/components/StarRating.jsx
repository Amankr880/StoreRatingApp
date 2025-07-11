import React from 'react';

const StarRating = ({ rating, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div>
      {stars.map((star) => (
        <span
          key={star}
          style={{ fontSize: '1.5rem', cursor: 'pointer', color: star <= rating ? '#ffc107' : '#ccc' }}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
