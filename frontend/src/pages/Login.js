import React, { useState } from "react";
import Toast from "../addons/Toast"; // Make sure this exists
import axios from "axios";
import { useHistory } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", {
        email,
        password,
      });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.access_token);
        history.push("/dashboard");
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      setErrorMsg("🚫 Invalid email or password");
      setShowToast(true);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary bg-opacity-10">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-primary mb-3">🔐 Welcome Back</h3>
        <p className="text-center text-muted mb-4">Login to your dashboard</p>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">📧 Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">🔑 Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <p className="mt-3 text-center text-muted">
          Don't have an account? <a href="/register" className="text-decoration-none">Register</a>
        </p>
      </div>

      <Toast
        message={errorMsg}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
