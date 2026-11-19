// Fixed scenes for screenshots: ?shot=cover shows the Sunset Duo poster alone,
// ?shot=editor shows the app in the browser with the duo poster loaded,
// ?shot=story shows the Sunset Chase poster alone, ?shot=poster shows the
// Neon Coast poster alone. window.__shotReady is set once painted.

const SCENES = {
  cover: { preset: 'sunset-duo', w: 1280, h: 720, coverOnly: true },
  story: { preset: 'sunset-chase', w: 1280, h: 720, coverOnly: true },
  poster: { preset: 'neon-coast', w: 1280, h: 720, coverOnly: true },
  editor: { preset: 'sunset-duo', w: 1080, h: 1080, coverOnly: false },
};

export async function runShot(shot, query, env) {
  const scene = SCENES[shot] ?? SCENES.cover;
  if (scene.coverOnly) document.body.classList.add('shot-cover');
  env.setCanvasSize(scene.w, scene.h);
  env.applyPreset(scene.preset);
  await document.fonts.ready;
  env.redraw();
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  window.__shotReady = true;
}
