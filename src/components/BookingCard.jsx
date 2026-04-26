import { getEntityId } from "../lib/utils";

const CATEGORY_ICONS = {
  AC: "❄️",
  CCTV: "📷",
  IT: "💻",
  Plumbing: "🔧",
  Electrical: "⚡",
  Other: "🏠",
};

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
  const counterparty = isProvider
    ? booking.customerId?.name
    : booking.providerId?.name;
  const draft = reviewDraft || { rating: "5", comment: "" };
  const category = booking.serviceId?.category || "Other";
  const icon = CATEGORY_ICONS[category] || "🏠";

  const statusClass = `status-${booking.status}`;

  return (
    <article className="booking-card">
      <div className="booking-icon">{icon}</div>

      <div className="booking-info">
        <h3>{booking.serviceId?.title || "Service"}</h3>
        <p className="booking-with">
          With <strong>{counterparty || "Unknown"}</strong>
        </p>
        <div className="booking-dates">
          <span>
            From{" "}
            <strong>{new Date(booking.fromDate).toLocaleDateString()}</strong>
          </span>
          <span>
            To <strong>{new Date(booking.toDate).toLocaleDateString()}</strong>
          </span>
        </div>

        <div className="booking-actions">
          {isProvider && onStatusUpdate && (
            <>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onStatusUpdate(booking._id, "approved")}
              >
                ✓ Approve
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onStatusUpdate(booking._id, "rejected")}
              >
                ✗ Reject
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onStatusUpdate(booking._id, "completed")}
              >
                Mark Complete
              </button>
            </>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onOpenChat(booking._id)}
          >
            💬 {isActiveChat ? "Refresh Chat" : "Chat"}
          </button>
        </div>

        {isCustomer && booking.status === "completed" && !booking._reviewed && (
          <form
            style={{
              marginTop: "14px",
              padding: "14px 16px",
              background: "rgba(0,48,73,0.04)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-md)",
            }}
            onSubmit={onReviewSubmit}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--deep-space-blue)",
                marginBottom: "10px",
              }}
            >
              Leave a Review
            </p>
            <div className="star-rating">
              {["1", "2", "3", "4", "5"].map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`star-btn ${parseInt(n) <= parseInt(draft.rating) ? "lit" : ""}`}
                  onClick={() => onReviewChange("rating", n)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="form-control"
              rows="2"
              style={{ fontSize: "13px", marginBottom: "10px" }}
              placeholder="Share your experience…"
              value={draft.comment}
              onChange={(e) => onReviewChange("comment", e.target.value)}
            />
            <button className="btn btn-primary btn-sm" type="submit">
              Submit Review
            </button>
          </form>
        )}
      </div>

      <div>
        <span className={`status-pill ${statusClass}`}>{booking.status}</span>
      </div>
    </article>
  );
}

export default BookingCard;
