// Neon Coast — Poster Cover Studio: the poster renderer.
// Draws the multi-panel collage, the giant gradient title, the story captions,
// the press quote and the print furniture (barcode, seal, starburst, pills)
// onto any canvas size. All art is original; no Rockstar material anywhere.

import { gradeById, layoutById } from './presets.js';

let halftonePattern = null;

function halftoneTile() {
  if (halftonePattern) return halftonePattern;
  const tile = document.createElement('canvas');
  tile.width = 10;
  tile.height = 10;
  const t = tile.getContext('2d');
  t.fillStyle = 'rgba(28,6,48,1)';
  t.beginPath();
  t.arc(5, 5, 2.3, 0, Math.PI * 2);
  t.fill();
  halftonePattern = tile;
  return tile;
}

/** Panel rectangles for a layout, inside the poster area (top 70% of the frame). */
export function layoutSlots(layoutId, W, H) {
  const areaH = H * 0.7;
  const g = Math.max(2, W * 0.006);
  const rows = (y0, y1, splits) => {
    const out = [];
    let x = 0;
    for (const w of splits) {
      out.push({ x: x + g / 2, y: y0 + g / 2, w: W * w - g, h: y1 - y0 - g });
      x += W * w;
    }
    return out;
  };
  switch (layoutId) {
    case 'grid3x3': {
      const out = [];
      for (let r = 0; r < 3; r++) {
        out.push(...rows((areaH / 3) * r, (areaH / 3) * (r + 1), [1 / 3, 1 / 3, 1 / 3]));
      }
      return out;
    }
    case 'heroLeft': {
      const hero = { x: g / 2, y: g / 2, w: W * 0.56 - g, h: areaH - g };
      const small = [];
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          small.push({
            x: W * 0.56 + (W * 0.44 * c) / 2 + g / 2, y: (areaH * r) / 2 + g / 2,
            w: (W * 0.44) / 2 - g, h: areaH / 2 - g,
          });
        }
      }
      return [hero, ...small];
    }
    case 'heroRight': {
      const small = [];
      for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
          small.push({
            x: (W * 0.44 * c) / 2 + g / 2, y: (areaH * r) / 2 + g / 2,
            w: (W * 0.44) / 2 - g, h: areaH / 2 - g,
          });
        }
      }
      const hero = { x: W * 0.44 + g / 2, y: g / 2, w: W * 0.56 - g, h: areaH - g };
      return [hero, ...small];
    }
    case 'mosaic8': {
      const out = [];
      for (let r = 0; r < 2; r++) {
        out.push(...rows((areaH / 2) * r, (areaH / 2) * (r + 1), [0.25, 0.25, 0.25, 0.25]));
      }
      return out;
    }
    case 'strip3': {
      const hero = { x: g / 2, y: g / 2, w: W - g, h: areaH * 0.72 - g };
      const strip = rows(areaH * 0.72, areaH, [1 / 3, 1 / 3, 1 / 3]);
      return [hero, ...strip];
    }
    case 'fullbleed': {
      return [{ x: g / 2, y: g / 2, w: W - g, h: areaH - g }];
    }
    case 'collage9':
    default: {
      // 3 x 3 collage; the middle row's center panel is twice as wide as its
      // neighbours, so the duo in the center is the largest panel of the nine.
      return [
        ...rows(0, areaH / 3, [1 / 3, 1 / 3, 1 / 3]),
        ...rows(areaH / 3, (areaH * 2) / 3, [0.25, 0.5, 0.25]),
        ...rows((areaH * 2) / 3, areaH, [1 / 3, 1 / 3, 1 / 3]),
      ];
    }
  }
}

function fitFont(ctx, text, maxWidth, startSize, family, weight = 900) {
  let size = startSize;
  ctx.font = `${weight} ${size}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && size > 8) {
    size -= 2;
    ctx.font = `${weight} ${size}px ${family}`;
  }
  return size;
}

function drawPanel(ctx, rect, img, panel, grade, showCaption, s) {
  const { x, y, w, h } = rect;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.fillStyle = '#241533';
  ctx.fillRect(x, y, w, h);
  if (img) {
    const zoom = panel.zoom || 1;
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom;
    const pw = img.naturalWidth * scale;
    const ph = img.naturalHeight * scale;
    const ox = (panel.ox ?? 0.5) * (w - pw) + x;
    const oy = (panel.oy ?? 0.5) * (h - ph) + y;
    ctx.filter = grade.filter;
    ctx.drawImage(img, ox, oy, pw, ph);
    ctx.filter = 'none';
  }
  const tint = ctx.createLinearGradient(0, y, 0, y + h);
  tint.addColorStop(0, 'rgba(255,120,60,0)');
  tint.addColorStop(1, grade.tint);
  ctx.fillStyle = tint;
  ctx.fillRect(x, y, w, h);
  if (showCaption && panel.place) {
    const chipH = Math.max(30 * s, h * 0.24);
    ctx.fillStyle = 'rgba(12,4,24,0.78)';
    ctx.fillRect(x, y + h - chipH, w, chipH);
    ctx.fillStyle = '#ffd23e';
    const line1 = `${panel.place}  ·  ${panel.time}`;
    const fs1 = fitFont(ctx, line1, w - 12 * s, Math.max(11 * s, h * 0.075), 'Anton, sans-serif');
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(line1, x + 10 * s, y + h - chipH + fs1 + 3 * s);
    ctx.fillStyle = '#ffffff';
    fitFont(ctx, panel.hook, w - 16 * s, Math.max(9 * s, h * 0.06), 'Anton, sans-serif', 700);
    ctx.fillText(panel.hook, x + 10 * s, y + h - 4 * s);
  }
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = Math.max(1, 2 * s);
  ctx.strokeRect(x, y, w, h);
}

function starburst(ctx, cx, cy, rOuter, rInner, points, fill) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = '#1a0b2e';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function barcode(ctx, x, y, w, h, seedText) {
  let seed = 0;
  for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  let bx = x;
  ctx.fillStyle = '#f5eefb';
  ctx.fillRect(x - 4, y - 4, w + 8, h + 16);
  ctx.fillStyle = '#160a24';
  while (bx < x + w) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const bw = 1 + (seed % 3);
    if (seed % 2 === 0) ctx.fillRect(bx, y, bw, h);
    bx += bw + 1 + (seed % 2);
  }
  ctx.fillStyle = '#160a24';
  ctx.font = `700 ${Math.max(8, h * 0.22)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('8 90126 20261', x + w / 2, y + h + 12);
}

/** Draws the whole poster (collage + title block + furniture) on `canvas`. */
export function drawPoster(canvas, state, images) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const s = Math.min(W, H) / 1080;
  const grade = gradeById(state.grade);
  const layout = layoutById(state.layout);
  const slots = layoutSlots(state.layout, W, H);
  const areaH = H * 0.7;

  ctx.fillStyle = '#160a24';
  ctx.fillRect(0, 0, W, H);

  const count = Math.min(layout.slots, state.panels.length, slots.length);
  for (let i = 0; i < count; i++) {
    const p = state.panels[i];
    drawPanel(ctx, slots[i], images[p.photo], p, grade, state.locationTags, s);
  }

  // Poster Ink: halftone dots over the whole collage area.
  const ink = state.ink ?? grade.ink ?? 0;
  if (ink > 0.02) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, areaH);
    ctx.clip();
    ctx.globalAlpha = ink * 0.4;
    ctx.fillStyle = ctx.createPattern(halftoneTile(), 'repeat');
    ctx.fillRect(0, 0, W, areaH);
    ctx.restore();
  }

  // Top pills: WANTED stars (left) and the ribbon (right).
  const pillY = 14 * s;
  const pillH = 30 * s;
  ctx.font = `900 ${16 * s}px Anton, sans-serif`;
  const wanted = 'WANTED ' + '★'.repeat(state.stars ?? 5);
  const wantedW = ctx.measureText(wanted).width + 22 * s;
  ctx.fillStyle = 'rgba(12,4,24,0.85)';
  ctx.strokeStyle = '#ffd23e';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.roundRect(14 * s, pillY, wantedW, pillH, pillH / 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#ffd23e';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(wanted, 25 * s, pillY + pillH / 2 + 1 * s);
  ctx.font = `900 ${14 * s}px Anton, sans-serif`;
  const ribbonW = ctx.measureText(state.ribbon).width + 22 * s;
  ctx.fillStyle = '#ffd23e';
  ctx.beginPath();
  ctx.roundRect(W - 14 * s - ribbonW, pillY, ribbonW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = '#160a24';
  ctx.textAlign = 'left';
  ctx.fillText(state.ribbon, W - 14 * s - ribbonW + 11 * s, pillY + pillH / 2 + 1 * s);

  // Title block.
  const block = ctx.createLinearGradient(0, areaH, 0, H);
  block.addColorStop(0, '#1c0b31');
  block.addColorStop(1, '#2b1038');
  ctx.fillStyle = block;
  ctx.fillRect(0, areaH, W, H - areaH);
  ctx.fillStyle = '#ffd23e';
  ctx.fillRect(0, areaH, W, 3 * s);

  const blockH = H - areaH;
  const titleSize = fitFont(ctx, state.title, W * 0.94, Math.min(W * 0.115, blockH * 0.42), 'Anton, sans-serif');
  const titleGrad = ctx.createLinearGradient(0, areaH, W, areaH);
  titleGrad.addColorStop(0, '#ff5fa2');
  titleGrad.addColorStop(0.5, '#ffb347');
  titleGrad.addColorStop(1, '#ffe259');
  const titleY = areaH + titleSize * 0.95;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(20,2,32,0.9)';
  ctx.lineWidth = titleSize * 0.09;
  ctx.strokeText(state.title, W / 2, titleY);
  ctx.fillStyle = titleGrad;
  ctx.fillText(state.title, W / 2, titleY);

  const tagSize = fitFont(ctx, state.tagline, W * 0.8, Math.min(W * 0.038, titleSize * 0.34), 'Pacifico, cursive');
  ctx.fillStyle = '#ffd9ec';
  ctx.fillText(state.tagline, W / 2, titleY + tagSize * 1.35);

  // Press quote with stars.
  const quoteY = titleY + tagSize * 1.35 + H * 0.03;
  const quoteText = `★★★★★  "${state.quote}" — ${state.quoteSource}`;
  fitFont(ctx, quoteText, W * 0.9, W * 0.02, 'Anton, sans-serif', 700);
  ctx.fillStyle = '#ffe9a8';
  ctx.fillText(quoteText, W / 2, quoteY);

  // Credit line.
  const credit = `${state.volume} · TWO OUTLAWS · ONE COAST · ALL ORIGINAL ART — NEON COAST PRESS`;
  fitFont(ctx, credit, W * 0.62, W * 0.015, 'Anton, sans-serif', 700);
  ctx.fillStyle = '#cbb8d8';
  ctx.fillText(credit, W / 2, H - 14 * s);

  // Starburst badge, top-right of the title block.
  const bx = W * 0.88;
  const by = areaH + (H - areaH) * 0.22;
  const br = W * 0.052;
  starburst(ctx, bx, by, br, br * 0.72, 12, '#ffd23e');
  ctx.fillStyle = '#160a24';
  ctx.font = `900 ${13 * s}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const badgeLines = state.badge.split(' ');
  ctx.fillText(badgeLines[0] ?? '', bx, by - 7 * s);
  ctx.fillText(badgeLines.slice(1).join(' ') || badgeLines[0], bx, by + 8 * s);

  // Barcode (bottom-left) and NC seal (bottom-right).
  barcode(ctx, W * 0.03, H - 52 * s, W * 0.085, H * 0.028, state.title + state.volume);
  const sealR = W * 0.026;
  const sealX = W * 0.955;
  const sealY = H - 32 * s;
  ctx.beginPath();
  ctx.arc(sealX, sealY, sealR, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd23e';
  ctx.fill();
  ctx.strokeStyle = '#160a24';
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.fillStyle = '#160a24';
  ctx.font = `900 ${15 * s}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('NC', sealX, sealY + 1 * s);
}

/** Renders the poster to a fresh canvas of the given size (for export). */
export function renderPoster(w, h, state, images) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  drawPoster(canvas, state, images);
  return canvas;
}
