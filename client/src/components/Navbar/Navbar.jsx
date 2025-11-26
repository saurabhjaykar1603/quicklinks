import { Link } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <nav
      className="navbar navbar-expand-lg py-3 px-3 shadow sticky-top"
      style={{ 
        backgroundColor: darkMode ? "#0f172a" : "#4facfe",
        backgroundImage: darkMode 
          ? "linear-gradient(135deg, #0f172a, #1e293b)" 
          : "linear-gradient(135deg, #4facfe, #00f2fe)"
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fs-5 ms-3 text-light fw-bold" to="/">
          🔗 Quicklinks
        </Link>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-sm me-2"
            style={{ 
              backgroundColor: darkMode ? "#38bdf8" : "#0ea5e9", 
              color: "white",
              borderRadius: "20px",
              width: "40px",
              height: "40px"
            }}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            className="navbar-toggler bg-light"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon "></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
