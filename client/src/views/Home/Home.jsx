import { useEffect, useMemo, useState } from "react";
import "./Home.css";
import api from "../../api/client";
import { useToast } from "toast-ninja";
import Layout from "../../components/Layout/Layout";
import LinkCard, { copyToClipboard } from "../../components/LinkCard/LinkCard";
import Ninja from "../../components/Ninja/Ninja";

const HOW_IT_WORKS = [
  {
    emoji: "✂️",
    title: "Shorten your links",
    text: "Paste any long url, pick a custom slug if you like, and get a clean ninja-sized link.",
  },
  {
    emoji: "🥷",
    title: "Share them anywhere",
    text: "Drop your short link in chats, bios and posts — it silently does its job everywhere.",
  },
  {
    emoji: "📈",
    title: "Track every click",
    text: "Devices, browsers and day-by-day clicks land straight in your dashboard.",
  },
];

const SORTERS = {
  recent: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  clicks: (a, b) => b.clicks - a.clicks,
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
};

function Home() {
  const { showToast } = useToast();
  const [url, setUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const loadLinks = async () => {
    try {
      const response = await api.get("/fetch/links");
      setLinks(response?.data?.data || []);
    } catch {
      showToast({ message: "Could not load links", type: "error" });
    } finally {
      setLoadingLinks(false);
    }
  };

  useEffect(() => {
    loadLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleLinks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = links.filter(
      (link) =>
        !q ||
        link.slug.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q)
    );
    return [...filtered].sort(SORTERS[sortBy] || SORTERS.recent);
  }, [links, query, sortBy]);

  const generateLink = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      showToast({ message: "Please enter a url first", type: "warning" });
      return;
    }

    try {
      setCreating(true);
      const response = await api.post("/api/links", { url, slug });
      setShortUrl(response?.data?.data?.shortUrl);
      await loadLinks();
      showToast({ message: "Link created successfully!", type: "success" });
      setUrl("");
      setSlug("");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error creating link. Try again.";
      showToast({ message, type: "error" });
    } finally {
      setCreating(false);
    }
  };

  const deleteLink = async (slugToDelete) => {
    try {
      await api.delete(`/api/links/${slugToDelete}`);
      showToast({ message: "Link deleted successfully!", type: "success" });
    } catch {
      showToast({ message: "Error deleting link. Try again.", type: "error" });
    } finally {
      await loadLinks();
    }
  };

  const copyShortUrl = async () => {
    if (!shortUrl) return;
    const ok = await copyToClipboard(shortUrl);
    showToast(
      ok
        ? { message: "Your link copied successfully!", type: "success" }
        : { message: "Could not copy — copy manually", type: "error" }
    );
  };

  return (
    <Layout>
      {/* ---------- hero ---------- */}
      <section className="ql-hero">
        <div className="ql-hero-blob ql-hero-blob-1" />
        <div className="ql-hero-blob ql-hero-blob-2" />

        <div className="ql-container ql-hero-inner">
          <div className="ql-hero-mascot">
            <Ninja size={88} />
          </div>
          <h1 className="ql-hero-title">
            Quick links, <span className="ql-hero-pop">ninja fast</span>
          </h1>
          <p className="ql-hero-sub">
            Shorten, share and silently track every click — device, browser and
            daily stats included.
          </p>

          <form className="ql-hero-bar" onSubmit={generateLink}>
            <input
              className="ql-hero-input"
              placeholder="Paste a link to shorten it"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              aria-label="Destination url"
            />
            <button
              className="ql-btn ql-btn-primary ql-hero-btn"
              type="submit"
              disabled={creating}
            >
              {creating ? "..." : "Shorten"}
            </button>
          </form>

          <div className="ql-hero-slug">
            <label htmlFor="custom-slug">with custom slug?</label>
            <input
              id="custom-slug"
              className="ql-hero-slug-input"
              placeholder="my-link"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          {shortUrl && (
            <div className="ql-result" role="status">
              <a href={shortUrl} target="_blank" rel="noreferrer">
                {shortUrl.replace(/^https?:\/\//, "")}
              </a>
              <button
                className="ql-btn ql-btn-ghost ql-copy-btn"
                type="button"
                onClick={copyShortUrl}
              >
                Copy
              </button>
            </div>
          )}
        </div>

        <svg
          className="ql-hero-wave"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,20 C240,44 480,-4 720,20 C960,44 1200,-4 1440,20 L1440,40 L0,40 Z"
            fill="var(--page)"
          />
        </svg>
      </section>

      {/* ---------- your links ---------- */}
      <section className="ql-container ql-links-section">
        <div className="ql-links-toolbar">
          <div className="ql-links-head">
            <h2 className="ql-section-title">Your links</h2>
            <span className="ql-links-count">{links.length}</span>
          </div>

          {links.length > 0 && (
            <div className="ql-links-controls">
              <input
                className="ql-input ql-links-search"
                type="search"
                placeholder="Search links..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search links"
              />
              <select
                className="ql-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort links"
              >
                <option value="recent">Recent</option>
                <option value="clicks">Most clicked</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          )}
        </div>

        {loadingLinks ? (
          <div className="ql-links-grid">
            {[1, 2, 3].map((i) => (
              <div className="ql-skeleton ql-link-skeleton" key={i} />
            ))}
          </div>
        ) : links.length === 0 ? (
          <div className="ql-card ql-empty">
            <Ninja size={64} mood="eyes" />
            <p className="ql-empty-title">No links yet</p>
            <p className="ql-empty-sub">
              Create your first short link above and it will show up here.
            </p>
          </div>
        ) : visibleLinks.length === 0 ? (
          <div className="ql-card ql-empty">
            <p className="ql-empty-emoji">🔍</p>
            <p className="ql-empty-title">No matches</p>
            <p className="ql-empty-sub">
              No links match “{query}” — try a different search.
            </p>
          </div>
        ) : (
          <div className="ql-links-grid">
            {visibleLinks.map((link) => (
              <LinkCard
                key={link.slug}
                url={link.url}
                slug={link.slug}
                clicks={link.clicks}
                onDelete={deleteLink}
              />
            ))}
          </div>
        )}
      </section>

      {/* ---------- how it works ---------- */}
      <section className="ql-container ql-how">
        <h2 className="ql-section-title ql-how-title">How it works</h2>
        <div className="ql-how-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <div className="ql-how-card" key={step.title}>
              <div className="ql-how-rule" />
              <h3 className="ql-how-step">
                <span className="ql-how-num">{i + 1}</span>
                {step.title}
              </h3>
              <div className="ql-how-pic">
                <span>{step.emoji}</span>
              </div>
              <p className="ql-how-text">{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export default Home;
