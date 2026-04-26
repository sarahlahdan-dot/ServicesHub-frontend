import { useEffect } from "react";
import { Link } from "react-router";
import socket from "../services/socket";

function Dashboard({ user }) {
  useEffect(() => {
    socket.connect();
    socket.emit("joinUserRoom", user.id);

    socket.on("notification:new", (data) => {
      // Simple browser notification — teams can swap this for a toast library
      alert(`🔔 ${data.message}`);
    });

    return () => {
      socket.off("notification:new");
      socket.disconnect();
    };
  }, [user.id]);

  const isCustomer = user.role === "customer";
  const isProvider = user.role === "provider";
  const isAdmin = user.role === "admin";

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-tag">{user.role}</span>
        <h1 className="page-title">Welcome back, {user.name} 👋</h1>
        <p className="page-subtitle">{user.email}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "8px",
        }}
      >
        <Link to="/services" style={{ textDecoration: "none" }}>
          <div className="how-card" style={{ cursor: "pointer" }}>
            <div className="how-icon">🔍</div>
            <h3>Browse Services</h3>
            <p>Find and book local services in Bahrain</p>
          </div>
        </Link>

        {isCustomer && (
          <Link to="/my-bookings" style={{ textDecoration: "none" }}>
            <div className="how-card" style={{ cursor: "pointer" }}>
              <div className="how-icon">📋</div>
              <h3>My Bookings</h3>
              <p>Track your service appointments and chat with providers</p>
            </div>
          </Link>
        )}

        {isProvider && (
          <>
            <Link to="/provider/bookings" style={{ textDecoration: "none" }}>
              <div className="how-card" style={{ cursor: "pointer" }}>
                <div className="how-icon">📋</div>
                <h3>Manage Bookings</h3>
                <p>View and respond to incoming booking requests</p>
              </div>
            </Link>
            <Link to="/provider/services" style={{ textDecoration: "none" }}>
              <div className="how-card" style={{ cursor: "pointer" }}>
                <div className="how-icon">🔧</div>
                <h3>My Services</h3>
                <p>Create and manage your service listings</p>
              </div>
            </Link>
          </>
        )}

        {isAdmin && (
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <div className="how-card" style={{ cursor: "pointer" }}>
              <div className="how-icon">⚙️</div>
              <h3>Admin Panel</h3>
              <p>Platform stats and user management</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
