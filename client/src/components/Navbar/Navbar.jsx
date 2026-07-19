import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useToast } from "toast-ninja";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import Ninja from "../Ninja/Ninja";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast({ message: "Logged out successfully!", type: "success" });
    navigate("/login");
  };

  return (
    <header className="ql-navbar">
      <div className="ql-container ql-navbar-inner">
        <Link className="ql-brand" to="/">
          <span className="ql-brand-mark">
            <Ninja size={30} mood="eyes" />
          </span>
          <span className="ql-brand-name">
            Quick<span className="ql-brand-accent">Links</span>
          </span>
        </Link>

        <nav className={`ql-nav ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" className="ql-nav-link" end>
            Shorten
          </NavLink>
          <NavLink to="/dashboard" className="ql-nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/about" className="ql-nav-link">
            About
          </NavLink>
        </nav>

        <div className="ql-nav-actions">
          <button
            className="ql-icon-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {user && (
            <>
              <span className="ql-user-chip" title={user.email}>
                <span className="ql-user-avatar">
                  {(user.fullName || user.username || "?")
                    .charAt(0)
                    .toUpperCase()}
                </span>
                <span className="ql-user-name">
                  {user.fullName || user.username}
                </span>
              </span>
              <button className="ql-btn ql-btn-ghost ql-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}

          <button
            className="ql-icon-btn ql-menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
