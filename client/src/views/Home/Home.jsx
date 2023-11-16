import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import copyPng from "./images/copy.png";

function Home() {
  return (
    <>
      <div className="sticky-top">
        <Navbar />
      </div>
      <div className="d-flex flex-wrap mt-5 align-content-center justify-content-evenly">
        <div>
          <form class="form">
            <p class="form-title">Generate Short Url Here</p>
            <div class="input-container">
              <input placeholder="Enter url" type="email" required />
            </div>
            <div class="input-container">
              <input placeholder="Enter short url or slug " type="text" />
            </div>
            <div class="input-container">
              <input placeholder="Enter short " type="text" readOnly />
              <span>
                <img src={copyPng} alt="png" className="h-25"/>
              </span>
            </div>
            <button class="submit" type="button">
              Do Magic
            </button>
          </form>
        </div>
        <div className="">
          <div className="card m-0 m-md-4" style={{ width: "22rem" }}>
            <div className="card-body"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
