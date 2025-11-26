import { useCallback, useEffect, useRef, useState } from "react";
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
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference in localStorage
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Apply dark mode class to body when darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // generate link

  const generateLink = async () => {
    try {
      const response = await axios.post("/api/links", {
        url,
        slug,
      });

      setShortUrl(response?.data?.data?.shortUrl);

      // Refresh the links list after creating a new one
      await loadLinks();

      // Show success message
      showToast("Link created successfully!", "success", 3000);

      // Optionally clear the form
      setUrl("");
      setSlug("");
    } catch (error) {
      console.error("Error creating link:", error);
      showToast("Error creating link. Please try again.", "error", 3000);
    }
  };

  // delete link
  const deleteLink = async (slugToDelete) => {
    try {
      await axios.delete(`/api/links/${slugToDelete}`);
      // Refresh the links list after deletion
      showToast("Link deleted successfully!", "success", 3000);
    } catch (error) {
      console.error("Error deleting link:", error);
      showToast("Error deleting link. Please try again.", "error", 3000);
    } finally {
      await loadLinks();
    }
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
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <div className="container mt-4">
        <h4 className="text-center fw-bold">
          QuickLinks 🔗 Instant Connections, Instant Impressions!
        </h4>
      </div>
      <div className="main-container">
        <div>
          <form className="form">
            <p className="">Generate Short Url Here</p>
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
                  alt="Copy URL"
                  className="copy-png"
                  onClick={copyShortUrl}
                />
              </span>
            </div>
            <button
              className="submit fw-bold"
              type="button"
              onClick={generateLink}
            >
              Do Magic 🔗
            </button>
          </form>
        </div>
        <div className="all-links-container rounded">
          <div className="links-grid">
            {links.map((link, i) => {
              const { url, slug, clicks } = link;
              return (
                <LinkCard
                  url={url}
                  slug={slug}
                  clicks={clicks}
                  key={`${slug}-${i}`}
                  onDelete={deleteLink}
                />
              );
            })}
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
