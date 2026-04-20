import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function SignIn({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        formData,
      );
      const token = response.data.token;

      const userInfo = JSON.parse(atob(token.split(".")[1])).payload;
      setUser(userInfo);
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "An error occurred during sign in",
      );
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {errorMessage && (
        <p style={{ color: "red" }} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default SignIn;
