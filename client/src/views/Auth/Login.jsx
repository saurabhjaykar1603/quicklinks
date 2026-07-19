import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "toast-ninja";
import { useAuth } from "../../context/AuthContext";
import Ninja from "../../components/Ninja/Ninja";
import "./Auth.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier.trim() || !password) {
      showToast({ message: "Please fill all the fields", type: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      await login(identifier.trim(), password);
      showToast({ message: "Logged in successfully!", type: "success" });
      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed. Please try again.";
      showToast({ message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <Ninja size={64} /> QuickLinks
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="auth-title">Welcome back</p>
        <p className="auth-subtitle">
          Login to manage your links and analytics
        </p>
        <div className="auth-input-container">
          <input
            placeholder="Username or email"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="auth-input-container">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login 🔐"}
        </button>
        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
