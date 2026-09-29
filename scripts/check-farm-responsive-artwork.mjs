import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scenes = [
  ['map', 'assets/game/farm/background/farm_map_master.png', 'src/components/game/farm/FarmMapWorld.tsx', 853, 1844],
  ['vegetable', 'assets/game/farm/background/vegetable_map_background_v2.png', 'src/components/game/farm/FarmWorld.tsx', 832, 1792],
  ['orchard', 'assets/game/farm/background/orchard_map_background.png', 'src/components/game/farm/OrchardWorld.tsx', 941, 1672],
  ['chicken', 'assets/game/farm/background/chicken_coop_background.png', 'src/components/game/farm/ChickenWorld.tsx', 832, 1792],
  ['cow', 'assets/game/farm/background/cow_barn_background.png', 'src/components/game/farm/CowWorld.tsx', 853, 1844],
];
const viewports = [
  ['small iPhone', 375, 667],
  ['iPhone 16', 393, 852],
  ['Android portrait', 360, 800],
  ['Android landscape', 800, 360],
  ['iPad portrait', 820, 1180],
  ['iPad landscape', 1180, 820],
  ['laptop', 1440, 900],
];
for (const [name, image, component, width, height] of scenes) {
  const bytes = readFileSync(image);
  assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
  assert.equal(bytes.readUInt32BE(16), width, `${name} width differs from source geometry`);
  assert.equal(bytes.readUInt32BE(20), height, `${name} height differs from source geometry`);
  const code = readFileSync(component, 'utf8');
  assert.match(code, /Math\.min\(/, `${name} must fit without cropping`);
  assert.match(code, /resizeMode="contain"/, `${name} must preserve aspect ratio`);
  for (const [device, vw, vh] of viewports) {
    const scale = Math.min(vw / width, vh / height);
    const renderedWidth = width * scale;
    const renderedHeight = height * scale;
    const x = (vw - renderedWidth) / 2;
    const y = (vh - renderedHeight) / 2;
    assert.ok(x >= -0.001 && y >= -0.001, `${name} clipped on ${device}`);
    assert.ok(x + renderedWidth <= vw + 0.001 && y + renderedHeight <= vh + 0.001);
    assert.ok(Math.abs(renderedWidth / renderedHeight - width / height) < 1e-10);
  }
}
for (const name of ['apple_tree', 'grape_vine', 'sapling']) {
  const bytes = readFileSync(`assets/game/farm/orchard/${name}.png`);
  assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
  assert.equal(bytes[25], 6, `${name} must be an RGBA cutout`);
}
console.log(`PASS: ${scenes.length} scene artworks × ${viewports.length} viewport sizes; PNG dimensions and aspect ratios match.`);
