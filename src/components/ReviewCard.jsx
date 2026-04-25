import React from 'react';
function ReviewCard({ review }) {
  return (
    <article className="list-card">
      <div className="list-card-head">
        <strong>{review.userId?.name || 'Customer'}</strong>
        <span>{review.rating}/5</span>
      </div>
      <p>{review.comment || 'No written feedback provided.'}</p>
    </article>
  );
}

export default ReviewCard;
