import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import copyPng from "./images/copy.png";
import axios from "axios";
import LinkCard from "../../components/LinkCard/LinkCard";
import Footer from "./../../components/Footer/Footer";
import showToast from "crunchy-toast";
function Home() {
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState([]);

  // generate link

  const generateLink = async () => {
    const response = await axios.post("/api/links", {
      url,
      slug,
    });
    console.log(response);
    if (!response) {
      return showToast(response?.data?.data.message);
    }
    setShortUrl(response?.data?.data?.shortUrl);
  };

  const urlRef = useRef(null); // create input ref

  const copyShortUrl = useCallback(() => {
    if (shortUrl) {
      urlRef.current?.select(); // Select the text inside the input element
      if (window.navigator.clipboard.writeText(shortUrl)) {
        showToast("Your Link coppied successfully ", "success", 6000);
      }
    }
  }, [shortUrl]);

  const loadLinks = async () => {
    const response = await axios.get("/fetch/links");

    console.log(response?.data?.data);
    setLinks(response?.data?.data);
  };

  useEffect(() => {
    loadLinks();
    showToast("all Links loaded", "success", 6000);
  }, []);

  return (
    <>
      <div className="sticky-top">
        <Navbar />
      </div>
      <div className="container mt-4">
        <h4 className="text-center fw-bold">
          QuickLinks 🔗 Instant Connections, Instant Impressions!
        </h4>
      </div>
      <div className="d-flex flex-wrap mt-5 align-content-center justify-content-evenly main-container">
        <div>
          <form className="form ">
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
                  className="copy-png"
                  onClick={copyShortUrl}
                />
              </span>
            </div>
            <button
              className="submit fw-bold "
              type="button"
              onClick={generateLink}
            >
              Do Magic 🔗
            </button>
          </form>
        </div>
        <div className=" all-links-container  rounded px-2">
          <div className="" style={{ width: "26rem" }}>
            <p></p>
            <div className="child">
              {links.map((link, i) => {
                const { url, slug, clicks } = link;
                return (
                  <LinkCard url={url} slug={slug} clicks={clicks} key={i} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Home;
