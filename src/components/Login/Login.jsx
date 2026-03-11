import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await loginUser(email, password);

      if (result.ok) {
        const token = result.data.token;
        const user = result.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Login successful:", result.data);

        if (user.role === "admin") {
          navigate("/dashboard");
        } else if (user.role === "cashier") {
          navigate("/orders");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(result.data.message || "Invalid credentials. Access denied.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className="visual-content">
          <div className="futuristic-grid"></div>
          <h1>CORE PORTAL</h1>
          <p>Initialize secure session to access your neural workspace.</p>
        </div>
      </div>

      <div className="login-form-wrapper">
        <div className="login-card">
          <h2>Authentication</h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Identity (Email)</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Access Key</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Execute Login"}
            </button>
          </form>

          <div className="card-footer">
            <a href="#forgot">Forgot Access Key?</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
