import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "toast-ninja";
import "./LinkCard.css";

// dev: VITE_API_BASE_URL points at the api server; prod: same origin serves both
const API_BASE = import.meta.env.VITE_API_BASE_URL || window.location.origin;

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      return true;
    } catch {
      return false;
    }
  }
}

function LinkCard({ url, slug, clicks, onDelete }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  const shortUrl = `${API_BASE}/${slug}`;

  let domain = url;
  try {
    domain = new URL(url).hostname.replace("www.", "");
  } catch {
    /* keep raw url */
  }

  const handleCopy = async () => {
    const ok = await copyToClipboard(shortUrl);
    if (!ok) {
      showToast({ message: "Could not copy — copy manually", type: "error" });
      return;
    }
    setCopied(true);
    showToast({ message: "Short link copied!", type: "success" });
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1600);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this link?")) {
      onDelete && onDelete(slug); // parent handles the api call + toasts
    }
  };

  return (
    <div className="ql-link-card ql-card">
      <div className="ql-link-card-top">
        <div className="ql-link-favicon">
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt=""
            loading="lazy"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
        <div className="ql-link-card-titles">
          <p className="ql-link-slug">/{slug}</p>
          <a
            className="ql-link-original"
            href={url}
            target="_blank"
            rel="noreferrer"
            title={url}
          >
            {domain}
          </a>
        </div>
        <span className="ql-clicks-chip" title="Total clicks">
          {clicks} {clicks === 1 ? "click" : "clicks"}
        </span>
      </div>

      <div className="ql-link-card-bottom">
        <a
          className="ql-short-url"
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
        >
          {shortUrl.replace(/^https?:\/\//, "")}
        </a>
        <div className="ql-link-card-actions">
          <button
            className={`ql-icon-btn ql-card-btn ${copied ? "ql-card-btn-copied" : ""}`}
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy short link"}
            title={copied ? "Copied!" : "Copy"}
          >
            {copied ? (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
          <Link
            className="ql-icon-btn ql-card-btn"
            to={`/dashboard?link=${slug}`}
            aria-label={`View analytics for /${slug}`}
            title="Analytics"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="6" y1="20" x2="6" y2="14"></line>
              <line x1="12" y1="20" x2="12" y2="8"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
            </svg>
          </Link>
          <button
            className="ql-icon-btn ql-card-btn ql-card-btn-danger"
            onClick={handleDelete}
            aria-label="Delete link"
            title="Delete"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LinkCard;
