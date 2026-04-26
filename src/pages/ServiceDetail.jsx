import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import api from "../services/api";

const CATEGORY_ICONS = {
  AC: "❄️",
  CCTV: "📷",
  IT: "💻",
  Plumbing: "🔧",
  Electrical: "⚡",
  Other: "🏠",
};
const CATEGORY_COLORS = {
  AC: "linear-gradient(135deg,#003049,#669bbc)",
  CCTV: "linear-gradient(135deg,#780000,#c1121f)",
  IT: "linear-gradient(135deg,#669bbc,#003049)",
  Plumbing: "linear-gradient(135deg,#003049,#003049cc)",
  Electrical: "linear-gradient(135deg,#780000,#003049)",
  Other: "linear-gradient(135deg,#003049,#669bbc)",
};

function ServiceDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingForm, setBookingForm] = useState({ fromDate: "", toDate: "" });
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    fetchService();
    fetchReviews();
  }, [id]);

  async function fetchService() {
    try {
      const res = await api.get(`/api/services/${id}`);
      setService(res.data);
    } catch {
      setError("Service not found.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchReviews() {
    try {
      const res = await api.get(`/api/reviews/service/${id}`);
      setReviews(res.data);
    } catch {
      /* silent */
    }
  }

  async function handleBook(e) {
    e.preventDefault();
    if (!user) {
      navigate("/sign-in");
      return;
    }
    setBookingLoading(true);
    setBookingError("");
    try {
      await api.post("/api/bookings", {
        serviceId: id,
        fromDate: bookingForm.fromDate,
        toDate: bookingForm.toDate,
      });
      setBookingSuccess(true);
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setBookingLoading(false);
    }
  }

  if (loading)
    return (
      <div
        style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}
      >
        Loading service…
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        <div className="form-error">{error}</div>
      </div>
    );

  const cat = service.category || "Other";
  const icon = CATEGORY_ICONS[cat] || "🏠";
  const bg = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
  const stars = Math.round(service.rating || 0);

  return (
    <div className="page-container">
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: "20px" }}
        onClick={() => navigate("/services")}
      >
        ← Back to services
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN */}
        <div>
          {/* Hero image */}
          <div
            style={{
              height: "260px",
              background: bg,
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "72px",
              marginBottom: "24px",
              position: "relative",
            }}
          >
            {icon}
            <span
              className="service-card-cat"
              style={{ position: "absolute", top: "16px", left: "16px" }}
            >
              {cat}
            </span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-brand)",
              fontSize: "28px",
              color: "var(--deep-space-blue)",
              marginBottom: "8px",
            }}
          >
            {service.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {service.rating > 0 && (
              <>
                <span className="stars">
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                </span>
                <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                  {service.rating} rating
                </span>
              </>
            )}
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              By{" "}
              <strong style={{ color: "var(--dark)" }}>
                {service.providerId?.name || "Unknown"}
              </strong>
            </span>
          </div>

          <p
            style={{
              color: "var(--muted)",
              fontSize: "15px",
              lineHeight: 1.7,
              marginBottom: "24px",
            }}
          >
            {service.description}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            <span className="chip">📍 Bahrain</span>
            <span
              className={`status-pill ${service.availability ? "status-approved" : "status-rejected"}`}
            >
              {service.availability ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Reviews */}
          <h3
            style={{
              fontFamily: "var(--font-brand)",
              fontSize: "18px",
              color: "var(--deep-space-blue)",
              marginBottom: "14px",
            }}
          >
            Reviews ({reviews.length})
          </h3>

          {reviews.length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>
              No reviews yet. Be the first to book!
            </p>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {reviews.map((r) => (
              <div
                key={r._id}
                style={{
                  background: "var(--white)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "16px 18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <strong style={{ fontSize: "14px" }}>
                    {r.userId?.name || "Customer"}
                  </strong>
                  <span className="stars">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                {r.comment && (
                  <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                    {r.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — sticky booking form */}
        <div>
          <div
            className="form-wrapper"
            style={{ position: "sticky", top: "80px" }}
          >
            <div
              style={{
                fontFamily: "var(--font-brand)",
                fontSize: "28px",
                color: "var(--deep-space-blue)",
                marginBottom: "4px",
              }}
            >
              {service.price} BHD{" "}
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--muted)",
                  fontFamily: "var(--font-body)",
                }}
              >
                / visit
              </span>
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                marginBottom: "22px",
              }}
            >
              Final price confirmed with provider
            </div>

            {!user && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p
                  style={{
                    color: "var(--muted)",
                    marginBottom: "12px",
                    fontSize: "14px",
                  }}
                >
                  Sign in to book this service
                </p>
                <Link to="/sign-in" className="btn btn-primary btn-full">
                  Sign In to Book
                </Link>
              </div>
            )}

            {user && user.role !== "customer" && (
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "13px",
                  textAlign: "center",
                  padding: "12px 0",
                }}
              >
                Only customers can book services.
              </p>
            )}

            {user && user.role === "customer" && !bookingSuccess && (
              <form onSubmit={handleBook}>
                <div className="form-group">
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingForm.fromDate}
                    onChange={(e) =>
                      setBookingForm({
                        ...bookingForm,
                        fromDate: e.target.value,
                      })
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookingForm.toDate}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, toDate: e.target.value })
                    }
                    required
                    min={
                      bookingForm.fromDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>
                {bookingError && (
                  <div className="form-error">{bookingError}</div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking…" : "Confirm Booking"}
                </button>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "12px",
                    color: "var(--muted)",
                    marginTop: "12px",
                  }}
                >
                  No payment until service is confirmed
                </p>
              </form>
            )}

            {bookingSuccess && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>✅</div>
                <p
                  style={{
                    fontFamily: "var(--font-brand)",
                    color: "var(--deep-space-blue)",
                    fontSize: "16px",
                  }}
                >
                  Booking request sent!
                </p>
                <p
                  style={{
                    color: "var(--muted)",
                    fontSize: "13px",
                    marginTop: "4px",
                  }}
                >
                  Redirecting to your bookings…
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
