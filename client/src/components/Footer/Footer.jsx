import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import git from "./../../views/Home/images/git.png";

function Footer() {
  return (
    <>
      <div className="w-100 mt-3 footer-container ">
        <div className="container">
          <div className="p-2">
            <div className="row">
              <div className="col-md-12">
                <div className="d-flex flex-column align-items-center  justify-content-evenly ">
                  <div className="d-flex justify-content-evenly fw-bold mt-3">
                    <p className="text-white">
                      Developed By © 2023 ||{" "}
                      <a
                        href="https://github.com/saurabhjaykar1603"
                        target="_blank"
                        className="text-decoration-none text-white "
                      >
                        Saurabh
                      </a>{" "}
                      <a
                        href="https://github.com/saurabhjaykar1603/quicklinks"
                        target="_blank"
                      >
                        <img src={git} alt="" style={{ width: "40px" }} />
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
