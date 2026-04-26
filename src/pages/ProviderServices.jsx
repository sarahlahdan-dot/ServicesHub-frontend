import { useState, useEffect } from "react";
import api from "../services/api";

const CATEGORIES = ["AC", "CCTV", "IT", "Plumbing", "Electrical", "Other"];
const CATEGORY_ICONS = {
  AC: "❄️",
  CCTV: "📷",
  IT: "💻",
  Plumbing: "🔧",
  Electrical: "⚡",
  Other: "🏠",
};

function ProviderServices({ user }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "AC",
    price: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMyServices();
  }, []);

  async function fetchMyServices() {
    setLoading(true);
    try {
      const res = await api.get("/api/services");
      const mine = res.data.filter(
        (s) => String(s.providerId?._id || s.providerId) === String(user.id),
      );
      setServices(mine);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await api.post("/api/services", {
        ...formData,
        price: Number(formData.price),
      });
      setFormData({ title: "", description: "", category: "AC", price: "" });
      setShowForm(false);
      fetchMyServices();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create service.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(serviceId) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    try {
      await api.delete(`/api/services/${serviceId}`);
      setServices((prev) => prev.filter((s) => s._id !== serviceId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete service.");
    }
  }

  return (
    <div className="page-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <span className="page-tag">Provider</span>
          <h1 className="page-title">My Services</h1>
          <p className="page-subtitle">
            {services.length} listing{services.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Cancel" : "+ Add Service"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div
          className="form-wrapper"
          style={{ maxWidth: "560px", marginBottom: "32px" }}
        >
          <div
            className="form-title"
            style={{ fontSize: "20px", marginBottom: "4px" }}
          >
            New Service Listing
          </div>
          <div className="form-subtitle">
            Fill in the details below to publish a new service
          </div>

          {formError && <div className="form-error">{formError}</div>}

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Service Title</label>
              <input
                className="form-control"
                placeholder="e.g. AC Deep Clean & Gas Refill"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Describe what's included in this service…"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (BHD)</label>
                <input
                  className="form-control"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 12"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={formLoading}
            >
              {formLoading ? "Creating…" : "Publish Service"}
            </button>
          </form>
        </div>
      )}

      {/* Services list */}
      {loading && (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "var(--muted)",
          }}
        >
          Loading your services…
        </div>
      )}

      {!loading && services.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔧</div>
          <h3>No services yet</h3>
          <p>Create your first service listing to start receiving bookings</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Your First Service
          </button>
        </div>
      )}

      <div className="cards-grid">
        {services.map((s) => {
          const icon = CATEGORY_ICONS[s.category] || "🏠";
          return (
            <div className="service-card" key={s._id}>
              <div
                className="service-card-img"
                style={{
                  background:
                    "linear-gradient(135deg,var(--deep-space-blue),var(--steel-blue))",
                }}
              >
                <span>{icon}</span>
                <span className="service-card-cat">{s.category}</span>
              </div>
              <div className="service-card-body">
                <div className="service-card-title">{s.title}</div>
                <div
                  className="service-card-provider"
                  style={{ marginBottom: "8px", lineHeight: 1.5 }}
                >
                  {s.description}
                </div>
                <div className="service-card-footer">
                  <div className="service-price">
                    {s.price} <span>BHD</span>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProviderServices;
