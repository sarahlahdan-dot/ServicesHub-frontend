import { useState, useEffect } from "react";
import api from "../services/api";

function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get("/api/admin/stats"),
          api.get("/api/admin/users"),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch {
        setError(
          "Could not load admin data. Make sure you are logged in as admin.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div
        style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}
      >
        Loading admin panel…
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
      <div className="page-header">
        <span className="page-tag">Admin Only</span>
        <h1 className="page-title">Admin Panel</h1>
        <p className="page-subtitle">Platform overview and user management</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-row" style={{ marginBottom: "36px" }}>
          <div className="stat-card accent-dark">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.users}</div>
          </div>
          <div className="stat-card accent-blue">
            <div className="stat-label">Customers</div>
            <div className="stat-value">{stats.customers}</div>
          </div>
          <div className="stat-card accent-red">
            <div className="stat-label">Providers</div>
            <div className="stat-value">{stats.providers}</div>
          </div>
          <div className="stat-card accent-lava">
            <div className="stat-label">Admins</div>
            <div className="stat-value">{stats.admins}</div>
          </div>
          <div className="stat-card accent-blue">
            <div className="stat-label">Messages</div>
            <div className="stat-value">{stats.messages}</div>
          </div>
        </div>
      )}

      {/* User search */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-brand)",
            fontSize: "20px",
            color: "var(--deep-space-blue)",
          }}
        >
          All Users ({filteredUsers.length})
        </h2>
        <form
          className="search-bar"
          style={{ maxWidth: "300px", margin: 0 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setSearch("")}
            style={{ background: "var(--border)", color: "var(--muted)" }}
          >
            ✕
          </button>
        </form>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ background: "var(--deep-space-blue)" }}>
              {["Name", "Email", "Role", "Joined"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "13px 18px",
                    textAlign: "left",
                    fontWeight: 600,
                    color: "rgba(253,240,213,0.8)",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => {
              const pillClass =
                u.role === "admin"
                  ? "status-pending"
                  : u.role === "provider"
                    ? "status-approved"
                    : "status-completed";
              return (
                <tr
                  key={u._id}
                  style={{
                    background:
                      i % 2 === 0 ? "var(--white)" : "var(--off-white)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <td style={{ padding: "13px 18px", fontWeight: 500 }}>
                    {u.name}
                  </td>
                  <td style={{ padding: "13px 18px", color: "var(--muted)" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "13px 18px" }}>
                    <span
                      className={`status-pill ${pillClass}`}
                      style={{ textTransform: "none", fontSize: "11px" }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "13px 18px",
                      color: "var(--muted)",
                      fontSize: "13px",
                    }}
                  >
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No users found matching "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
