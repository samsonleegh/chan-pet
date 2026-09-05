// Daily digest: records Netlify numbers into analytics/*.csv, then sends yesterday's
// visitors, icon opens, bowl opens and payments to Samson's Telegram. Reads tokens from
// the Netlify CLI login and from .env at the repo root; nothing is stored elsewhere.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE = "fea7acdc-e28c-42a3-99b8-d7ec146b20bc";
const DOG_SITE = "7c967476-21de-4434-98cf-ddcf58d13ccd"; // old dog address, still installed on some phones
const BOWL_LINKS = ["plink_1UBzE0IbnXrR97bjHkpioDAm", "plink_1UBz7AIbnXrR97bjfxexc8gO"];

const env = Object.fromEntries(fs.readFileSync(path.join(ROOT, ".env"), "utf8").split("\n").filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]));
const nlCfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), "Library/Preferences/netlify/config.json"), "utf8"));
const NL = nlCfg.users[nlCfg.userId].auth.token;
const STRIPE = env.STRIPE_SECRET_KEY;
const TG = env.TELEGRAM_BOT_TOKEN;
const CHATS = (env.TELEGRAM_ALLOWED_USER_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

async function nl(p, site = SITE) { const r = await fetch(`https://analytics.services.netlify.com/v2/${site}/${p}`, { headers: { Authorization: `Bearer ${NL}` } }); return r.json(); }
async function st(p) { const r = await fetch(`https://api.stripe.com/v1/${p}`, { headers: { Authorization: "Basic " + Buffer.from(STRIPE + ":").toString("base64") } }); return r.json(); }

// 1. record into the CSVs
try { execFileSync(process.execPath, [path.join(ROOT, "scripts/record-visitors.mjs")], { cwd: ROOT, stdio: "ignore" }); } catch (e) {}

// 2. yesterday = the last full UTC day, which is 8am to 8am Singapore time
const now = new Date();
const dayEnd = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
const dayStart = dayEnd - 86400000;
const q = `from=${dayStart}&to=${dayEnd - 1}&timezone=UTC&resolution=day`;
const sgDate = (ms) => new Date(ms).toLocaleDateString("en-SG", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Singapore" });

const [vis, pv, pages, countries, sources] = await Promise.all([
  nl(`visitors?${q}`), nl(`pageviews?${q}`), nl(`ranking/pages?${q}&limit=5`), nl(`ranking/countries?${q}&limit=3`), nl(`ranking/sources?${q}&limit=3`),
]);
const sum = (d) => (d.data || []).reduce((a, [, n]) => a + n, 0);
const visitors = sum(vis), loads = sum(pv);
const icon = (pages.data || []).find((r) => r.resource === "/index.html")?.count || 0;
const top = (d, key) => (d.data || []).map((r) => `${r[key] || "direct"} ${r.count}`).join(", ") || "none";

// the old dog address
let dogLine = "";
try {
  const [dv, dp] = await Promise.all([nl(`visitors?${q}`, DOG_SITE), nl(`ranking/pages?${q}&limit=5`, DOG_SITE)]);
  const dIcon = (dp.data || []).find((r) => r.resource === "/index.html")?.count || 0;
  if (!dv.code) dogLine = `Old dog address: ${sum(dv)} visitors · icon opens ${dIcon}`;
} catch (e) {}

// 3-day trend from the CSV
let trend = "";
try {
  const rows = fs.readFileSync(path.join(ROOT, "analytics/visitors.csv"), "utf8").trim().split("\n").slice(1).filter((l) => l.startsWith("shanzhongwa,")).slice(-4, -1);
  trend = rows.map((l) => l.split(",")[2]).join(" / ");
} catch (e) {}

// 3. the bowl: opens and payments, yesterday and all time
let opened = 0, paid = 0, paidSgd = 0, allOpened = 0, allPaid = 0, allSgd = 0;
for (const link of BOWL_LINKS) {
  let starting = "";
  for (let i = 0; i < 10; i++) {
    const page = await st(`checkout/sessions?payment_link=${link}&limit=100${starting}`);
    for (const s of page.data || []) {
      const t = s.created * 1000, isPaid = s.payment_status === "paid";
      allOpened++; if (isPaid) { allPaid++; allSgd += s.amount_total; }
      if (t >= dayStart && t < dayEnd) { opened++; if (isPaid) { paid++; paidSgd += s.amount_total; } }
    }
    if (!page.has_more) break; starting = `&starting_after=${page.data[page.data.length - 1].id}`;
  }
}
const sgd = (c) => `SGD ${(c / 100).toFixed(2)}`;

const text = [
  `山 · ${sgDate(dayStart)} 8am to ${sgDate(dayEnd)} 8am`,
  `Visitors ${visitors} · page loads ${loads} · icon opens ${icon}`,
  `Bowl: ${opened} opened, ${paid} paid (${sgd(paidSgd)})`,
  `All time: ${allOpened} opened, ${allPaid} paid, ${sgd(allSgd)}`,
  `From: ${top(countries, "resource")}`,
  `Referrers: ${top(sources, "resource")}`,
  dogLine,
  trend ? `Visitors, last 3 days: ${trend}` : "",
].filter(Boolean).join("\n");

console.log(text);
for (const chat of CHATS) {
  const r = await fetch(`https://api.telegram.org/bot${TG}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chat, text }) });
  const j = await r.json(); if (!j.ok) console.error("telegram:", j.description);
}
