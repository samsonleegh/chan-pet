// Pulls Netlify's server-side analytics (unique visitors, page loads, countries, referrers)
// for each site and upserts them into CSV files under analytics/. Netlify only keeps a few
// days, so run this daily and the CSVs become the long-term record. Uses the token the
// Netlify CLI stored at login; nothing is copied into the repo.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SITES = {
  shanzhongwa: "fea7acdc-e28c-42a3-99b8-d7ec146b20bc",
  yamamoinu: "7c967476-21de-4434-98cf-ddcf58d13ccd",
};
const DAYS_BACK = 3;
const OUT = path.resolve(process.cwd(), "analytics");

function token() {
  for (const p of [path.join(os.homedir(), "Library/Preferences/netlify/config.json"), path.join(os.homedir(), ".config/netlify/config.json")]) {
    if (fs.existsSync(p)) {
      const d = JSON.parse(fs.readFileSync(p, "utf8"));
      const t = d.users?.[d.userId]?.auth?.token;
      if (t) return t;
    }
  }
  throw new Error("No Netlify token found. Run `netlify login` first.");
}
const TOKEN = token();
const H = { Authorization: `Bearer ${TOKEN}` };
const day = (ms) => new Date(ms).toISOString().slice(0, 10); // UTC day, matching Netlify's buckets
const csvq = (s) => (/[",\n]/.test(String(s)) ? `"${String(s).replace(/"/g, '""')}"` : String(s));

async function get(url) {
  const r = await fetch(url, { headers: H });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${r.status} ${j.msg || j.message || ""}`.trim());
  return j;
}

// read a CSV into rows keyed by the first N columns, upsert, write back sorted
function upsert(file, header, keyLen, newRows) {
  const p = path.join(OUT, file);
  const rows = new Map();
  if (fs.existsSync(p)) {
    const lines = fs.readFileSync(p, "utf8").trim().split("\n").slice(1);
    for (const l of lines) if (l.trim()) rows.set(l.split(",").slice(0, keyLen).join(","), l);
  }
  for (const r of newRows) rows.set(r.slice(0, keyLen).join(","), r.map(csvq).join(","));
  const out = [header.join(","), ...[...rows.values()].sort()].join("\n") + "\n";
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(p, out);
  return rows.size;
}

const now = Date.now();
const from = now - DAYS_BACK * 86400000;
const stamp = new Date().toISOString().slice(0, 16).replace("T", " ") + "Z";
const daily = [], countries = [], sources = [];
const summary = [];

for (const [name, id] of Object.entries(SITES)) {
  const base = `https://analytics.services.netlify.com/v2/${id}`;
  const q = (f, t, extra = "") => `from=${f}&to=${t}&timezone=UTC&resolution=day${extra}`;
  let v, pv;
  try {
    v = await get(`${base}/visitors?${q(from, now)}`);
    pv = await get(`${base}/pageviews?${q(from, now)}`);
  } catch (e) {
    summary.push(`${name}: ${e.message}`);
    continue;
  }
  const pvBy = Object.fromEntries((pv.data || []).map(([t, n]) => [day(t), n]));
  for (const [t, n] of v.data || []) {
    const d = day(t);
    const partial = d === day(now) ? "partial" : "full";
    daily.push([name, d, n, pvBy[d] ?? "", partial, stamp]);
    summary.push(`${name} ${d}: ${n} visitors, ${pvBy[d] ?? "?"} loads${partial === "partial" ? " (today so far)" : ""}`);
    // per-day breakdowns
    const d0 = Date.parse(d + "T00:00:00Z"), d1 = d0 + 86400000 - 1;
    try {
      const c = await get(`${base}/ranking/countries?${q(d0, d1, "&limit=20")}`);
      for (const row of c.data || []) countries.push([name, d, row.resource || "?", row.country_name || "", row.count]);
      const s = await get(`${base}/ranking/sources?${q(d0, d1, "&limit=20")}`);
      for (const row of s.data || []) sources.push([name, d, row.resource || "(direct)", row.count]);
    } catch (e) { /* breakdowns are optional */ }
  }
}

upsert("visitors.csv", ["site", "day_utc", "unique_visitors", "page_loads", "day_status", "recorded_at"], 2, daily);
upsert("countries.csv", ["site", "day_utc", "country", "country_name", "page_loads"], 3, countries);
upsert("sources.csv", ["site", "day_utc", "referrer", "page_loads"], 3, sources);
console.log(summary.join("\n"));
console.log(`\nRecorded into ${OUT}/visitors.csv, countries.csv, sources.csv`);
