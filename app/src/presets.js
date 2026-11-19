// Neon Coast — Poster Cover Studio: data.
// Every photo was made with an image model in this session: original fictional
// people and places, golden-hour light throughout, no Rockstar art, no real
// GTA characters. Captions are original story lines written for this app.

export const PHOTOS = [
  { file: 'duo.jpg', label: 'Sunset Duo', place: 'OCEAN DRIVE', time: '7:44 PM', hook: 'TWO OUTLAWS. ONE SUNSET.' },
  { file: 'marina.jpg', label: 'Marina', place: 'MARINA DEL SOL', time: '7:40 PM', hook: 'NO WITNESSES' },
  { file: 'street.jpg', label: 'Boulevard', place: 'PALM BOULEVARD', time: '8:15 PM', hook: 'LIGHTS OUT' },
  { file: 'convertible.jpg', label: 'Convertible', place: 'COAST HIGHWAY', time: '6:58 PM', hook: 'FULL THROTTLE' },
  { file: 'chase.jpg', label: 'Sunset Chase', place: 'SUNSET HEIGHTS', time: '7:02 PM', hook: 'EVERY STREET IS A STAGE' },
  { file: 'tower.jpg', label: 'Lifeguard Tower', place: 'TOWER 2', time: '6:10 PM', hook: 'LAST SWIM' },
  { file: 'palm.jpg', label: 'Palm Row', place: 'PALM ROW', time: '6:42 PM', hook: 'LOOKING FOR TROUBLE' },
  { file: 'motel.jpg', label: 'Neon Motel', place: 'MOTEL NEON', time: '8:40 PM', hook: 'VACANCY FOR TWO' },
  { file: 'pier.jpg', label: 'Pier', place: 'PIER 26', time: '7:12 PM', hook: 'GONE FISHING' },
  { file: 'fisherman.jpg', label: 'Fisherman', place: 'ROCKY POINT', time: '6:25 PM', hook: 'ONE LAST CAST' },
  { file: 'road.jpg', label: 'Coast Road', place: 'COAST ROAD', time: '7:05 PM', hook: 'NO TURNING BACK' },
  { file: 'bonfire.jpg', label: 'Bonfire', place: 'BONFIRE BEACH', time: '8:50 PM', hook: 'STORIES IN THE SMOKE' },
  { file: 'skyline.jpg', label: 'Skyline', place: 'LEONIDA SKYLINE', time: '7:20 PM', hook: 'EVERY LIGHT TELLS A STORY' },
  { file: 'gas.jpg', label: 'Neon Gas', place: 'NEON GAS', time: '8:05 PM', hook: 'FILL IT UP AND GO' },
  { file: 'boat.jpg', label: 'Golden Wake', place: 'GOLDEN WAKE', time: '6:47 PM', hook: 'OUTRUN THE SUN' },
  { file: 'surfer.jpg', label: 'Surfer', place: 'SURF BREAK', time: '6:15 PM', hook: 'LAST WAVE' },
  { file: 'boardwalk.jpg', label: 'Boardwalk', place: 'BOARDWALK', time: '7:55 PM', hook: 'COTTON CANDY SKIES' },
  { file: 'rooftop.jpg', label: 'Rooftop', place: 'ROOFTOP 9', time: '8:30 PM', hook: 'BIG MONEY' },
  { file: 'vintage.jpg', label: 'Chrome Detail', place: 'CHROME DETAIL', time: '7:33 PM', hook: 'SHINE LIKE GOLD' },
  { file: 'neon.jpg', label: 'Neon Row', place: 'NEON ROW', time: '8:20 PM', hook: 'THE NIGHT STARTS HERE' },
];

export const LAYOUTS = [
  { id: 'collage9', name: 'Collage 9 · Duo Center', slots: 9 },
  { id: 'grid3x3', name: 'Grid 3 x 3', slots: 9 },
  { id: 'heroLeft', name: 'Hero Left + 4', slots: 5 },
  { id: 'heroRight', name: 'Hero Right + 4', slots: 5 },
  { id: 'mosaic8', name: 'Mosaic 8', slots: 8 },
  { id: 'strip3', name: 'Hero + 3 Strip', slots: 4 },
  { id: 'fullbleed', name: 'Full Bleed', slots: 1 },
];

export const GRADES = [
  { id: 'sunset', name: 'Sunset', filter: 'saturate(1.3) contrast(1.08)', tint: 'rgba(255,110,40,0.14)', ink: 0 },
  { id: 'golden', name: 'Golden Hour', filter: 'saturate(1.35) contrast(1.05) sepia(0.18)', tint: 'rgba(255,170,40,0.16)', ink: 0 },
  { id: 'neon', name: 'Neon', filter: 'saturate(1.5) contrast(1.12)', tint: 'rgba(255,40,160,0.12)', ink: 0 },
  { id: 'miami', name: 'Miami', filter: 'saturate(1.4) contrast(1.1)', tint: 'rgba(255,80,180,0.14)', ink: 0 },
  { id: 'vice', name: 'Vice', filter: 'saturate(1.25) contrast(1.1)', tint: 'rgba(120,40,200,0.16)', ink: 0 },
  { id: 'mono', name: 'Mono Warm', filter: 'grayscale(1) contrast(1.15)', tint: 'rgba(255,200,140,0.10)', ink: 0 },
  { id: 'poster-ink', name: 'Poster Ink', filter: 'saturate(1.2) contrast(1.28)', tint: 'rgba(255,60,140,0.10)', ink: 0.55 },
  { id: 'ink-strong', name: 'Ink Strong', filter: 'saturate(1.35) contrast(1.6)', tint: 'rgba(255,30,150,0.18)', ink: 0.85 },
];

export const EXPORT_SIZES = [
  { id: '1080x1080', w: 1080, h: 1080, label: '1080 x 1080' },
  { id: '1080x1350', w: 1080, h: 1350, label: '1080 x 1350' },
  { id: '1920x1080', w: 1920, h: 1080, label: '1920 x 1080' },
];

// A panel assignment: photo index into PHOTOS plus its story caption and framing.
function panel(photo, ox = 0.5, oy = 0.5, zoom = 1) {
  const p = PHOTOS[photo];
  return { photo, place: p.place, time: p.time, hook: p.hook, ox, oy, zoom };
}

export const PRESETS = [
  {
    id: 'sunset-duo', name: 'Sunset Duo', layout: 'collage9', grade: 'ink-strong', ink: 0.8,
    title: 'SUNSET DUO', tagline: 'TWO OUTLAWS. ONE SUNSET.',
    quote: 'NEON, SUN AND ONE LAST SCORE', quoteSource: 'THE LEONIDA LEDGER',
    volume: 'VOL. 01', ribbon: "COLLECTOR'S EDITION", badge: 'SUMMER 2026',
    panels: [
      panel(2, 0.5, 0.45), panel(1, 0.5, 0.5), panel(5, 0.5, 0.5),
      panel(6, 0.5, 0.5), panel(0, 0.5, 0.42), panel(8, 0.5, 0.5),
      panel(12, 0.5, 0.5), panel(3, 0.5, 0.5), panel(11, 0.5, 0.5),
    ],
  },
  {
    id: 'sunset-chase', name: 'Sunset Chase', layout: 'heroLeft', grade: 'ink-strong', ink: 0.8,
    title: 'SUNSET CHASE', tagline: 'EVERY STREET IS A STAGE',
    quote: 'FULL THROTTLE AT GOLDEN HOUR', quoteSource: 'THE LEONIDA LEDGER',
    volume: 'VOL. 02', ribbon: "COLLECTOR'S EDITION", badge: 'SUMMER 2026',
    panels: [
      panel(4, 0.5, 0.5), panel(10, 0.5, 0.5), panel(3, 0.5, 0.5),
      panel(18, 0.5, 0.5), panel(13, 0.5, 0.5), panel(19, 0.5, 0.5),
      panel(2, 0.5, 0.5), panel(14, 0.5, 0.5), panel(12, 0.5, 0.5),
    ],
  },
  {
    id: 'neon-coast', name: 'Neon Coast', layout: 'grid3x3', grade: 'neon', ink: 0.35,
    title: 'NEON COAST', tagline: 'ONE COAST. NO RULES.',
    quote: 'A FEVER DREAM IN NEON', quoteSource: 'THE LEONIDA LEDGER',
    volume: 'VOL. 03', ribbon: 'NEON PRESS', badge: 'EST. 2026',
    panels: [
      panel(19, 0.5, 0.5), panel(7, 0.5, 0.5), panel(13, 0.5, 0.5),
      panel(2, 0.5, 0.5), panel(0, 0.5, 0.42), panel(17, 0.5, 0.5),
      panel(12, 0.5, 0.5), panel(16, 0.5, 0.5), panel(8, 0.5, 0.5),
    ],
  },
  {
    id: 'golden-hour', name: 'Golden Hour', layout: 'mosaic8', grade: 'golden', ink: 0.25,
    title: 'GOLDEN HOUR', tagline: 'EVERY LIGHT TELLS A STORY',
    quote: 'THE SUN NEVER SETS ON THIS COAST', quoteSource: 'THE LEONIDA LEDGER',
    volume: 'VOL. 04', ribbon: 'GOLDEN PRESS', badge: 'SUMMER 2026',
    panels: [
      panel(6, 0.5, 0.5), panel(15, 0.5, 0.5), panel(5, 0.5, 0.5),
      panel(11, 0.5, 0.5), panel(10, 0.5, 0.5), panel(14, 0.5, 0.5),
      panel(9, 0.5, 0.5), panel(1, 0.5, 0.5), panel(4, 0.5, 0.5),
    ],
  },
  {
    id: 'vice-nights', name: 'Vice Nights', layout: 'strip3', grade: 'vice', ink: 0.3,
    title: 'VICE NIGHTS', tagline: 'ONE CITY. EVERY LIGHT TELLS A STORY.',
    quote: 'AFTER DARK, THE COAST BELONGS TO US', quoteSource: 'THE LEONIDA LEDGER',
    volume: 'VOL. 05', ribbon: 'NIGHT PRESS', badge: 'EST. 2026',
    panels: [
      panel(17, 0.5, 0.5), panel(19, 0.5, 0.5), panel(7, 0.5, 0.5),
      panel(13, 0.5, 0.5), panel(0, 0.5, 0.42), panel(2, 0.5, 0.5),
      panel(12, 0.5, 0.5), panel(16, 0.5, 0.5), panel(8, 0.5, 0.5),
    ],
  },
];

export function gradeById(id) {
  return GRADES.find((g) => g.id === id) ?? GRADES[0];
}

export function layoutById(id) {
  return LAYOUTS.find((l) => l.id === id) ?? LAYOUTS[0];
}

export function presetById(id) {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0];
}
