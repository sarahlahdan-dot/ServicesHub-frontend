import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../services/api";
import socket from "../services/socket";
import BookingCard from "../components/BookingCard";
import ChatWindow from "../components/ChatWindow";

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [reviewDrafts, setReviewDrafts] = useState({});
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchBookings();
    socket.connect();
    socket.emit("joinUserRoom", user.id);

    socket.on("booking:statusUpdate", ({ bookingId, status }) => {
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status } : b)),
      );
    });

    return () => {
      socket.off("booking:statusUpdate");
      if (activeChat) socket.emit("leaveRoom", activeChat);
      socket.disconnect();
    };
  }, [user.id]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await api.get("/api/bookings/mine");
      setBookings(res.data);
    } catch {
      setError("Could not load your bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenChat(bookingId) {
    if (activeChat && activeChat !== bookingId) {
      socket.emit("leaveRoom", activeChat);
      socket.off("message:new");
    }
    setActiveChat(bookingId);
    setChatMessages([]);
    try {
      const res = await api.get(`/api/bookings/${bookingId}/chat`);
      setChatMessages(res.data);
    } catch {
      /* silent */
    }
    socket.emit("joinRoom", bookingId);
    socket.on("message:new", (msg) =>
      setChatMessages((prev) => [...prev, msg]),
    );
  }

  async function handleSendMessage() {
    if (!chatInput.trim() || !activeChat) return;
    try {
      await api.post(`/api/bookings/${activeChat}/chat`, {
        message: chatInput.trim(),
      });
      setChatInput("");
    } catch {
      alert("Failed to send message.");
    }
  }

  function handleReviewChange(bookingId, field, value) {
    setReviewDrafts((prev) => ({
      ...prev,
      [bookingId]: {
        ...(prev[bookingId] || { rating: "5", comment: "" }),
        [field]: value,
      },
    }));
  }

  async function handleReviewSubmit(e, bookingId) {
    e.preventDefault();
    const draft = reviewDrafts[bookingId] || { rating: "5", comment: "" };
    try {
      await api.post(`/api/reviews/${bookingId}`, {
        rating: Number(draft.rating),
        comment: draft.comment,
      });
      alert("Review submitted! Thank you.");
      setReviewDrafts((prev) => ({ ...prev, [bookingId]: null }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  }

  const FILTERS = ["All", "pending", "approved", "completed", "rejected"];
  const filtered =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  // Find counterparty name for chat
  const activeChatBooking = bookings.find((b) => b._id === activeChat);
  const counterpartyName = activeChatBooking?.providerId?.name || "Provider";

  if (loading)
    return (
      <div
        style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}
      >
        Loading your bookings…
      </div>
    );
  if (error)
    return (
      <div style={{ padding: "60px" }}>
        <div className="form-error">{error}</div>
      </div>
    );

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <span className="page-tag">Customer</span>
          <h1 className="page-title">My Bookings</h1>
        </div>
        <Link to="/services" className="btn btn-primary btn-sm">
          + New Booking
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="page-tabs">
        {FILTERS.map((f) => (
          <div
            key={f}
            className={`page-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "All" && (
              <span
                style={{
                  marginLeft: "5px",
                  background: "var(--border)",
                  borderRadius: "10px",
                  padding: "0 6px",
                  fontSize: "11px",
                }}
              >
                {bookings.filter((b) => b.status === f).length}
              </span>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No bookings yet</h3>
          <p>Browse services and make your first booking today</p>
          <Link to="/services" className="btn btn-primary">
            Browse Services
          </Link>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filtered.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            currentUserId={user.id}
            isCustomer={true}
            onStatusUpdate={null}
            onOpenChat={handleOpenChat}
            isActiveChat={activeChat === booking._id}
            reviewDraft={reviewDrafts[booking._id]}
            onReviewChange={(field, value) =>
              handleReviewChange(booking._id, field, value)
            }
            onReviewSubmit={(e) => handleReviewSubmit(e, booking._id)}
          />
        ))}
      </div>

      {/* Chat panel */}
      {activeChat && (
        <ChatWindow
          counterpartyName={counterpartyName}
          messages={chatMessages}
          currentUserId={user.id}
          onClose={() => {
            socket.emit("leaveRoom", activeChat);
            setActiveChat(null);
          }}
          onSend={handleSendMessage}
          inputValue={chatInput}
          onInputChange={setChatInput}
        />
      )}
    </div>
  );
}

export default MyBookings;
