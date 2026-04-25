import { getEntityId } from '../lib/utils';


function BookingCard({
  booking,
  currentUserId,
  isCustomer,
  onStatusUpdate,
  onOpenChat,
  isActiveChat,
  reviewDraft,
  onReviewChange,
  onReviewSubmit,
}) {
  const isProvider = getEntityId(booking.providerId) === currentUserId;
  const counterparty = isProvider ? booking.customerId?.name : booking.providerId?.name;
  const draft = reviewDraft || { rating: '5', comment: '' };

  return (
    <article className="list-card">
      <div className="list-card-head wrap">
        <strong>{booking.serviceId?.title || 'Service'}</strong>
        <span className="status-pill available">{booking.status}</span>
      </div>
      <p>
        With {counterparty || 'Unknown user'} · {new Date(booking.fromDate).toLocaleDateString()} to{' '}
        {new Date(booking.toDate).toLocaleDateString()}
      </p>

      {isProvider && (
        <div className="action-row wrap">
          {['approved', 'rejected', 'completed'].map((status) => (
            <button
              className="secondary-button"
              key={status}
              type="button"
              onClick={() => onStatusUpdate(booking._id, status)}
            >
              Mark {status}
            </button>
          ))}
        </div>
      )}

      <div className="action-row wrap">
        <button className="ghost-button" type="button" onClick={() => onOpenChat(booking._id)}>
          {isActiveChat ? 'Refresh chat' : 'Open chat'}
        </button>
      </div>

      {isCustomer && booking.status === 'completed' && (
        <form className="stack-form inline-form" onSubmit={onReviewSubmit}>
          <label>
            Rating
            <select
              value={draft.rating}
              onChange={(event) => onReviewChange('rating', event.target.value)}
            >
              {['5', '4', '3', '2', '1'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <label>
            Comment
            <textarea
              rows="3"
              value={draft.comment}
              onChange={(event) => onReviewChange('comment', event.target.value)}
            />
          </label>
          <button className="secondary-button" type="submit">
            Leave review
          </button>
        </form>
      )}
    </article>
  );
}

export default BookingCard;
