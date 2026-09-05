// Counting opens and sits, not people. GoatCounter: no cookies, no identifiers, numbers kept per day.
// Leave GOAT_CODE empty and nothing is loaded or sent at all.
export const GOAT_CODE = ""; // e.g. "shanzhongwa" for https://shanzhongwa.goatcounter.com

const queue = [];
let ready = false;

export function count(name) {
  if (!GOAT_CODE) return;
  try {
    if (ready && window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true });
    else queue.push(name);
  } catch (e) {}
}

export function startCounting() {
  if (!GOAT_CODE || typeof document === "undefined") return;
  try {
    // every open lands on one path, whether it came from /, /index.html or a home-screen icon
    window.goatcounter = { path: () => "/" };
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", `https://${GOAT_CODE}.goatcounter.com/count`);
    s.onload = () => { ready = true; while (queue.length) count(queue.shift()); };
    document.head.appendChild(s);
    const standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true;
    if (standalone) count("opened-from-home-screen");
    window.addEventListener("appinstalled", () => count("installed"));
  } catch (e) {}
}
