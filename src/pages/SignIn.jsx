import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../services/api";

function SignIn({ setUser }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await api.post("/api/auth/login", formData);
      const token = res.data.token;
      const userInfo = JSON.parse(atob(token.split(".")[1])).payload;
      setUser(userInfo);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "An error occurred during sign in",
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
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
          <div className="form-title">Welcome back</div>
          <div className="form-subtitle">Sign in to your account</div>
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
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
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="form-link">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
