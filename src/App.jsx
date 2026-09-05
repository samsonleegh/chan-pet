import { useState, useEffect } from "react";
import { Mountain } from "./engine.jsx";
import frog from "./companions/frog.jsx";
import dog from "./companions/dog.jsx";
import { BOWL_URL, bowlUrl } from "./bowl.js";
import { count } from "./count.js";

const COMPANIONS = { frog, dog };
const META_KEY = "chan-pet-meta";
const freshMeta = () => ({ companion: null, bowlSeen: false });

async function loadMeta() {
  try {
    const r = await window.storage.get(META_KEY, false);
    if (r && r.value) return { ...freshMeta(), ...JSON.parse(r.value) };
  } catch (e) {}
  // Someone who already sat with one of them before there was a choice: keep them where they were.
  const m = freshMeta();
  try {
    const had = async (k) => { try { const r = await window.storage.get(k, false); return !!(r && r.value); } catch (e) { return false; } };
    const hadFrog = await had(frog.storageKey);
    const hadDog = await had(dog.storageKey);
    if (hadFrog && !hadDog) m.companion = "frog";
    if (hadDog && !hadFrog) m.companion = "dog";
  } catch (e) {}
  return m;
}
async function saveMeta(m) {
  try { await window.storage.set(META_KEY, JSON.stringify(m), false); } catch (e) {}
}

function phaseNow() {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (h >= 6 && h < 10) return "morning";
  if (h >= 10 && h < 16) return "noon";
  if (h >= 16 && h < 18.5) return "evening";
  if (h >= 18.5 && h < 19.5) return "dusk";
  return "night";
}

// A small rock with the companion on it, for choosing.
function Portrait({ companion, phase, reduced }) {
  const P = companion.palettes[phase];
  const Creature = companion.Creature;
  return (
    <svg viewBox="-44 -40 88 62" width="96" height="68" aria-hidden="true" style={{ display: "block" }}>
      <ellipse cx="0" cy="14" rx="36" ry="9" fill={P.paperDeep} stroke={P.ink} strokeWidth="1" />
      <Creature P={P} eyesClosed={false} reduced={reduced} />
    </svg>
  );
}

function Chooser({ phase, onPick }) {
  const P = frog.palettes[phase];
  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const card = {
    display: "flex", alignItems: "center", gap: 18, width: "100%", textAlign: "left",
    fontFamily: frog.font, background: "transparent", color: P.ink, border: `1px solid ${P.mist}`,
    borderRadius: 2, padding: "14px 16px", cursor: "pointer", marginBottom: 12,
  };
  return (
    <div style={{ background: P.paper, minHeight: "100vh", fontFamily: frog.font, color: P.ink }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "18px 20px 48px" }}>
        <h1 style={{ margin: "0 0 4px", fontWeight: 400, fontSize: 22, letterSpacing: 0.5 }}>山</h1>
        <p style={{ margin: "0 0 26px", color: P.inkSoft, fontSize: 14 }}>{P.name}</p>
        <p style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 18px", color: P.inkSoft }}>Who will you sit with?</p>
        {[frog, dog].map((c) => (
          <button key={c.id} style={card} onClick={() => onPick(c.id)}>
            <Portrait companion={c} phase={phase} reduced={reduced} />
            <span>
              <span style={{ display: "block", fontSize: 18, fontFamily: c.font }}>{c.title}</span>
              <span style={{ display: "block", fontSize: 14, color: P.inkSoft, marginTop: 2 }}>{c.blurb}</span>
            </span>
          </button>
        ))}
        <p style={{ fontSize: 13, lineHeight: 1.6, margin: "18px 0 0", color: P.inkSoft }}>You can change your mind later, under About.</p>
      </div>
    </div>
  );
}

export default function App() {
  const [meta, setMeta] = useState(null);
  const [phase, setPhase] = useState(phaseNow());

  useEffect(() => { loadMeta().then(setMeta); }, []);
  useEffect(() => { try { document.title = meta && COMPANIONS[meta.companion] ? COMPANIONS[meta.companion].title : "山"; } catch (e) {} }, [meta]);
  useEffect(() => {
    const id = setInterval(() => setPhase(phaseNow()), 60000);
    return () => clearInterval(id);
  }, []);

  function update(fn) {
    setMeta((m) => { const n = fn(m); saveMeta(n); return n; });
  }

  if (!meta) return <div style={{ background: frog.palettes[phase].paper, minHeight: "100vh" }} />;
  const companion = COMPANIONS[meta.companion];
  if (!companion) return <Chooser phase={phase} onPick={(id) => { count(`chose-${id}`); update((m) => ({ ...m, companion: id })); }} />;

  const bowl = BOWL_URL
    ? { url: bowlUrl, seen: !!meta.bowlSeen, markSeen: () => update((m) => ({ ...m, bowlSeen: true })) }
    : null;

  return (
    <Mountain
      key={companion.id}
      companion={companion}
      bowl={bowl}
      onSwitch={() => update((m) => ({ ...m, companion: companion.other.name }))}
    />
  );
}
