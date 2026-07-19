import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Dashboard.css";
import api from "../../api/client";
import { useToast } from "toast-ninja";
import Layout from "../../components/Layout/Layout";
import Ninja from "../../components/Ninja/Ninja";

const DEVICE_META = {
  desktop: { label: "Desktop", emoji: "🖥️", varName: "--series-1" },
  mobile: { label: "Mobile", emoji: "📱", varName: "--series-2" },
  tablet: { label: "Tablet", emoji: "📟", varName: "--series-3" },
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

function StatTile({ label, value, hint }) {
  return (
    <div className="ql-card ql-stat-tile">
      <p className="ql-stat-label">{label}</p>
      <p className="ql-stat-value">{value}</p>
      {hint && <p className="ql-stat-hint">{hint}</p>}
    </div>
  );
}

function ClicksChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const compact = data.length > 10;

  return (
    <div className={`ql-weekly ${compact ? "ql-weekly-compact" : ""}`}>
      {data.map((d, i) => {
        const day = new Date(`${d.date}T00:00:00`);
        const label = compact
          ? i % 5 === 0
            ? `${day.getDate()}/${day.getMonth() + 1}`
            : ""
          : DAY_LABELS[day.getDay()];
        return (
          <div className="ql-weekly-col" key={d.date}>
            <div className="ql-weekly-track">
              <div
                className="ql-weekly-bar"
                style={{ height: `${Math.max((d.count / max) * 100, 2)}%` }}
              >
                <span className="ql-weekly-tip">
                  {day.toLocaleDateString()} · {d.count}{" "}
                  {d.count === 1 ? "click" : "clicks"}
                </span>
              </div>
            </div>
            <span className="ql-weekly-day">{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DeviceBreakdown({ devices }) {
  const total = devices.reduce((sum, d) => sum + d.count, 0);

  if (total === 0) {
    return <p className="ql-dash-empty">No tracked clicks in this range.</p>;
  }

  return (
    <div className="ql-devices">
      {devices.map((d) => {
        const meta = DEVICE_META[d.device] || {
          label: d.device,
          emoji: "❓",
          varName: "--series-5",
        };
        const pct = Math.round((d.count / total) * 100);
        return (
          <div className="ql-device-row" key={d.device}>
            <span className="ql-device-label">
              {meta.emoji} {meta.label}
            </span>
            <div className="ql-device-track">
              <div
                className="ql-device-bar"
                style={{
                  width: `${pct}%`,
                  background: `var(${meta.varName})`,
                }}
              />
            </div>
            <span className="ql-device-value">
              {d.count} · {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="ql-stat-grid">
        {[1, 2, 3, 4].map((i) => (
          <div className="ql-skeleton ql-stat-skeleton" key={i} />
        ))}
      </div>
      <div className="ql-dash-grid">
        <div className="ql-skeleton ql-panel-skeleton" />
        <div className="ql-skeleton ql-panel-skeleton" />
      </div>
    </>
  );
}

function Dashboard() {
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const linkSlug = searchParams.get("link");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");
  const [tableQuery, setTableQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const endpoint = linkSlug
      ? `/api/stats/link/${linkSlug}?range=${range}`
      : `/api/stats/overview?range=${range}`;
    api
      .get(endpoint)
      .then((response) => {
        if (!cancelled) setStats(response?.data?.data);
      })
      .catch((error) => {
        if (!cancelled) {
          setStats(null);
          const message =
            error?.response?.data?.message || "Could not load stats";
          showToast({ message, type: "error" });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, linkSlug]);

  const filteredPerLink = useMemo(() => {
    if (!stats?.perLink) return [];
    const q = tableQuery.trim().toLowerCase();
    return stats.perLink.filter(
      (link) =>
        !q ||
        link.slug.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q)
    );
  }, [stats, tableQuery]);

  return (
    <Layout>
      <div className="ql-container ql-dash">
        <div className="ql-dash-head">
          <div>
            {linkSlug && (
              <Link className="ql-back-link" to="/dashboard">
                ← All links analytics
              </Link>
            )}
            <h1 className="ql-dash-title">
              {linkSlug ? `/${linkSlug}` : "Analytics"}
            </h1>
            <p className="ql-dash-sub">
              {linkSlug && stats?.link ? (
                <a
                  href={stats.link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ql-dash-dest"
                >
                  {stats.link.url}
                </a>
              ) : (
                "How your short links are performing — clicks, devices and browsers."
              )}
            </p>
          </div>

          <div
            className="ql-range-filter"
            role="group"
            aria-label="Analytics range"
          >
            {RANGES.map((r) => (
              <button
                key={r.value}
                className={`ql-range-btn ${range === r.value ? "active" : ""}`}
                onClick={() => setRange(r.value)}
                aria-pressed={range === r.value}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : !stats ? (
          <div className="ql-card ql-dash-error">
            <Ninja size={64} mood="eyes" />
            <p>Analytics could not be loaded. Please refresh.</p>
          </div>
        ) : (
          <>
            <div className="ql-stat-grid">
              {linkSlug ? (
                <>
                  <StatTile
                    label="Total clicks"
                    value={stats.totals.totalClicks}
                    hint="lifetime"
                  />
                  <StatTile
                    label="Tracked clicks"
                    value={stats.totals.totalTracked}
                    hint={RANGES.find(
                      (r) => r.value === range
                    )?.label.toLowerCase()}
                  />
                  <StatTile
                    label="Created"
                    value={new Date(
                      stats.link.createdAt
                    ).toLocaleDateString()}
                  />
                  <StatTile
                    label="Short link"
                    value={`/${stats.link.slug}`}
                    hint="share it anywhere"
                  />
                </>
              ) : (
                <>
                  <StatTile
                    label="Total links"
                    value={stats.totals.totalLinks}
                  />
                  <StatTile
                    label="Total clicks"
                    value={stats.totals.totalClicks}
                    hint="lifetime"
                  />
                  <StatTile
                    label="Tracked clicks"
                    value={stats.totals.totalTracked}
                    hint={RANGES.find(
                      (r) => r.value === range
                    )?.label.toLowerCase()}
                  />
                  <StatTile
                    label="Top link"
                    value={
                      stats.totals.topLink
                        ? `/${stats.totals.topLink.slug}`
                        : "—"
                    }
                    hint={
                      stats.totals.topLink
                        ? `${stats.totals.topLink.clicks} clicks`
                        : "no links yet"
                    }
                  />
                </>
              )}
            </div>

            <div className="ql-dash-grid">
              <div className="ql-card ql-dash-panel">
                <h2 className="ql-panel-title">
                  Clicks — last {range === "7d" ? 7 : 30} days
                </h2>
                <ClicksChart data={stats.clicksByDay} />
              </div>

              <div className="ql-card ql-dash-panel">
                <h2 className="ql-panel-title">Devices</h2>
                <DeviceBreakdown devices={stats.devices} />

                <h2 className="ql-panel-title ql-browsers-title">Browsers</h2>
                {stats.browsers.length === 0 ? (
                  <p className="ql-dash-empty">
                    No tracked clicks in this range.
                  </p>
                ) : (
                  <div className="ql-browser-chips">
                    {stats.browsers.map((b) => (
                      <span className="ql-browser-chip" key={b.browser}>
                        {b.browser}
                        <strong>{b.count}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {!linkSlug && (
            <div className="ql-card ql-dash-panel">
              <div className="ql-table-head">
                <h2 className="ql-panel-title">All links</h2>
                {stats.perLink.length > 0 && (
                  <input
                    className="ql-input ql-table-search"
                    type="search"
                    placeholder="Search links..."
                    value={tableQuery}
                    onChange={(e) => setTableQuery(e.target.value)}
                    aria-label="Search links table"
                  />
                )}
              </div>

              {stats.perLink.length === 0 ? (
                <div className="ql-dash-table-empty">
                  <Ninja size={56} mood="eyes" />
                  <p className="ql-dash-empty">
                    No links yet — create one from the Shorten page.
                  </p>
                </div>
              ) : filteredPerLink.length === 0 ? (
                <p className="ql-dash-empty">
                  No links match “{tableQuery}”.
                </p>
              ) : (
                <>
                  <div className="ql-table-wrap">
                    <table className="ql-table">
                      <thead>
                        <tr>
                          <th>Short link</th>
                          <th>Destination</th>
                          <th className="ql-th-num">Clicks</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPerLink.map((link) => (
                          <tr key={link.slug}>
                            <td className="ql-td-slug">/{link.slug}</td>
                            <td className="ql-td-url" title={link.url}>
                              {link.url}
                            </td>
                            <td className="ql-td-num">{link.clicks}</td>
                            <td className="ql-td-date">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* mobile: table becomes cards */}
                  <div className="ql-table-mobile">
                    {filteredPerLink.map((link) => (
                      <div className="ql-tm-card" key={link.slug}>
                        <div className="ql-tm-top">
                          <span className="ql-td-slug">/{link.slug}</span>
                          <span className="ql-tm-clicks">
                            {link.clicks}{" "}
                            {link.clicks === 1 ? "click" : "clicks"}
                          </span>
                        </div>
                        <p className="ql-tm-url" title={link.url}>
                          {link.url}
                        </p>
                        <p className="ql-tm-date">
                          Created{" "}
                          {new Date(link.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

export default Dashboard;
