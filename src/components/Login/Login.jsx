import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");

    // Mock authentication
    if (email === "admin@test.com" && password === "123456") {
      console.log("Login successful:", { email });
      // Redirect to dashboard (ensure you have routing set up)
      navigate("/dashboard");
    } else {
      setError("Invalid credentials. Access denied.");
    }
  };

  return (
    <div className="login-container">
      {/* --- Left Side: Branding/Futuristic Visual Area --- */}
      <div className="login-sidebar">
        <div className="visual-content">
          {/* Subtle graphic element created in CSS */}
          <div className="futuristic-grid"></div>
          <h1>CORE PORTAL</h1>
          <p>Initialize secure session to access your neural workspace.</p>
        </div>
      </div>

      {/* --- Right Side: The Form Area --- */}
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

            <button type="submit" className="login-btn">
              Execute Login
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
