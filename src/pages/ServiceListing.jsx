import { useState, useEffect } from "react";
import { Link } from "react-router";
import api from "../services/api";

const CATEGORIES = [
  "All",
  "AC",
  "CCTV",
  "IT",
  "Plumbing",
  "Electrical",
  "Other",
];

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

function ServiceListing() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetchServices();
  }, [category]);

  async function fetchServices() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (search.trim()) params.search = search.trim();
      const res = await api.get("/api/services", { params });
      setServices(res.data);
    } catch {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchServices();
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <span className="page-tag">Bahrain</span>
        <h1 className="page-title">Browse Local Services</h1>
        <p className="page-subtitle">
          Find trusted providers for every home need
        </p>
      </div>

      {/* Search */}
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <svg
          width="16"
          height="16"
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
          placeholder="Search services, e.g. 'AC repair'…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Category chips */}
      <div className="category-strip">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${category === cat ? "active" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat !== "All" && <span>{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--muted)",
          }}
        >
          Loading services…
        </div>
      )}

      {error && <div className="form-error">{error}</div>}

      {!loading && services.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No services found</h3>
          <p>Try a different search term or category</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setCategory("All");
              setSearch("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      <div className="cards-grid">
        {services.map((service) => {
          const cat = service.category || "Other";
          const icon = CATEGORY_ICONS[cat] || "🏠";
          const bg = CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other;
          const stars = Math.round(service.rating || 0);

          return (
            <div className="service-card" key={service._id}>
              <div className="service-card-img" style={{ background: bg }}>
                <span>{icon}</span>
                <span className="service-card-cat">{cat}</span>
              </div>
              <div className="service-card-body">
                <div className="service-card-title">{service.title}</div>
                <div className="service-card-provider">
                  By <strong>{service.providerId?.name || "Unknown"}</strong>
                </div>
                {service.rating > 0 && (
                  <div className="service-card-rating">
                    <span className="stars">
                      {"★".repeat(stars)}
                      {"☆".repeat(5 - stars)}
                    </span>
                    {service.rating} rating
                  </div>
                )}
                <div className="service-card-footer">
                  <div className="service-price">
                    {service.price} <span>BHD</span>
                  </div>
                  <Link
                    to={`/services/${service._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    View &amp; Book
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceListing;
