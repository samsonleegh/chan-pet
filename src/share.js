// The share card: the line you brought home, drawn over the mountain, as one portrait image
// for the phone's share sheet. Rendered on the device from the scene that is on screen.
const W = 1080, H = 1350, SCENE_H = Math.round((W / 360) * 260); // the scene's own aspect, 360x260

function wrap(ctx, text, maxW) {
  const cjk = /[　-ヿ㐀-鿿＀-￯]/.test(text);
  const units = cjk ? [...text] : text.split(" ");
  const lines = []; let cur = "";
  for (const u of units) {
    const t = cur ? (cjk ? cur + u : cur + " " + u) : u;
    if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = u; } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

async function sceneImage(svg) {
  const xml = new XMLSerializer().serializeToString(svg).replace('width="100%"', `width="${W}" height="${SCENE_H}"`);
  const img = new Image();
  await new Promise((ok, err) => { img.onload = ok; img.onerror = err; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml); });
  return img;
}

export async function renderLineCard({ svg, P, font, companion, text, host }) {
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H);
  try { ctx.drawImage(await sceneImage(svg), 0, 0, W, SCENE_H); } catch (e) {}
  // a soft fade from the scene into the paper
  const g = ctx.createLinearGradient(0, SCENE_H - 120, 0, SCENE_H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, P.paper);
  ctx.fillStyle = g; ctx.fillRect(0, SCENE_H - 120, W, 120);

  const x = 84, maxW = W - 2 * x;
  let y = SCENE_H + 70;
  ctx.textBaseline = "alphabetic";
  if (text.zh) {
    ctx.fillStyle = P.ink; ctx.font = `400 50px ${font}`;
    for (const l of wrap(ctx, text.zh, maxW)) { ctx.fillText(l, x, y); y += 78; }
    y += 10;
  }
  ctx.fillStyle = text.zh ? P.inkSoft : P.ink; ctx.font = `400 ${text.zh ? 34 : 44}px ${font}`;
  for (const l of wrap(ctx, text.en, maxW)) { ctx.fillText(l, x, y); y += text.zh ? 52 : 66; }
  if (text.src) { y += 14; ctx.fillStyle = P.inkSoft; ctx.font = `400 26px ${font}`; ctx.fillText(text.src, x, y); }
  ctx.fillStyle = P.inkSoft; ctx.font = `400 26px ${font}`;
  ctx.fillText(`${companion.title} · ${host}`, x, H - 64);
  return new Promise((ok) => c.toBlob(ok, "image/png"));
}

export async function shareLine(opts) {
  const blob = await renderLineCard(opts);
  if (!blob) return "failed";
  const file = new File([blob], "line.png", { type: "image/png" });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: opts.companion.title });
      return "shared";
    }
  } catch (e) { if (e && e.name === "AbortError") return "cancelled"; }
  // no share sheet here: hand over the file instead
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = "line.png"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  return "saved";
}

if (import.meta.env.DEV) window.__chanpet = { renderLineCard };
