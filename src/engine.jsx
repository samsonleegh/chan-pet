import { useState, useEffect, useRef } from "react";
import { count, GOAT_CODE } from "./count.js";

// The shared mountain. A companion (frog, dog, ...) brings its own drawing, lines, texts, palette and font.
const HOUR = 3600 * 1000;
export const BOWL_AFTER_SITS = 7; // one full cairn

function phaseFor(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 6 && h < 10) return "morning";
  if (h >= 10 && h < 16) return "noon";
  if (h >= 16 && h < 18.5) return "evening";
  if (h >= 18.5 && h < 19.5) return "dusk";
  return "night";
}
// A small seeded random, so a place looks the same each time you come back to it.
function rng(seed) {
  let q = (seed >>> 0) || 1;
  return () => { q = (q * 1664525 + 1013904223) >>> 0; return q / 4294967296; };
}
// One place in the mountains, drawn from a seed.
export function placeFor(seed) {
  const r = rng(seed);
  return {
    mountains: Math.floor(r() * 3),           // tall / rolling / jagged
    house: r() < 0.45,
    stream: r() < 0.4,
    field: r() < 0.4,
    tree: r() < 0.25 ? "none" : r() < 0.5 ? "left" : "right",
    mistLift: Math.floor(r() * 12),
    kind: r() < 0.18 ? "onsen" : "mountain",
  };
}
// Weather drifts every three hours, on its own.
function weatherFor(now = Date.now()) {
  const r = rng(Math.floor(now / (3 * HOUR)) * 7919 + 13);
  const x = r();
  if (x < 0.45) return "clear";
  if (x < 0.65) return "rain";
  if (x < 0.85) return "wind";
  return "leaves";
}
// What the mountain says when nothing in particular is happening.

function chooseLine(LINES, seed, phase, weather, place) {
  const r = rng(seed * 31 + 7);
  if (phase === "tea") { const t = LINES.tea; return t[Math.floor(r() * t.length)]; }
  const pools = [LINES.any, LINES.any, LINES[phase] || []];
  if (weather !== "clear" && LINES[weather]) pools.push(LINES[weather]);
  if (place.house) pools.push(LINES.house);
  if (place.stream) pools.push(LINES.stream);
  if (place.field) pools.push(LINES.field);
  if (place.kind === "onsen") { pools.push(LINES.onsen); pools.push(LINES.onsen); }
  const pool = pools[Math.floor(r() * pools.length)];
  return pool.length ? pool[Math.floor(r() * pool.length)] : "";
}
// "the frog" -> "The frog"; "Pantha Bak" stays as it is.
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function todayKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
// Where the sun sits: rises at 6 on the left, sets at 19.5 on the right, arcing over the peaks.
export function sunPos(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  const t = (h - 6) / 13.5;
  if (t < 0 || t > 1) return null;
  return { x: 30 + t * 300, y: 120 - Math.sin(t * Math.PI) * 96, t };
}

const fresh = () => ({
  frog: { status: "home", awayUntil: null, leftAt: null, justReturned: false },
  satchel: [],
  sits: [],
  teas: 0,
  seen: [],
  placeSeed: Math.floor(Math.random() * 1e9),
  placeDay: todayKey(),
  lastSeen: 0,
});

// Half the draws come from the classical lines, half from your collection,
// so neither drowns the other however many you add. Unseen lines first.
function pickLine(companion, seenIds) {
  const { classical: CLASSICAL, modernFilled: MODERN_FILLED } = companion;
  const seen = new Set(seenIds || []);
  const side = MODERN_FILLED.length && Math.random() < 0.5 ? MODERN_FILLED : CLASSICAL;
  const pool = side.filter((t) => !seen.has(t.id));
  const from = pool.length ? pool : side;
  return from[Math.floor(Math.random() * from.length)].id;
}

function ago(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 2) return "just now";
  if (m < 60) return `${m} minutes ago`;
  const h = Math.round(m / 60);
  if (h < 24) return h === 1 ? "an hour ago" : `${h} hours ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

function dateShort(ts) {
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

// ---------- Temple bell, synthesised, with the valley behind it ----------
let audioCtx = null;
let space = null;
function ctx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
// The valley: a near slope and a far one, low-passed, quiet but clearly there.
function mountain() {
  const ac = ctx();
  if (space) return space;
  const input = ac.createGain();
  const dry = ac.createGain(); dry.gain.value = 0.92;
  const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1100;
  const wet = ac.createGain(); wet.gain.value = 0.12;
  const d1 = ac.createDelay(3); d1.delayTime.value = 0.46;
  const f1 = ac.createGain(); f1.gain.value = 0.2;
  input.connect(dry).connect(ac.destination);
  input.connect(lp); lp.connect(d1); d1.connect(f1); f1.connect(lp); d1.connect(wet);
  wet.connect(ac.destination);
  space = input;
  return space;
}
// One strike of a temple bell: a slow soft attack, a warm fundamental,
// a couple of quiet upper partials, and a long, even decay.
function strike(t, base = 440, loud = 0.28, tail = 16) {
  const ac = ctx();
  const out = ac.createGain();
  out.gain.value = loud;
  out.connect(mountain());
  const partials = [[1.0, 1.0, tail, false], [2.0, 0.3, tail * 0.7, false], [2.42, 0.12, tail * 0.5, false], [3.0, 0.06, tail * 0.4, false]];
  partials.forEach(([ratio, amp, dur, twin]) => {
    const voices = twin ? [[0, amp], [0.002, amp * 0.5]] : [[0, amp]];
    voices.forEach(([det, a]) => {
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = "sine";
      o.frequency.value = base * ratio * (1 + det);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(a, t + 0.04);
      g.gain.exponentialRampToValueAtTime(a * 0.4, t + dur * 0.2);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + dur + 0.2);
    });
  });
  // the log meeting the bronze: a soft low thump, no click
  const th = ac.createOscillator();
  const tg = ac.createGain();
  th.type = "sine";
  th.frequency.setValueAtTime(base * 0.5, t);
  th.frequency.exponentialRampToValueAtTime(base * 0.25, t + 0.12);
  tg.gain.setValueAtTime(0.0001, t);
  tg.gain.exponentialRampToValueAtTime(0.35, t + 0.02);
  tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  th.connect(tg).connect(out);
  th.start(t);
  th.stop(t + 0.2);
}
function bellsToBegin() {
  try {
    const t0 = ctx().currentTime + 0.05;
    strike(t0, 440, 0.28, 16);
    strike(t0 + 5.0, 440, 0.28, 16);
    strike(t0 + 10.0, 440, 0.3, 22);
  } catch (e) {}
}
function bellsToEnd() {
  try {
    const t0 = ctx().currentTime + 0.05;
    strike(t0, 392, 0.28, 16);
    strike(t0 + 5.0, 392, 0.28, 16);
    strike(t0 + 10.0, 392, 0.3, 24);
  } catch (e) {}
}

// ---------- Scene ----------
const MOUNTAINS = [
  // tall
  ["M0 150 L60 80 L95 120 L140 40 L190 110 L230 70 L290 130 L330 95 L360 140 L360 260 L0 260 Z",
   "M0 175 L45 130 L90 160 L130 105 L175 165 L215 135 L260 175 L300 150 L360 190 L360 260 L0 260 Z"],
  // rolling
  ["M0 160 Q60 110 120 140 Q180 100 240 130 Q300 96 360 140 L360 260 L0 260 Z",
   "M0 190 Q70 150 140 176 Q210 140 280 172 Q330 150 360 178 L360 260 L0 260 Z"],
  // jagged
  ["M0 170 L28 120 L44 140 L70 60 L96 130 L118 92 L150 150 L176 50 L200 120 L236 84 L262 140 L290 70 L318 130 L340 100 L360 150 L360 260 L0 260 Z",
   "M0 196 L30 160 L58 186 L90 140 L120 180 L160 150 L200 190 L236 156 L270 186 L300 160 L330 188 L360 170 L360 260 L0 260 Z"],
];

// One stone per sit. Seven stones make a cairn. The cairn you're building stands by the rock;
// the last few you finished stand behind it, smaller and further back, until the mist takes them.
const STONES_PER_CAIRN = 7;
function Cairn({ P, stones, x, y, scale = 1, seed = 1, opacity = 1 }) {
  const r = rng(seed * 101 + 3);
  const rows = [];
  for (let i = 0; i < stones; i++) {
    const rx = 6.5 - i * 0.65;
    const ry = 2.4;
    const dx = (r() - 0.5) * 2.2;
    rows.push(<ellipse key={i} cx={dx} cy={-i * 4.1 - ry} rx={rx} ry={ry} fill={P.paperDeep} stroke={P.ink} strokeWidth="0.8" />);
  }
  return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>{rows}</g>;
}

export function Scene({ companion, P, eyesClosed, tea, tilt = 0, reduced, sun, place, weather, sits = 0 }) {
  const Creature = companion.Creature;
  const pouring = tilt > 0.5;
  const done = Math.floor(sits / STONES_PER_CAIRN);
  const building = sits % STONES_PER_CAIRN;
  const shown = Math.min(done, 4);
  const stars = [];
  if (P.stars) {
    const r = rng(11);
    for (let i = 0; i < 48; i++) stars.push({ x: r() * 360, y: r() * 110, o: 0.3 + r() * 0.6, rr: 0.5 + r() * 1.0, dur: 1.8 + r() * 4, twinkle: true, dip: 0.05 + r() * 0.25 });
  }
  const [farPath, nearPath] = MOUNTAINS[place.mountains];
  const wr = rng(97);
  const drops = [], wisps = [], leaves = [];
  if (weather === "rain") for (let i = 0; i < 46; i++) drops.push({ x: wr() * 400 - 20, len: 7 + wr() * 7, dur: 1.1 + wr() * 0.6, begin: -wr() * 1.7, o: 0.22 + wr() * 0.3 });
  if (weather === "wind") for (let i = 0; i < 5; i++) wisps.push({ y: 40 + wr() * 150, dur: 9 + wr() * 7, begin: -wr() * 12, o: 0.18 + wr() * 0.18, sc: 0.8 + wr() * 0.6 });
  if (weather === "leaves") for (let i = 0; i < 10; i++) leaves.push({ x: wr() * 360, dur: 8 + wr() * 6, begin: -wr() * 12, o: 0.5 + wr() * 0.4, sway: 20 + wr() * 30, rot: wr() * 360 });
  const treeX = place.tree === "left" ? 56 : 268;
  const houseX = place.tree === "right" ? 44 : 250;
  return (
    <svg viewBox="0 0 360 260" width="100%" style={{ display: "block" }} aria-label={companion.aria}>
      <defs>
        <linearGradient id="mistg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.paper} stopOpacity="0" />
          <stop offset="1" stopColor={P.paper} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="bandg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.band || P.paper} stopOpacity="0" />
          <stop offset="0.7" stopColor={P.band || P.paper} stopOpacity="0.5" />
          <stop offset="1" stopColor={P.band || P.paper} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="groundfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.paper} stopOpacity="0" />
          <stop offset="1" stopColor={P.paper} stopOpacity="1" />
        </linearGradient>
        <radialGradient id="sung">
          <stop offset="0" stopColor={P.sun || P.paper} stopOpacity="0.55" />
          <stop offset="1" stopColor={P.sun || P.paper} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="360" height="260" fill={P.paper} />
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.rr} fill={P.ink} opacity={st.o * (P.sun ? 0.5 : 1)}>
          {!reduced && st.twinkle && <animate attributeName="opacity" values={`${st.o};${st.dip};${st.o * 0.8};${st.dip};${st.o}`} dur={`${st.dur}s`} repeatCount="indefinite" />}
        </circle>
      ))}
      {P.band && <rect x="0" y="30" width="360" height="120" fill="url(#bandg)" />}
      {sun && P.sun && (
        <g>
          <circle cx={sun.x} cy={sun.y} r="30" fill="url(#sung)">
            {!reduced && <animate attributeName="r" values="28;34;28" dur="9s" repeatCount="indefinite" />}
          </circle>
          <circle cx={sun.x} cy={sun.y} r="9" fill={P.sun} stroke={P.ink} strokeWidth="0.5" strokeOpacity="0.35" />
        </g>
      )}
      {!P.sun && (
        <g>
          <circle cx="292" cy="46" r="11" fill={P.ink} opacity="0.85" />
          <circle cx="297" cy="43" r="10" fill={P.paper} />
        </g>
      )}

      {/* mountains of this place */}
      <path d={farPath} fill={P.mist} opacity="0.55" />
      <path d={nearPath} fill={P.mist} opacity="0.85" />
      <rect x="0" y={140 + place.mistLift} width="360" height="70" fill="url(#mistg)" opacity="0.9">
        {!reduced && <animate attributeName="y" values={`${140 + place.mistLift};${146 + place.mistLift};${140 + place.mistLift}`} dur="14s" repeatCount="indefinite" />}
      </rect>
      <path d="M0 215 Q180 200 360 218 L360 260 L0 260 Z" fill={P.paperDeep} />

      {place.kind === "onsen" && (() => {
        const water = P.stars ? "#4C5C64" : P.band ? "#93A9AC" : "#9FB4B6";
                return (
          <g>
            {/* two pines on the left */}
            <g fill="none" stroke={P.ink} strokeLinecap="round">
              <path d="M24 236 Q26 190 22 150 Q20 120 26 96" strokeWidth="1.8" />
              <path d="M26 110 L16 92 M26 128 L38 112 M25 150 L14 136 M24 170 L36 156" strokeWidth="1.1" />
              <path d="M16 92 l-6 -4 M16 92 l-2 -7 M38 112 l6 -5 M38 112 l1 -7 M14 136 l-7 -3 M14 136 l-3 -7 M36 156 l7 -4 M36 156 l2 -7" strokeWidth="0.8" />
            </g>
            {/* cairns by the pine */}
            {Array.from({ length: shown }, (_, i) => {
              const k = shown - i;
              return <Cairn key={`c${done - k}`} P={P} stones={STONES_PER_CAIRN} x={64 - k * 12} y={252 - k * 4} scale={Math.pow(0.82, k)} seed={done - k + 1} opacity={1 - k * 0.18} />;
            })}
            {building > 0 && <Cairn P={P} stones={building} x={74} y={256} seed={done + 1} />}
            {/* a small pool on the right, the frog resting at its far edge */}
            <path d="M206 238 Q214 218 246 214 Q290 210 320 222 Q338 234 328 250 Q312 260 268 260 Q222 258 206 238 Z" fill={P.mist} stroke={P.ink} strokeWidth="1" />
            <path d="M214 238 Q222 222 248 219 Q288 215 314 226 Q328 236 320 248 Q306 256 268 256 Q230 254 214 238 Z" fill={water} opacity="0.9" />
            <g fill={P.paperDeep} stroke={P.ink} strokeWidth="1">
              <ellipse cx="214" cy="226" rx="9" ry="5" /><ellipse cx="330" cy="240" rx="8" ry="5" /><ellipse cx="256" cy="262" rx="10" ry="5" />
            </g>
            {/* the companion, at the rear of the pool, in to its chin */}
            <g transform={`translate(${companion.onsen.x} ${companion.onsen.y}) scale(0.8)`}>
              <Creature P={P} eyesClosed={eyesClosed} reduced={reduced} inWater />
            </g>
            {/* water in front of the frog */}
            <path d="M216 232 Q244 226 272 229 Q300 232 318 228 Q328 236 320 248 Q306 256 268 256 Q230 254 214 238 Z" fill={water} opacity="0.94" />
            {!P.sun && <ellipse cx="296" cy="243" rx="7" ry="2.4" fill={P.paper} opacity="0.5">
              {!reduced && <animate attributeName="rx" values="7;9;7" dur="5s" repeatCount="indefinite" />}
            </ellipse>}
            <path d="M252 240 Q262 237 272 240 M260 248 Q272 245 284 248" stroke={P.paper} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.7" />
            {/* steam, leaning with the wind */}
            <g fill="none" stroke={P.inkSoft} strokeWidth="0.9" strokeLinecap="round">
              {[[244, 226, 0], [300, 230, 4]].map(([x, y, b], i) => (
                <path key={i} d={`M${x} ${y} C${x - 5} ${y - 9} ${x + 5} ${y - 16} ${x} ${y - 25} C${x - 5} ${y - 34} ${x + 5} ${y - 41} ${x} ${y - 50}`} opacity="0">
                  {!reduced && <animate attributeName="opacity" values="0;0.42;0.28;0" keyTimes="0;0.25;0.7;1" dur="9s" begin={`${b}s`} repeatCount="indefinite" />}
                  {!reduced && <animateTransform attributeName="transform" type="translate" values="0 0;5 -9;14 -16" dur="9s" begin={`${b}s`} repeatCount="indefinite" />}
                </path>
              ))}
            </g>
          </g>
        );
      })()}
      {place.kind !== "onsen" && (
        <g>
      {/* a stream, when there is one */}
      {place.stream && (
        <g fill="none" strokeLinecap="round">
          <path d="M-10 214 Q60 206 110 222 Q150 234 190 226 Q250 214 300 232 Q340 246 370 240" stroke={P.mist} strokeWidth="9" opacity="0.7" />
          <path d="M-10 214 Q60 206 110 222 Q150 234 190 226 Q250 214 300 232 Q340 246 370 240" stroke={P.paper} strokeWidth="1" strokeDasharray="6 14" opacity="0.8">
            {!reduced && <animate attributeName="stroke-dashoffset" values="0;-40" dur="3.2s" repeatCount="indefinite" />}
          </path>
          <path d="M-10 218 Q60 210 110 226 Q150 238 190 230 Q250 218 300 236 Q340 250 370 244" stroke={P.paper} strokeWidth="0.7" strokeDasharray="4 18" opacity="0.5">
            {!reduced && <animate attributeName="stroke-dashoffset" values="0;-44" dur="4.1s" repeatCount="indefinite" />}
          </path>
        </g>
      )}

      {/* a field, when there is one: rows of grass, a low fence */}
      {place.field && (
        <g stroke={P.ink} strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.55">
          {Array.from({ length: 34 }, (_, i) => {
            const x = 6 + i * 10.6 + (i % 3) * 2;
            const y = 224 + (i % 4) * 5;
            return <path key={i} d={`M${x} ${y} q1 -5 3 -8 M${x + 3} ${y} q-1 -4 0 -7`} />;
          })}
          <path d="M20 212 L20 204 M60 210 L60 202 M100 211 L100 203 M20 206 L100 205" strokeWidth="0.9" />
        </g>
      )}

      {/* a house, when there is one */}
      {place.house && (
        <g transform={`translate(${houseX} 150)`}>
          <path d="M0 40 L0 12 L26 -6 L52 12 L52 40 Z" fill={P.paper} stroke={P.ink} strokeWidth="1.4" />
          <path d="M-6 14 L26 -10 L58 14" fill="none" stroke={P.ink} strokeWidth="2" strokeLinecap="round" />
          <rect x="20" y="22" width="12" height="18" fill={P.sun ? P.ink : "#D9A45A"} opacity={P.sun ? 0.75 : 0.9} />
          <path d="M6 40 L46 40" stroke={P.ink} strokeWidth="1" />
        </g>
      )}

      {/* a pine, on one side or the other, or not at all */}
      {place.tree !== "none" && (
        <g transform={`translate(${treeX} 132)`} stroke={P.ink} fill="none" strokeLinecap="round">
          <path d="M14 78 L14 22" strokeWidth="2" />
          <path d="M14 30 Q-8 26 -10 14 M14 30 Q34 24 40 12" strokeWidth="1.4" />
          <path d="M14 46 Q-14 44 -18 30 M14 46 Q40 42 46 28" strokeWidth="1.4" />
          <path d="M-10 14 Q0 10 6 16 M40 12 Q30 8 24 16 M-18 30 Q-6 26 0 32 M46 28 Q34 24 28 32" strokeWidth="1.2" />
        </g>
      )}

      {/* cairns: finished ones recede to the left; the current one by the rock */}
      {Array.from({ length: shown }, (_, i) => {
        const k = shown - i; // k = 1 is the most recent finished cairn
        return <Cairn key={`c${done - k}`} P={P} stones={STONES_PER_CAIRN} x={92 - k * 15} y={224 - k * 4} scale={Math.pow(0.82, k)} seed={done - k + 1} opacity={1 - k * 0.18} />;
      })}
      {building > 0 && <Cairn P={P} stones={building} x={106} y={227} seed={done + 1} />}
      {/* rock */}
      <path d="M118 222 Q120 196 150 192 Q186 190 194 214 Q196 226 180 228 L130 228 Q116 228 118 222 Z" fill={P.paperDeep} stroke={P.ink} strokeWidth="1.4" />
      {/* teapot + cup */}
      <g transform="translate(210 208)" stroke={P.ink} strokeWidth="1.1" fill={P.paper} strokeLinejoin="round" strokeLinecap="round">
        {/* kyusu: side handle on the left, spout on the right. Tips at the wrist to pour. */}
        <g transform={`rotate(${tilt} 0 4)`}>
          <path d="M-14 4 Q-14 -8 0 -9 Q14 -8 14 4 Q14 12 8 14 L-8 14 Q-14 12 -14 4 Z" />
          <path d="M-9 -8 Q0 -13 9 -8" fill="none" />
          <circle cx="0" cy="-11" r="1.6" fill={P.ink} stroke="none" />
          <path d="M13 0 Q22 -4 22 -10" fill="none" />
          <path d="M-14 0 L-30 -4 Q-34 -5 -33 -2 L-14 3" />
        </g>
        <path d="M24 -9 Q29 0 31 8" fill="none" stroke={P.inkSoft} strokeWidth="1.1" opacity={tilt > 5 ? 0.8 : 0} />
        <path d="M28 8 L36 8 L35 15 L29 15 Z" />
        {tea && !pouring && (
          <g fill="none" stroke={P.inkSoft} strokeWidth="1" opacity="0.7">
            <path d="M32 4 Q30 1 32 -2 Q34 -5 32 -8">
              {!reduced && <animate attributeName="opacity" values="0.7;0.15;0.7" dur="3s" repeatCount="indefinite" />}
            </path>
          </g>
        )}
      </g>

      {/* the companion on its rock: a slight breath, slower when sitting */}
      <g transform="translate(156 196)">
        <Creature P={P} eyesClosed={eyesClosed} reduced={reduced} />
      </g>

        </g>
      )}
      <rect x="0" y="232" width="360" height="28" fill="url(#groundfade)" />
      {/* weather, in front of everything */}
      {weather === "rain" && (
        <g>
          <rect width="360" height="260" fill={P.mist} opacity="0.16" />
          <g stroke={P.inkSoft} strokeWidth="0.6" strokeLinecap="round">
            {drops.map((d, i) => (
              <line key={i} x1={d.x} y1="-20" x2={d.x - 1.6} y2={-20 + d.len} opacity={d.o}>
                {!reduced && <animateTransform attributeName="transform" type="translate" values="0 0;-24 300" dur={`${d.dur}s`} begin={`${d.begin}s`} repeatCount="indefinite" />}
              </line>
            ))}
          </g>
        </g>
      )}
      {weather === "wind" && (
        <g fill="none" stroke={P.inkSoft} strokeWidth="0.8" strokeLinecap="round">
          {wisps.map((w, i) => (
            <path key={i} d="M0 0 C 20 -6 40 6 60 0 S 100 -8 120 0 S 160 4 180 -2" opacity="0" transform={`translate(-200 ${w.y}) scale(${w.sc})`}>
              {!reduced && <animate attributeName="opacity" values={`0;${w.o};${w.o};0`} keyTimes="0;0.2;0.8;1" dur={`${w.dur}s`} begin={`${w.begin}s`} repeatCount="indefinite" />}
              {!reduced && <animateTransform attributeName="transform" type="translate" values={`-200 ${w.y};420 ${w.y - 10}`} dur={`${w.dur}s`} begin={`${w.begin}s`} repeatCount="indefinite" additive="sum" />}
            </path>
          ))}
        </g>
      )}
      {weather === "leaves" && (
        <g fill={P.tea} stroke={P.ink} strokeWidth="0.4" fillOpacity="0.7">
          {leaves.map((l, i) => (
            <g key={i} opacity="0">
              {!reduced && <animate attributeName="opacity" values={`0;${l.o};${l.o};0`} keyTimes="0;0.1;0.85;1" dur={`${l.dur}s`} begin={`${l.begin}s`} repeatCount="indefinite" />}
              {!reduced && <animateTransform attributeName="transform" type="translate" values={`${l.x} -10;${l.x + l.sway} 80;${l.x + l.sway * 0.4} 160;${l.x + l.sway * 1.3} 250`} dur={`${l.dur}s`} begin={`${l.begin}s`} repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1" />}
              <path d="M0 -4 C 3 -4 5 -1 4 3 C 2 5 -2 5 -4 3 C -5 -1 -3 -4 0 -4 Z" transform={`rotate(${l.rot})`}>
                {!reduced && <animateTransform attributeName="transform" type="rotate" values={`${l.rot};${l.rot + 180};${l.rot + 360}`} dur={`${l.dur / 2}s`} repeatCount="indefinite" />}
              </path>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}


export function Mountain({ companion, onSwitch, bowl, others }) {
  const FONT = companion.font;
  const KEY = companion.storageKey;
  const [state, setState] = useState(null);
  const [mode, setMode] = useState("home"); // home | sit | tea
  const [sitMin, setSitMin] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [teaLeft, setTeaLeft] = useState(0);
  const [tilt, setTilt] = useState(0);
  const tiltRef = useRef(null);
  const [showSatchel, setShowSatchel] = useState(false);
  const [loadNote, setLoadNote] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [bowlLine, setBowlLine] = useState(false);
  const [phase, setPhase] = useState(phaseFor());
  const [sun, setSun] = useState(sunPos());
  const [weather, setWeather] = useState(weatherFor());
  const timerRef = useRef(null);
  const P = companion.palettes[phase];
  const reduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    (async () => {
      let s = fresh();
      try {
        const r = await window.storage.get(KEY, false);
        if (r && r.value) s = { ...fresh(), ...JSON.parse(r.value) };
      } catch (e) {}
      s = reconcile(s);
      setState(s);
      persist(s);
    })();
  }, []);

  // tell the browser the colour of the hour, so its bars follow the page
  useEffect(() => {
    try {
      let m = document.querySelector('meta[name="theme-color"]');
      if (!m) { m = document.createElement("meta"); m.name = "theme-color"; document.head.appendChild(m); }
      m.setAttribute("content", P.paper);
      document.body.style.background = P.paper;
      document.documentElement.style.background = P.paper;
    } catch (e) {}
  }, [P.paper]);

  // once a minute: the light and the sun move with the clock
  useEffect(() => {
    const id = setInterval(() => {
      setPhase(phaseFor()); setSun(sunPos()); setWeather(weatherFor());
      setState((s) => { if (!s) return s; const n = { ...s, lastSeen: Date.now() }; persist(n); return n; });
    }, 60000);
    return () => clearInterval(id);
  }, []);

  // no walks in this version: the frog stays on its rock. But every time you come back
  // after being away three hours or more, you are somewhere new — the same pace as the weather.
  function reconcile(s) {
    const n = { ...s, frog: { status: "home", awayUntil: null, leftAt: null, justReturned: false }, satchel: (s.satchel || []).slice(0, 1) };
    const awayLong = Date.now() - (n.lastSeen || 0) > 3 * HOUR;
    if (awayLong || n.placeDay !== todayKey() || n.placeSeed == null) {
      n.placeSeed = Math.floor(Math.random() * 1e9);
      n.placeDay = todayKey();
    }
    n.lastSeen = Date.now();
    return n;
  }

  async function persist(s) {
    try {
      await window.storage.set(KEY, JSON.stringify(s), false);
    } catch (e) {
      // saving failed; say nothing
    }
  }

  function update(fn) {
    setState((s) => {
      const n = fn(s);
      persist(n);
      return n;
    });
  }

  function startSit(min) {
    bellsToBegin();
    count(`sit-start-${min}`);
    setSitMin(min);
    setRemaining(min * 60);
    setMode("sit");
    const end = Date.now() + min * 60 * 1000;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        clearInterval(timerRef.current);
        finishSit(min);
      }
    }, 500);
  }

  function finishSit(min) {
    bellsToEnd();
    count(`sit-done-${min}`);
    // after a finished sit, the frog leaves a line in the satchel. It doesn't go anywhere.
    update((s) => {
      const textId = pickLine(companion, s.seen);
      const seen = [...(s.seen || []), textId];
      return ({
      ...s,
      sits: [{ at: Date.now(), min }, ...s.sits],
      satchel: [{ id: `${Date.now()}`, textId, at: Date.now() }],
      frog: { ...s.frog, justReturned: true },
      seen: seen.length >= companion.all.length ? [] : seen,
      // and after the bell, we walk on together
      placeSeed: Math.floor(Math.random() * 1e9),
      placeDay: todayKey(),
      });
    });
    setMode("home");
    setSitMin(null);
  }

  function stopSit() {
    clearInterval(timerRef.current);
    setMode("home");
    setSitMin(null);
  }

  // a small tilt: up to seven degrees, held while the cup fills, then back
  function runPour() {
    cancelAnimationFrame(tiltRef.current);
    const t0 = performance.now();
    const ease = (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    const step = (now) => {
      const t = (now - t0) / 1000;
      let a = 0;
      if (t < 0.8) a = 7 * ease(t / 0.8);
      else if (t < 2.0) a = 7;
      else if (t < 2.8) a = 7 * (1 - ease((t - 2.0) / 0.8));
      setTilt(a);
      if (t < 2.8) tiltRef.current = requestAnimationFrame(step);
      else setTilt(0);
    };
    tiltRef.current = requestAnimationFrame(step);
  }
  function pourTea() {
    setMode("tea");
    count("tea");
    setTeaLeft(30);
    if (!reduced) runPour();
    clearInterval(timerRef.current);
    const end = Date.now() + 30000;
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      setTeaLeft(left);
      if (left <= 0) {
        clearInterval(timerRef.current);
        update((s) => ({ ...s, teas: s.teas + 1 }));
        setTimeout(() => setMode("home"), 1500);
      }
    }, 500);
  }

  function acknowledgeReturn() {
    update((s) => ({ ...s, frog: { ...s.frog, justReturned: false } }));
    setShowSatchel(true);
  }

  // the bowl: one line in the satchel, once, after the first cairn is complete
  useEffect(() => {
    if (!showSatchel) { setBowlLine(false); return; }
    if (bowl && bowl.url && !bowl.seen && state && (state.sits || []).length >= BOWL_AFTER_SITS) {
      setBowlLine(true);
      bowl.markSeen();
    }
  }, [showSatchel]);

  async function resetAll() {
    const s = fresh();
    setState(s);
    setShowSatchel(false);
    try {
      await window.storage.delete(KEY, false);
    } catch (e) {}
  }

  useEffect(() => () => { clearInterval(timerRef.current); cancelAnimationFrame(tiltRef.current); }, []);

  if (!state) {
    return (
      <div style={{ background: P.paper, minHeight: "100vh", fontFamily: FONT, color: P.inkSoft, display: "grid", placeItems: "center" }}>
        <span>…</span>
      </div>
    );
  }

  
  let line;
  if (mode === "sit") line = `Sitting ${sitMin} minutes. ${cap(companion.called)} is sitting too.`;
  else if (mode === "tea" && teaLeft <= 0) line = "The cup is empty.";
  else if (state.frog.justReturned) line = `${cap(companion.called)} left something in the satchel. The path goes on.`;
  else if (mode === "tea" && teaLeft > 0) line = chooseLine(companion.lines, (state.placeSeed || 1) + 5, "tea", "clear", { });
  else line = chooseLine(companion.lines, (state.placeSeed || 1) + phase.length + weather.length, phase, weather, placeFor(state.placeSeed || 1));

  const btn = {
    fontFamily: FONT,
    background: "transparent",
    color: P.ink,
    border: `1px solid ${P.ink}`,
    borderRadius: 2,
    padding: "10px 18px",
    fontSize: 16,
    cursor: "pointer",
    minWidth: 96,
  };
  const btnQuiet = { ...btn, border: `1px solid ${P.mist}`, color: P.inkSoft };

  return (
    <div style={{ background: P.paper, minHeight: "100vh", fontFamily: FONT, color: P.ink, transition: reduced ? "none" : "background 3s ease, color 3s ease" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "18px 20px 48px" }}>
        <h1 style={{ margin: "0 0 4px", fontWeight: 400, fontSize: 22, letterSpacing: 0.5 }}>{companion.title}</h1>
        <p style={{ margin: "0 0 14px", color: P.inkSoft, fontSize: 14 }}>{P.name}</p>

        <div style={{ margin: "0 -20px" }}>
          <Scene companion={companion} P={P} eyesClosed={mode === "sit"} tea={mode === "tea" && teaLeft > 0} tilt={tilt} reduced={reduced} sun={sun} place={placeFor(state.placeSeed || 1)} weather={weather} sits={(state.sits || []).length} />
        </div>

        <p style={{ fontSize: 14, lineHeight: 1.6, margin: "14px 0 16px", minHeight: 44, color: P.inkSoft }}>{line}</p>

        {mode === "sit" && (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <InkCircle P={P} progress={1 - remaining / (sitMin * 60)} />
            <div style={{ color: P.inkSoft, fontSize: 15 }}>
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")} left
              <div style={{ marginTop: 10 }}>
                <button style={btnQuiet} onClick={stopSit}>Stop</button>
              </div>
            </div>
          </div>
        )}

        {mode === "tea" && (
          <div style={{ color: P.inkSoft, fontSize: 15 }}>{teaLeft > 0 ? "Let it cool." : ""}</div>
        )}

        {mode === "home" && !state.frog.justReturned && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <span style={{ color: P.inkSoft, fontSize: 15, marginRight: 4 }}>Sit</span>
            {[5, 15, 30].map((m) => (
              <button key={m} style={btn} onClick={() => startSit(m)}>{m} min</button>
            ))}
            {placeFor(state.placeSeed || 1).kind !== "onsen" && (
              <button style={{ ...btnQuiet, marginLeft: "auto" }} onClick={pourTea}>Pour tea</button>
            )}
          </div>
        )}

        {mode === "home" && state.frog.justReturned && (
          <button style={btn} onClick={acknowledgeReturn}>Open the satchel</button>
        )}

        <div style={{ marginTop: 34, borderTop: `1px solid ${P.mist}`, paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <button
              style={{ ...btnQuiet, border: "none", padding: 0, minWidth: 0, fontSize: 16, color: P.ink }}
              onClick={() => { setShowSatchel((v) => !v); setShowAbout(false); }}
              aria-expanded={showSatchel}
            >
              Satchel {showSatchel ? "—" : "+"}
            </button>
            <button
              style={{ ...btnQuiet, border: "none", padding: 0, minWidth: 0, fontSize: 15, marginLeft: "auto" }}
              onClick={() => { setShowAbout((v) => !v); setShowSatchel(false); }}
              aria-expanded={showAbout}
            >
              About
            </button>
          </div>

          {showSatchel && (
            <div style={{ marginTop: 14 }}>
              {state.satchel.length === 0 && (
                <p style={{ color: P.inkSoft, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                  Nothing yet. {cap(companion.called)} leaves a line after you sit.
                </p>
              )}
              {state.satchel.map((entry) => {
                const t = companion.all.find((x) => x.id === entry.textId);
                if (!t) return null;
                return (
                  <article key={entry.id} style={{ marginBottom: 22 }}>
                    {t.zh && <p style={{ fontSize: 18, lineHeight: 1.7, margin: "0 0 4px" }}>{t.zh}</p>}
                    <p style={{ fontSize: t.zh ? 15 : 17, lineHeight: 1.6, margin: "0 0 4px", color: t.zh ? P.inkSoft : P.ink }}>{t.en}</p>
                    <p style={{ fontSize: 13, margin: 0, color: P.inkSoft }}>
                      {t.src}, brought home {dateShort(entry.at)}
                    </p>
                  </article>
                );
              })}
              {bowlLine && (
                <p style={{ color: P.inkSoft, fontSize: 15, lineHeight: 1.6, margin: "6px 0 0" }}>
                  {cap(companion.called)} costs nothing. If you would like to leave something for the person who drew the mountain, there is{" "}
                  <a href={bowl.url(companion.id, "satchel")} target="_blank" rel="noopener" onClick={() => count("bowl-satchel")} style={{ color: P.ink }}>a bowl by the door</a>.
                </p>
              )}
            </div>
          )}

          {showAbout && (
            <About P={P} FONT={FONT} companion={companion} bowl={bowl} onSwitch={onSwitch} others={others} onReset={() => { resetAll(); setShowAbout(false); }} btnQuiet={btnQuiet} />
          )}
        </div>


      </div>
    </div>
  );
}

// ---------- About: who made it, the other companions, the bowl, and a way to start again ----------
function About({ P, FONT, companion, bowl, onSwitch, others, onReset, btnQuiet }) {
  const [sure, setSure] = useState(false);
  const p = { fontSize: 15, lineHeight: 1.6, margin: "0 0 14px", color: P.inkSoft };
  const link = { ...btnQuiet, border: "none", padding: 0, minWidth: 0, fontSize: 15, color: P.ink, textDecoration: "underline", textUnderlineOffset: 3 };
  return (
    <div style={{ marginTop: 14, fontFamily: FONT }}>
      <p style={p}>{companion.title}. A {companion.name} on a mountain. Sit with it.</p>
      {(companion.story || []).map((t, i) => <p key={i} style={p}>{t}</p>)}
      <p style={p}>I drew this when I was unwell, and it kept me company. Maybe it can keep you company too.</p>
      <p style={p}>No account. {GOAT_CODE ? "It counts opens and sits, not you." : "Nothing leaves your phone."} What you have seen stays in the satchel.</p>
      {onSwitch && others && others.length > 0 && (
        <p style={p}>
          There is also {others.map((o) => o.intro).join(" and ")}, {others.length > 1 ? "each on another mountain" : "on another mountain"}.
          {others.map((o) => (
            <span key={o.id}>
              {" "}<button style={link} onClick={() => onSwitch(o.id)}>Sit with {o.called} instead</button>.
            </span>
          ))}
        </p>
      )}
      {bowl && bowl.url && (
        <p style={p}>
          {cap(companion.called)} costs nothing. If you would like to leave something for the person who drew the mountain,{" "}
          <a href={bowl.url(companion.id, "about")} target="_blank" rel="noopener" onClick={() => count("bowl-about")} style={{ color: P.ink }}>there is a bowl by the door</a>.
        </p>
      )}
      <p style={{ ...p, margin: 0 }}>
        {!sure ? (
          <button style={{ ...link, color: P.inkSoft }} onClick={() => setSure(true)}>Forget everything and start again</button>
        ) : (
          <>
            Forget everything? <button style={link} onClick={() => { setSure(false); onReset(); }}>Yes</button>{" "}
            <button style={{ ...link, color: P.inkSoft, marginLeft: 12 }} onClick={() => setSure(false)}>No</button>
          </>
        )}
      </p>
    </div>
  );
}


function InkCircle({ P, progress }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r={r} fill="none" stroke={P.mist} strokeWidth="2" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke={P.ink}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(1, Math.max(0, progress)))}
        transform="rotate(-90 40 40)"
        style={{ transition: "stroke-dashoffset 0.5s linear" }}
      />
    </svg>
  );
}