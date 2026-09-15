import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src');
const failures = [];
let checkedFiles = 0;

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(target);
      continue;
    }
    if (!entry.name.endsWith('.tsx')) continue;

    checkedFiles += 1;
    const source = await readFile(target, 'utf8');
    const relative = path.relative(process.cwd(), target);

    if (source.includes('router.back()') && !source.includes('<RoyalBackButton')) {
      failures.push(`${relative}: router.back() must use RoyalBackButton`);
    }

    for (const match of source.matchAll(/<RoyalChevron\b[^>]*>/gs)) {
      if (/\bstyle\s*=/.test(match[0])) {
        failures.push(`${relative}: RoyalChevron size/position must use its shared variant`);
      }
    }

    if (/onPress\s*=\{[^}]*router\.back\(\)[\s\S]{0,180}[‹←]/m.test(source)) {
      failures.push(`${relative}: text-glyph back control is not allowed`);
    }

    if (/src[\\/]app[\\/]register(?:[\\/]work)?\.tsx$/.test(relative)) {
      for (const match of source.matchAll(/<Royal(Field|TitlePanel|OptionRow)\b[^>]*>/gs)) {
        if (!/\bsizingGroup\s*=/.test(match[0])) {
          failures.push(`${relative}: ${match[1]} must declare a semantic sizingGroup`);
        }
      }
      for (const match of source.matchAll(/<RoyalButton\b[^>]*style=\{styles\.(nextButton|completeButton)\}[^>]*>/gs)) {
        if (!/\bsizingGroup\s*=/.test(match[0])) {
          failures.push(`${relative}: registration final action must declare a semantic sizingGroup`);
        }
      }
    }

    if (relative.endsWith('src/app/register/work.tsx')) {
      const occupationCountUses = source.match(/japaneseCopy\.occupationCount/g)?.length ?? 0;
      const operationCountUses = source.match(/japaneseCopy\.operationCount/g)?.length ?? 0;
      if (occupationCountUses !== 0) {
        failures.push(`${relative}: 業種 selector must not restore the secondary 職種/count line`);
      }
      if (operationCountUses !== 0) {
        failures.push(`${relative}: 職種 selector must not restore the secondary 作業/count line`);
      }
      if (/operation\.code/.test(source)) failures.push(`${relative}: 作業 rows must not display numeric official codes`);
      if (/label=\{\`\$\{bilingual\(japaneseCopy\.(category|occupation|operation)/.test(source)) failures.push(`${relative}: blue work-field plaques must stay Japanese-only`);
      if (/<RoyalField\s+compact\s+wideLabel/.test(source)) failures.push(`${relative}: short Japanese work plaques must match the compact 国籍 plaque`);
    }

    if (relative.endsWith('src/components/ui/RoyalSurface.tsx')) {
      if (!/backAsset:\{[^}]*alignSelf:'flex-start'/.test(source)) {
        failures.push(`${relative}: shared back control must stay top-aligned in every row header`);
      }
      if (!source.includes('equalHeight.height - topInset')) {
        failures.push(`${relative}: grouped height must be applied to the visible Royal frame, not only its wrapper`);
      }
      if (/fieldLabelText:\{width:'100%'|infoPlaqueText:\{width:'100%'/.test(source)) {
        failures.push(`${relative}: absolute plaque text cannot use percentage width`);
      }
    }

    if (relative.endsWith('src/components/app/GameHeader.tsx')) {
      if (/\bheight:\s*96\b/.test(source)) {
        failures.push(`${relative}: HUD must use content-driven minimum heights without clipping`);
      }
      if (/LV\.|\bEXP\b/.test(source)) failures.push(`${relative}: approved Home HUD must not restore LV or EXP copy`);
      for (const asset of ['hud-player-medallion-v1.png','hud-coin-v1.png','map-marker-fill-v1.png']) if (!source.includes(asset)) failures.push(`${relative}: missing Royal HUD asset ${asset}`);
      if (!source.includes('nameFrame') || !source.includes('energyStack')) failures.push(`${relative}: Home HUD must preserve the approved framed-name and vertically stacked rail structure`);
    }

    if (relative.endsWith('src/components/app/BottomNav.tsx')) {
      if (/backgroundColor|borderWidth|borderTopWidth|⌂|🎮|✓|♙/.test(source)) failures.push(`${relative}: bottom HUD must remain raster-backed Royal A+F UI`);
      for (const asset of ['nav-home-v1.png','nav-game-v1.png','nav-mission-v1.png','nav-profile-v1.png']) if (!source.includes(asset)) failures.push(`${relative}: missing Royal navigation asset ${asset}`);
    }

    if (relative.endsWith('src/app/portal.tsx')) {
      if (/<Text \{\.\.\.ROYAL_TEXT_FIT\}[^>]*style=\{styles\.titleEn\}/.test(source)) failures.push(`${relative}: portal English heading must not auto-shrink below the shared 12 px standard`);
    }

    if (relative.endsWith('src/components/world/ResponsiveWorldMap.tsx')) {
      if (/markerCapsule:\{[^}]*height:'100%'/.test(source)) {
        failures.push(`${relative}: map marker frame must grow around both Japanese and English`);
      }
      if (!source.includes('RoyalMapPill') || !source.includes('color={item.color}')) failures.push(`${relative}: map markers must use land-colored raster interiors`);
      if (/markerCapsule:\{[^}]*paddingHorizontal/.test(source)) failures.push(`${relative}: map marker outer width must not be inflated beyond its gold frame`);
    }

    if (relative.endsWith('src/app/world/prefecture/[prefectureId].tsx')) {
      if (!source.includes('height:grid.cardWidth/3')) failures.push(`${relative}: city wrappers need an explicit 3:1 measured height so every row remains in ScrollView layout`);
      if (!source.includes('style={s.backRow}') || /<View style={s.header}>/.test(source)) failures.push(`${relative}: prefecture title must remain independent and full-width`);
    }
  }
}

await walk(root);

if (failures.length) {
  console.error(`Royal control audit failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Royal control audit passed: ${checkedFiles} TSX files checked.`);
}
