import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import copyPng from "./images/copy.png";
import axios from "axios";

function Home() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  // generate link

  const generateLink = async () => {
    const response = await axios.post("/api/links", {
      url,
      slug,
    });

    setShortUrl(response?.data?.data?.shortUrl);
  };

  const urlRef = useRef(null); // create input ref

  const copyShortUrl = useCallback(() => {
    urlRef.current?.select(); // Select the text inside the input element
    window.navigator.clipboard.writeText(shortUrl);
  }, [shortUrl]);

  return (
    <>
      <div className="sticky-top">
        <Navbar />
      </div>
      <div className="d-flex flex-wrap mt-5 align-content-center justify-content-evenly">
        <div>
          <form className="form">
            <p className="form-title">Generate Short Url Here</p>
            <div className="input-container">
              <input
                placeholder="Enter url"
                type="text"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                }}
              />
            </div>
            <div className="input-container">
              <input
                placeholder="Enter short url (optional)"
                type="text"
                required
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                }}
              />
            </div>
            <div className="input-container">
              <input type="text" readOnly value={shortUrl} ref={urlRef} />
              <span>
                <img
                  src={copyPng}
                  alt="png"
                  className="h-25"
                  onClick={copyShortUrl}
                />
              </span>
            </div>
            <button className="submit" type="button" onClick={generateLink}>
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
