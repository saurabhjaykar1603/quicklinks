import React from "react";
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
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item me-5 fw-bold">
              <Link className="nav-link  text-light" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item me-5 fw-bold">
              <Link
                className="nav-link  text-light"
                aria-current="page"
                to="/about"
              >
                About
              </Link>
            </li>
            <li className="nav-item me-5 fw-bold">
              <Link
                className="nav-link  text-light"
                aria-current="page"
                to="/login"
              >
                Login
              </Link>
            </li>
            <li className="nav-item me-5 fw-bold">
              <Link className="nav-link text-light" to="/signup">
                Signup
              </Link>
            </li>
            <li className="nav-item fw-bold">
              <a className="nav-link text-light">User 👋</a>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-3"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
