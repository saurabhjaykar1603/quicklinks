import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      <div className="w-100 mt-5 footer-container ">
        <div className="container">
          <div className="p-5">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex flex-column align-items-center  justify-content-evenly ">
                  <div>
                    <Link
                      to="/"
                      className="text-white text-decoration-none fw-bold fs-4"
                    >
                      🔗 Quicklinks source code 👇🏻
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="fw-bold  text-center mt-2 ">
              <a
                href="https://github.com/saurabhjaykar1603/quicklinks "
                className=" fw-bold fs-5 text-decoration-none text-white"
                target="_blank"
              >
                https://github.com/saurabhjaykar1603/quicklinks
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
