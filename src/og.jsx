// Dev-only page: renders one still of the mountain at dusk for the share preview (og.png).
import { createRoot } from "react-dom/client";
import { Scene, sunPos, placeFor } from "./engine.jsx";
import frog from "./companions/frog.jsx";

const P = frog.palettes.dusk;
const dusk = new Date(2026, 0, 1, 19, 5);
// pick a seed whose place has a house and a stream, on a normal mountain
let seed = 7;
for (let s = 7; s < 5000; s++) { const p = placeFor(s); if (p.kind === "mountain" && p.house && p.stream && p.tree !== "none") { seed = s; break; } }

createRoot(document.getElementById("card")).render(
  <Scene companion={frog} P={P} eyesClosed={false} tea={false} tilt={0} reduced={true} sun={sunPos(dusk)} place={placeFor(seed)} weather="clear" sits={7} />
);

window.renderOG = async (title, line) => {
  const svg = document.querySelector("#card svg");
  const xml = new XMLSerializer().serializeToString(svg).replace('width="100%"', 'width="1200" height="867"');
  const img = new Image();
  await new Promise((ok, err) => { img.onload = ok; img.onerror = err; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml); });
  const c = document.getElementById("out"), ctx = c.getContext("2d");
  ctx.fillStyle = P.paper; ctx.fillRect(0, 0, 1200, 630);
  ctx.drawImage(img, 0, -130, 1200, 867);
  const font = frog.font;
  ctx.fillStyle = P.ink; ctx.textBaseline = "alphabetic";
  ctx.font = `400 60px ${font}`; ctx.fillText(title, 64, 108);
  ctx.font = `400 34px ${font}`; ctx.fillStyle = P.inkSoft; ctx.fillText(line, 66, 162);
  return c.toDataURL("image/png");
};
