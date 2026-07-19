import "./About.css";
import Layout from "../../components/Layout/Layout";

const FEATURES = [
  {
    emoji: "⚡",
    title: "Instant short links",
    text: "Paste any long url, pick a custom slug if you want, and share a clean short link in seconds.",
  },
  {
    emoji: "📊",
    title: "Click analytics",
    text: "Every click is tracked — see totals, day-by-day trends and your top performing links.",
  },
  {
    emoji: "📱",
    title: "Device & browser insights",
    text: "Know whether your audience opens links on desktop, mobile or tablet, and which browser they use.",
  },
  {
    emoji: "🔐",
    title: "Secure by default",
    text: "JWT access & refresh tokens in httpOnly cookies keep your account and links safe.",
  },
];

function About() {
  return (
    <Layout>
      <div className="ql-container ql-about">
        <div className="ql-about-head">
          <span className="ql-eyebrow">About</span>
          <h1 className="ql-about-title">
            Built for links that <span className="ql-hero-grad">work hard</span>
          </h1>
          <p className="ql-about-sub">
            QuickLinks is a modern url shortener with analytics baked in — made
            with the MERN stack and TypeScript.
          </p>
        </div>

        <div className="ql-about-grid">
          {FEATURES.map((f) => (
            <div className="ql-card ql-about-card" key={f.title}>
              <span className="ql-about-emoji">{f.emoji}</span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default About;
