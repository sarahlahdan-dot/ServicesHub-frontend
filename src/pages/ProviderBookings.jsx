import { useState, useEffect } from "react";
import api from "../services/api";
import socket from "../services/socket";
import BookingCard from "../components/BookingCard";
import ChatWindow from "../components/ChatWindow";

function ProviderBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchBookings();
    socket.connect();
    socket.emit("joinUserRoom", user.id);

    return () => {
      if (activeChat) socket.emit("leaveRoom", activeChat);
      socket.off("message:new");
      socket.disconnect();
    };
  }, [user.id]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await api.get("/api/bookings/provider");
      setBookings(res.data);
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(bookingId, status) {
    try {
      const res = await api.patch(`/api/bookings/${bookingId}/status`, {
        status,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: res.data.status } : b,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
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

  const FILTERS = ["All", "pending", "approved", "completed", "rejected"];
  const filtered =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);
  const pending = bookings.filter((b) => b.status === "pending").length;

  const activeChatBooking = bookings.find((b) => b._id === activeChat);
  const counterpartyName = activeChatBooking?.customerId?.name || "Customer";

  if (loading)
    return (
      <div
        style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}
      >
        Loading bookings…
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
      <div style={{ marginBottom: "24px" }}>
        <span className="page-tag">Provider</span>
        <h1 className="page-title">
          Incoming Bookings
          {pending > 0 && (
            <span
              style={{
                marginLeft: "12px",
                background: "var(--brick-red)",
                color: "white",
                fontSize: "14px",
                padding: "3px 10px",
                borderRadius: "var(--radius-full)",
                fontFamily: "var(--font-body)",
                verticalAlign: "middle",
              }}
            >
              {pending} pending
            </span>
          )}
        </h1>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: "28px" }}>
        <div className="stat-card accent-lava">
          <div className="stat-label">Pending</div>
          <div className="stat-value">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
        </div>
        <div className="stat-card accent-blue">
          <div className="stat-label">Approved</div>
          <div className="stat-value">
            {bookings.filter((b) => b.status === "approved").length}
          </div>
        </div>
        <div className="stat-card accent-dark">
          <div className="stat-label">Completed</div>
          <div className="stat-value">
            {bookings.filter((b) => b.status === "completed").length}
          </div>
        </div>
        <div className="stat-card accent-red">
          <div className="stat-label">Total</div>
          <div className="stat-value">{bookings.length}</div>
        </div>
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
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No bookings here</h3>
          <p>When customers book your services, they'll appear here.</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filtered.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            currentUserId={user.id}
            isCustomer={false}
            onStatusUpdate={handleStatusUpdate}
            onOpenChat={handleOpenChat}
            isActiveChat={activeChat === booking._id}
            reviewDraft={null}
            onReviewChange={null}
            onReviewSubmit={null}
          />
        ))}
      </div>

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

export default ProviderBookings;
