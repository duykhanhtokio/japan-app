import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const scenes = [
  { name: 'map', component: 'FarmMapWorld.tsx', portrait: ['farm_map_master.png', 853, 1844], landscape: ['farm_map_landscape_v1.png', 1672, 941], tablet: ['farm_map_tablet_landscape_v1.png', 1448, 1086] },
  { name: 'vegetable', component: 'FarmWorld.tsx', portrait: ['vegetable_map_background_v2.png', 832, 1792], landscape: ['vegetable_map_landscape_v1.png', 1672, 940] },
  { name: 'orchard', component: 'OrchardWorld.tsx', portrait: ['orchard_map_background.png', 941, 1672], landscape: ['orchard_map_landscape_v1.png', 1672, 941] },
  { name: 'chicken', component: 'ChickenWorld.tsx', portrait: ['chicken_coop_background.png', 832, 1792], landscape: ['chicken_coop_landscape_v1.png', 1672, 941] },
  { name: 'cow', component: 'CowWorld.tsx', portrait: ['cow_barn_background.png', 853, 1844], landscape: ['cow_barn_landscape_v1.png', 1672, 941] },
];
const viewports = [
  ['small iPhone', 375, 667], ['iPhone 16', 393, 852], ['Android portrait', 360, 800],
  ['Android landscape', 800, 360], ['iPad portrait', 820, 1180],
  ['iPad landscape', 1180, 820], ['laptop', 1440, 900],
];
const orchardWide = [[.25,.43,.13,.13/1.12*1672/941],[.62,.43,.13,.13/1.12*1672/941],[.25,.67,.13,.13/1.12*1672/941],[.62,.67,.13,.13/1.12*1672/941]];
const vegetableWide = [[.26,.34,.22,.12],[.53,.34,.22,.12],[.22,.48,.26,.13],[.53,.48,.26,.13],[.18,.64,.29,.14],[.54,.64,.29,.14]];
const mapWide = [[.22,.28,.20,.25],[.49,.30,.23,.24],[.19,.52,.24,.25],[.80,.48,.23,.26],[.20,.75,.28,.23],[.52,.74,.19,.20],[.84,.76,.22,.22]];
const mapTablet = [[.25,.27,.22,.22],[.49,.33,.24,.22],[.23,.48,.25,.22],[.77,.47,.23,.25],[.22,.72,.27,.22],[.49,.72,.19,.19],[.77,.73,.23,.22]];
function imageGeometry(viewWidth, viewHeight, sourceWidth, sourceHeight) {
  const scale = Math.max(viewWidth / sourceWidth, viewHeight / sourceHeight);
  const width = sourceWidth * scale, height = sourceHeight * scale;
  const x = (viewWidth - width) / 2, y = (viewHeight - height) / 2;
  assert.ok(x <= 0.001 && y <= 0.001);
  assert.ok(x + width >= viewWidth - 0.001 && y + height >= viewHeight - 0.001);
  assert.ok(Math.abs(width / height - sourceWidth / sourceHeight) < 1e-10);
  return { x, y, width, height };
}
function checkRect(name, device, vw, vh, g, [x,y,w,h], center=false) {
  const left = g.x + (center ? x - w / 2 : x) * g.width;
  const top = g.y + (center ? y - h / 2 : y) * g.height;
  const right = left + w * g.width, bottom = top + h * g.height;
  assert.ok(left >= -1 && top >= -1 && right <= vw + 1 && bottom <= vh + 1,
    `${name} interactive area clipped on ${device}: ${[left,top,right,bottom].map(Math.round).join(',')}`);
}
for (const scene of scenes) {
  const code = readFileSync(`src/components/game/farm/${scene.component}`, 'utf8');
  assert.match(code, /Math\.max\(/, `${scene.name} needs cover geometry`);
  assert.match(code, /style=\{\[StyleSheet\.absoluteFill,\{width:'100%',height:'100%'\}\]\}/, `${scene.name} needs an image on the first render`);
  assert.doesNotMatch(code, /blurRadius\s*=/, `${scene.name} has a blurred fallback`);
  assert.match(code, /LANDSCAPE_/, `${scene.name} needs landscape art and coordinate mapping`);
  for (const variant of [scene.portrait, scene.landscape, scene.tablet].filter(Boolean)) {
    const [file, width, height] = variant;
    const bytes = readFileSync(`assets/game/farm/background/${file}`);
    assert.equal(bytes.toString('ascii', 1, 4), 'PNG', file);
    assert.equal(bytes.readUInt32BE(16), width, `${file} width`);
    assert.equal(bytes.readUInt32BE(20), height, `${file} height`);
  }
  for (const [device, vw, vh] of viewports) {
    const wide = vw > vh;
    const variant = !wide ? scene.portrait : scene.tablet && vw / vh < 1.55 ? scene.tablet : scene.landscape;
    const [, width, height] = variant;
    const g = imageGeometry(vw, vh, width, height);
    if (wide && scene.name === 'orchard') orchardWide.forEach(rect => checkRect(scene.name,device,vw,vh,g,rect));
    if (wide && scene.name === 'vegetable') vegetableWide.forEach(rect => checkRect(scene.name,device,vw,vh,g,rect));
    if (wide && scene.name === 'map') (variant === scene.tablet ? mapTablet : mapWide).forEach(rect => checkRect(scene.name,device,vw,vh,g,rect,true));
  }
}
const orchardCode = readFileSync('src/components/game/farm/OrchardWorld.tsx', 'utf8');
const frameStyle = orchardCode.match(/frame: \{([\s\S]*?)\n        \},/);
assert.ok(frameStyle);
assert.doesNotMatch(frameStyle[1], /margin|borderWidth|borderRadius|padding/);
assert.match(frameStyle[1], /width:\s*'100%'/);
for (const name of ['apple_tree', 'grape_vine', 'sapling']) {
  const bytes = readFileSync(`assets/game/farm/orchard/${name}.png`);
  assert.equal(bytes.toString('ascii', 1, 4), 'PNG');
  assert.equal(bytes[25], 6);
}
console.log(`PASS: ${scenes.length} scenes × ${viewports.length} viewports; sharp cover artwork and tested landscape controls fit.`);
