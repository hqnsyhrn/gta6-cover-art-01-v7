// Neon Coast — Poster Cover Studio: editor wiring.
// Presets, layouts, grades, Poster Ink, per-panel story captions, photo picker,
// upload, shuffle, undo/redo, and PNG export in the three post sizes.

import { PHOTOS, LAYOUTS, GRADES, EXPORT_SIZES, presetById, layoutById } from './presets.js';
import { drawPoster, renderPoster, layoutSlots } from './cover.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const statusEl = document.getElementById('status');
const $ = (id) => document.getElementById(id);

let photos = [...PHOTOS];
let images = [];
let state = null;
let selectedPanel = 4;
let history = [];
let historyIndex = -1;

export function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function blankState() {
  return {
    preset: 'sunset-duo', layout: 'collage9', grade: 'ink-strong', ink: 0.8,
    title: 'SUNSET DUO', tagline: 'TWO OUTLAWS. ONE SUNSET.',
    quote: 'NEON, SUN AND ONE LAST SCORE', quoteSource: 'THE LEONIDA LEDGER',
    volume: 'VOL. 01', ribbon: "COLLECTOR'S EDITION", badge: 'SUMMER 2026',
    locationTags: true, stars: 5,
    panels: [],
  };
}

function applyPreset(id) {
  const p = presetById(id);
  const next = blankState();
  next.preset = p.id;
  next.layout = p.layout;
  next.grade = p.grade;
  next.ink = p.ink;
  next.title = p.title;
  next.tagline = p.tagline;
  next.quote = p.quote;
  next.quoteSource = p.quoteSource;
  next.volume = p.volume;
  next.ribbon = p.ribbon;
  next.badge = p.badge;
  next.panels = p.panels.map((panel) => ({ ...panel }));
  state = next;
  selectedPanel = state.layout === 'collage9' ? 4 : 0;
  syncControls();
  renderPanelFields();
  redraw();
}

function syncControls() {
  $('layout').value = state.layout;
  $('grade').value = state.grade;
  $('ink').value = String(state.ink);
  $('inkVal').textContent = `${Math.round(state.ink * 100)}%`;
  $('title').value = state.title;
  $('tagline').value = state.tagline;
  $('quote').value = state.quote;
  $('quoteSource').value = state.quoteSource;
  $('volume').value = state.volume;
  $('ribbon').value = state.ribbon;
  $('badge').value = state.badge;
  $('locationTags').checked = state.locationTags;
  $('stars').value = String(state.stars);
  $('starsVal').textContent = '★'.repeat(state.stars);
  document.querySelectorAll('#presets button').forEach((b) => {
    b.classList.toggle('active', b.dataset.preset === state.preset);
  });
}

function pushHistory() {
  history = history.slice(0, historyIndex + 1);
  history.push(JSON.stringify(state));
  if (history.length > 60) history.shift();
  historyIndex = history.length - 1;
  $('undo').disabled = historyIndex <= 0;
  $('redo').disabled = true;
}

function restoreFromHistory() {
  state = JSON.parse(history[historyIndex]);
  syncControls();
  renderPanelFields();
  redraw();
  $('undo').disabled = historyIndex <= 0;
  $('redo').disabled = historyIndex >= history.length - 1;
}

function redraw() {
  if (!state) return;
  drawPoster(canvas, state, images);
}

function renderPanelFields() {
  const wrap = $('panelFields');
  wrap.innerHTML = '';
  const slots = layoutById(state.layout).slots;
  for (let i = 0; i < Math.min(slots, state.panels.length); i++) {
    const p = state.panels[i];
    const row = document.createElement('div');
    row.className = 'panel-row' + (i === selectedPanel ? ' selected' : '');
    row.innerHTML =
      `<button type="button" class="panel-pick">${i + 1} · ${photos[p.photo]?.label ?? 'Photo'}</button>` +
      `<input data-k="place" value="" placeholder="Place" maxlength="24">` +
      `<input data-k="time" value="" placeholder="Time" maxlength="12">` +
      `<input data-k="hook" value="" placeholder="Story hook" maxlength="40">`;
    row.querySelector('.panel-pick').addEventListener('click', () => {
      selectedPanel = i;
      renderPanelFields();
      syncFraming();
    });
    const [placeEl, timeEl, hookEl] = row.querySelectorAll('input');
    placeEl.value = p.place;
    timeEl.value = p.time;
    hookEl.value = p.hook;
    placeEl.addEventListener('input', () => { p.place = placeEl.value.toUpperCase(); redraw(); });
    timeEl.addEventListener('input', () => { p.time = timeEl.value; redraw(); });
    hookEl.addEventListener('input', () => { p.hook = hookEl.value.toUpperCase(); redraw(); });
    for (const el of [placeEl, timeEl, hookEl]) {
      el.addEventListener('change', pushHistory);
    }
    wrap.appendChild(row);
  }
  syncFraming();
}

function syncFraming() {
  const p = state.panels[selectedPanel];
  if (!p) return;
  $('zoom').value = String(p.zoom || 1);
  $('panX').value = String(p.ox ?? 0.5);
  $('panY').value = String(p.oy ?? 0.5);
  $('panelLabel').textContent = `Panel ${selectedPanel + 1} · ${photos[p.photo]?.label ?? ''}`;
}

function buildPhotoGrid() {
  const grid = $('photoGrid');
  grid.innerHTML = '';
  photos.forEach((photo, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'thumb';
    btn.title = photo.label;
    const img = document.createElement('img');
    img.src = photo.file.startsWith('data:') ? photo.file : `samples/${photo.file}`;
    img.alt = photo.label;
    img.loading = 'lazy';
    btn.appendChild(img);
    btn.addEventListener('click', () => {
      state.panels[selectedPanel].photo = idx;
      pushHistory();
      renderPanelFields();
      redraw();
    });
    grid.appendChild(btn);
  });
}

function bindControls() {
  const presetWrap = $('presets');
  for (const p of ['sunset-duo', 'sunset-chase', 'neon-coast', 'golden-hour', 'vice-nights']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.preset = p;
    b.textContent = presetById(p).name;
    b.addEventListener('click', () => { applyPreset(p); pushHistory(); });
    presetWrap.appendChild(b);
  }
  for (const l of LAYOUTS) {
    const o = document.createElement('option');
    o.value = l.id;
    o.textContent = `${l.name} (${l.slots})`;
    $('layout').appendChild(o);
  }
  for (const g of GRADES) {
    const o = document.createElement('option');
    o.value = g.id;
    o.textContent = g.name;
    $('grade').appendChild(o);
  }
  $('layout').addEventListener('change', () => {
    state.layout = $('layout').value;
    state.preset = 'custom';
    if (selectedPanel >= layoutById(state.layout).slots) selectedPanel = 0;
    syncControls();
    renderPanelFields();
    pushHistory();
    redraw();
  });
  $('grade').addEventListener('change', () => {
    state.grade = $('grade').value;
    state.preset = 'custom';
    pushHistory();
    redraw();
  });
  $('ink').addEventListener('input', () => {
    state.ink = Number($('ink').value);
    $('inkVal').textContent = `${Math.round(state.ink * 100)}%`;
    redraw();
  });
  $('ink').addEventListener('change', pushHistory);
  const textFields = ['title', 'tagline', 'quote', 'quoteSource', 'volume', 'ribbon', 'badge'];
  for (const id of textFields) {
    $(id).addEventListener('input', () => {
      state[id] = $(id).value.toUpperCase();
      if (id === 'tagline' || id === 'quoteSource') state[id] = $(id).value;
      redraw();
    });
    $(id).addEventListener('change', pushHistory);
  }
  $('locationTags').addEventListener('change', () => {
    state.locationTags = $('locationTags').checked;
    pushHistory();
    redraw();
  });
  $('stars').addEventListener('input', () => {
    state.stars = Number($('stars').value);
    $('starsVal').textContent = '★'.repeat(state.stars);
    redraw();
  });
  $('stars').addEventListener('change', pushHistory);
  $('zoom').addEventListener('input', () => {
    state.panels[selectedPanel].zoom = Number($('zoom').value);
    redraw();
  });
  $('panX').addEventListener('input', () => {
    state.panels[selectedPanel].ox = Number($('panX').value);
    redraw();
  });
  $('panY').addEventListener('input', () => {
    state.panels[selectedPanel].oy = Number($('panY').value);
    redraw();
  });
  for (const id of ['zoom', 'panX', 'panY']) $(id).addEventListener('change', pushHistory);
  $('shuffle').addEventListener('click', () => {
    const order = state.panels.map((p) => p.photo);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    state.panels.forEach((p, i) => {
      p.photo = order[i];
      const src = photos[order[i]];
      p.place = src.place;
      p.time = src.time;
      p.hook = src.hook;
    });
    state.preset = 'custom';
    pushHistory();
    renderPanelFields();
    redraw();
  });
  $('undo').addEventListener('click', () => {
    if (historyIndex > 0) { historyIndex--; restoreFromHistory(); }
  });
  $('redo').addEventListener('click', () => {
    if (historyIndex < history.length - 1) { historyIndex++; restoreFromHistory(); }
  });
  $('upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = await loadImage(url);
    if (!img) return;
    photos.push({ file: url, label: file.name.replace(/\.[^.]+$/, ''), place: 'YOUR SHOT', time: '7:44 PM', hook: 'STARRING YOU' });
    images.push(img);
    state.panels[selectedPanel].photo = photos.length - 1;
    buildPhotoGrid();
    pushHistory();
    renderPanelFields();
    redraw();
  });
  for (const size of EXPORT_SIZES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'export-btn';
    btn.textContent = `Export PNG ${size.label}`;
    btn.addEventListener('click', () => exportPNG(size.w, size.h));
    $('exports').appendChild(btn);
  }
  canvas.addEventListener('click', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * canvas.width;
    const y = ((e.clientY - r.top) / r.height) * canvas.height;
    const slots = layoutSlots(state.layout, canvas.width, canvas.height);
    const hit = slots.findIndex((s) => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h);
    if (hit >= 0 && hit < layoutById(state.layout).slots) {
      selectedPanel = hit;
      renderPanelFields();
    }
  });
}

function exportPNG(w, h) {
  const out = renderPoster(w, h, state, images);
  out.toBlob((blob) => {
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `neon-coast-${w}x${h}.png`;
    a.click();
    statusEl.textContent = `Saved neon-coast-${w}x${h}.png`;
    window.__lastExport = a.download;
  }, 'image/png');
}

async function init() {
  bindControls();
  images = await Promise.all(photos.map((p) => loadImage(`samples/${p.file}`)));
  buildPhotoGrid();
  applyPreset('sunset-duo');
  pushHistory();
  await document.fonts.ready;
  redraw();
  const params = new URLSearchParams(location.search);
  const shot = params.get('shot');
  if (shot) {
    await runShot(shot, params, {
      applyPreset, redraw, loadImage,
      setCanvasSize: (w, h) => { canvas.width = w; canvas.height = h; },
      getState: () => state,
      setState: (next) => { state = next; syncControls(); renderPanelFields(); redraw(); },
      images: () => images,
    });
  }
}

init();
