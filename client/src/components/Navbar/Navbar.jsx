import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg py-3 px-3  shadow sticky-top"
      style={{ backgroundColor: "#404040" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fs-5 ms-3 text-light fw-bold" to="/">
          🔗 Quicklinks
        </Link>
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
    </nav>
  );
}

export default Navbar;
