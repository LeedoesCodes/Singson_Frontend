import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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

        if (user.role === "admin") {
          navigate("/dashboard");
        } else if (user.role === "cashier") {
          navigate("/orders");
        } else if (user.role === "customer") {
          navigate("/menu");
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
    <div className="flex flex-col md:flex-row min-h-screen w-full relative">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <div className="w-full md:w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 flex justify-center items-center p-8 md:p-12">
        <div className="text-center max-w-md text-white">
          <div className="text-7xl mb-4">🥘</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CANTEEN SYSTEM
          </h1>
          <p className="text-lg text-orange-100">Sign in to your account</p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 p-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-center p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
