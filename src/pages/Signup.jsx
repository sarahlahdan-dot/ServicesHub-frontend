import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../services/api";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const setRole = (role) => setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      await api.post("/api/auth/register", formData);
      navigate("/sign-in");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "An error occurred during sign up",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div className="form-wrapper animate-in">
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              fontFamily: "var(--font-brand)",
              fontSize: "22px",
              color: "var(--deep-space-blue)",
              marginBottom: "8px",
            }}
          >
            ServiceHub
          </div>
          <div className="form-title">Create account</div>
          <div className="form-subtitle">
            Join Bahrain's local services platform
          </div>
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I want to…</label>
            <div className="role-toggle">
              <div
                className={`role-option ${formData.role === "customer" ? "selected" : ""}`}
                onClick={() => setRole("customer")}
              >
                <span className="role-icon">🛒</span>
                <span className="role-label">Book Services</span>
                <span className="role-desc">I'm a customer</span>
              </div>
              <div
                className={`role-option ${formData.role === "provider" ? "selected" : ""}`}
                onClick={() => setRole("provider")}
              >
                <span className="role-icon">🔧</span>
                <span className="role-label">Offer Services</span>
                <span className="role-desc">I'm a provider</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="Ali Al-Mansoori"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: "8px" }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="form-link">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
