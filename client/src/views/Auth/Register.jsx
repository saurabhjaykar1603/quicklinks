import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "toast-ninja";
import { useAuth } from "../../context/AuthContext";
import Ninja from "../../components/Ninja/Ninja";
import "./Auth.css";

function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
      showToast({ message: "Please fill all the fields", type: "warning" });
      return;
    }

    try {
      setSubmitting(true);
      await register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
      });
      showToast({ message: "Account created! Please login.", type: "success" });
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
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
        <p className="auth-title">Create your account</p>
        <p className="auth-subtitle">
          Short links with built-in click analytics
        </p>
        <div className="auth-input-container">
          <input
            placeholder="Full name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="auth-input-container">
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="auth-input-container">
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="auth-input-container">
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Register ✨"}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
