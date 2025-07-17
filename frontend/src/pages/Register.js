import React, { useState } from "react";
import Toast from "../addons/Toast";
import { useHistory } from "react-router-dom";

export default function Register() {
  const history = useHistory();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [toast, setToast] = useState({ show: false, message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        history.push("/dashboard");
      } else {
        showToast(data.error || "Registration failed");
      }
    } catch (error) {
      showToast("Server error. Please try again.");
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 5000);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary bg-opacity-10">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center text-primary mb-3">✨ Create Account</h3>
        <p className="text-center text-muted mb-4">Register to get started</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">👤 Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">🔑 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Register
          </button>
        </form>

        <p className="mt-3 text-center text-muted">
          Already have an account?{" "}
          <a href="/login" className="text-decoration-none">Login here</a>
        </p>
      </div>

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}
