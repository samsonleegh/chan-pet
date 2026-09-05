import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { startCounting } from "./count.js";

// Same storage shape the claude.ai artifact runtime provides, backed by localStorage.
window.storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    if (value === null) throw new Error("not found");
    return { key, value, shared: false };
  },
  async set(key, value) { localStorage.setItem(key, value); return { key, value, shared: false }; },
  async delete(key) { localStorage.removeItem(key); return { key, deleted: true, shared: false }; },
  async list() { return { keys: Object.keys(localStorage), shared: false }; },
};

// Only in the built app: in `npm run dev` the worker would serve stale pages from its cache.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("./sw.js").catch(() => {}); });
}

createRoot(document.getElementById("root")).render(<App />);
startCounting();
