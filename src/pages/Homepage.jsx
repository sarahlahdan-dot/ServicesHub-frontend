import { Link } from "react-router";

const FEATURED = [
  {
    icon: "❄️",
    cat: "AC",
    title: "AC Deep Clean & Gas Refill",
    provider: "Ali Al-Mansoori",
    rating: "4.9",
    reviews: 83,
    price: 12,
    bg: "linear-gradient(135deg,#003049,#669bbc)",
  },
  {
    icon: "📷",
    cat: "CCTV",
    title: "CCTV Installation (4 Cameras)",
    provider: "TechVision Bahrain",
    rating: "4.8",
    reviews: 61,
    price: 45,
    bg: "linear-gradient(135deg,#780000,#c1121f)",
  },
  {
    icon: "🔧",
    cat: "Plumbing",
    title: "Emergency Leak Fix & Pipe Repair",
    provider: "ProPlumb Services",
    rating: "4.6",
    reviews: 45,
    price: 20,
    bg: "linear-gradient(135deg,#003049,#003049cc)",
  },
];

function Homepage() {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-tag animate-in">
            🇧🇭 Serving Bahrain, one home at a time
          </div>
          <h1 className="animate-in delay-1">
            Your <em>local services</em>,<br />
            at your fingertips.
          </h1>
          <p className="animate-in delay-2">
            Book trusted technicians for AC repair, CCTV installation, IT
            support, plumbing, and more — all from verified local providers in
            your area.
          </p>
          <div className="hero-actions animate-in delay-3">
            <Link to="/services" className="btn btn-primary btn-lg">
              Browse Services
            </Link>
            <Link
              to="/sign-up"
              className="btn btn-lg"
              style={{
                color: "var(--papaya-whip)",
                borderColor: "rgba(253,240,213,0.3)",
              }}
            >
              Become a Provider
            </Link>
          </div>
          <div className="hero-stats animate-in delay-3">
            <div className="hero-stat">
              <strong>1,200+</strong>
              <span>Verified Providers</span>
            </div>
            <div className="hero-stat">
              <strong>8,400+</strong>
              <span>Jobs Completed</span>
            </div>
            <div className="hero-stat">
              <strong>4.9★</strong>
              <span>Average Rating</span>
            </div>
            <div className="hero-stat">
              <strong>12+</strong>
              <span>Service Types</span>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="page-container">
        <div className="page-header">
          <span className="page-tag">Simple Process</span>
          <h2 className="page-title">How ServiceHub works</h2>
          <p className="page-subtitle">
            Getting a trusted local technician has never been easier.
          </p>
        </div>
        <div className="how-grid">
          {[
            {
              n: "01",
              icon: "🔍",
              title: "Browse & Search",
              desc: "Find services by category — AC, IT, CCTV, Plumbing, and more. Filter by area and rating.",
            },
            {
              n: "02",
              icon: "📅",
              title: "Book a Date",
              desc: "Pick your preferred dates, leave a note for the provider, and submit your booking instantly.",
            },
            {
              n: "03",
              icon: "💬",
              title: "Chat & Confirm",
              desc: "Message your provider directly. They'll confirm the appointment and keep you updated live.",
            },
            {
              n: "04",
              icon: "⭐",
              title: "Review & Done",
              desc: "Once the job's complete, leave a review to help the next customer make a great choice.",
            },
          ].map((step) => (
            <div className="how-card animate-in" key={step.n}>
              <span className="how-number">{step.n}</span>
              <div className="how-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED SERVICES */}
      <div
        style={{ background: "var(--deep-space-blue)", padding: "72px 32px" }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="page-header">
            <span className="page-tag" style={{ color: "var(--steel-blue)" }}>
              Popular Right Now
            </span>
            <h2 className="page-title" style={{ color: "var(--papaya-whip)" }}>
              Top services this week
            </h2>
          </div>
          <div className="cards-grid">
            {FEATURED.map((s) => (
              <div
                className="service-card"
                key={s.title}
                style={{ borderColor: "rgba(102,155,188,0.2)" }}
              >
                <div className="service-card-img" style={{ background: s.bg }}>
                  <span>{s.icon}</span>
                  <span className="service-card-cat">{s.cat}</span>
                </div>
                <div className="service-card-body">
                  <div className="service-card-title">{s.title}</div>
                  <div className="service-card-provider">
                    By <strong>{s.provider}</strong>
                  </div>
                  <div className="service-card-rating">
                    <span className="stars">
                      {"★".repeat(Math.round(s.rating))}
                      {"☆".repeat(5 - Math.round(s.rating))}
                    </span>
                    {s.rating} ({s.reviews} reviews)
                  </div>
                  <div className="service-card-footer">
                    <div className="service-price">
                      {s.price} <span>BHD / visit</span>
                    </div>
                    <Link to="/services" className="btn btn-primary btn-sm">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <Link
              to="/services"
              className="btn"
              style={{
                color: "var(--papaya-whip)",
                borderColor: "rgba(253,240,213,0.25)",
              }}
            >
              View all services →
            </Link>
          </div>
        </div>
      </div>

      {/* CATEGORIES STRIP */}
      <div className="page-container">
        <div className="page-header">
          <span className="page-tag">What We Cover</span>
          <h2 className="page-title">Services for every home need</h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {[
            { icon: "❄️", label: "AC Repair" },
            { icon: "📷", label: "CCTV" },
            { icon: "💻", label: "IT Support" },
            { icon: "🔧", label: "Plumbing" },
            { icon: "⚡", label: "Electrical" },
            { icon: "🏠", label: "Cleaning" },
            { icon: "🎨", label: "Painting" },
            { icon: "🔒", label: "Security" },
          ].map((c) => (
            <Link
              to="/services"
              key={c.label}
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "20px 16px",
                textAlign: "center",
                transition: "var(--transition)",
                textDecoration: "none",
                color: "var(--deep-space-blue)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--steel-blue)";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-md)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span style={{ fontSize: "28px" }}>{c.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: 600 }}>
                {c.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-brand">ServiceHub</div>
            <div className="footer-tagline">
              Connecting Bahrain's homeowners with trusted, local service
              professionals. Fast, reliable, and always nearby.
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/services">AC Repair</Link>
            <Link to="/services">CCTV Install</Link>
            <Link to="/services">IT Support</Link>
            <Link to="/services">Plumbing</Link>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/sign-up">For Providers</Link>
            <Link to="/sign-up">For Customers</Link>
            <Link to="/sign-in">Sign In</Link>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <a href="#">Help Centre</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 ServiceHub Bahrain. All rights reserved.</span>
          <span>Made with ❤️ in Bahrain 🇧🇭</span>
        </div>
      </footer>
    </>
  );
}

export default Homepage;
