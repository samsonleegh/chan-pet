// Dev-only page for marketing screenshots: renders the real app with the clock frozen
// at a chosen hour, so morning / noon / dusk / night can be captured on one machine.
// Not part of the built app. Usage: /shots.html?phase=dusk&who=frog
const params = new URLSearchParams(location.search);
const HOURS = { morning: 8, noon: 13, evening: 17, dusk: 19, night: 22 };
const hour = HOURS[params.get("phase") || "dusk"] ?? 19;

// Freeze only the hour the app reads, so the palette and sun match the chosen time.
// Everything else (timestamps, React's scheduler) keeps real time.
const realGetHours = Date.prototype.getHours;
const realGetMinutes = Date.prototype.getMinutes;
Date.prototype.getHours = function () { return hour; };
Date.prototype.getMinutes = function () { return 12; };
const fixed = Date.now();

const who = params.get("who") || "frog";
const seed = Number(params.get("seed") || 4242);
const sits = Number(params.get("sits") || 9);

const [{ createRoot }, { Mountain }, frogMod, dogMod] = await Promise.all([
  import("react-dom/client"), import("./engine.jsx"), import("./companions/frog.jsx"), import("./companions/dog.jsx"),
]);
const companion = who === "dog" ? dogMod.default : frogMod.default;

window.storage = {
  async get(k) { const v = localStorage.getItem(k); if (v === null) throw new Error("not found"); return { key: k, value: v }; },
  async set(k, v) { localStorage.setItem(k, v); return { key: k, value: v }; },
  async delete(k) { localStorage.removeItem(k); return { key: k, deleted: true }; },
};
localStorage.setItem(companion.storageKey, JSON.stringify({
  frog: { status: "home", awayUntil: null, leftAt: null, justReturned: false },
  satchel: [{ id: "x", textId: params.get("line") || (who === "dog" ? "bs1" : "sz-12"), at: fixed }],
  sits: Array.from({ length: sits }, (_, i) => ({ at: fixed - i * 86400000, min: 15 })),
  teas: 0, seen: [], placeSeed: seed,
  placeDay: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`,
  lastSeen: fixed,
}));

createRoot(document.getElementById("root")).render(<Mountain companion={companion} bowl={null} onSwitch={null} />);
