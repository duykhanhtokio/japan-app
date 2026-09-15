import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const projectRoot = process.cwd();
const sourceRoot = join(projectRoot, 'src');
const outputPath = join(projectRoot, 'UI_DESIGN_SYSTEM_AUDIT.json');
const strict = process.argv.includes('--strict');
const codeExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);
const ignoredGeneratedSegments = ['/data/generated/', '/technical-intern-translations/'];

const patterns = {
  hardcodedColor: /(?:backgroundColor|borderColor|color|shadowColor)\s*:\s*['"](?:#[\da-fA-F]{3,8}|rgba?\([^'"]+\))/g,
  nativeBorder: /(?:borderWidth|borderTopWidth|borderRightWidth|borderBottomWidth|borderLeftWidth)\s*:/g,
  numericFontSize: /fontSize\s*:\s*(\d+(?:\.\d+)?)/g,
  numericFontWeight: /fontWeight\s*:\s*['"]?(?:[1-9]00|bold|normal)['"]?/g,
  legacyGlyphControl: /[‹›←→🔒💡]/g,
};

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await walk(path));
    else if (codeExtensions.has(extname(entry.name))) result.push(path);
  }
  return result;
}

function lineNumber(text, index) {
  return text.slice(0, index).split('\n').length;
}

function collect(text, expression) {
  return [...text.matchAll(expression)].map((match) => ({
    line: lineNumber(text, match.index ?? 0),
    sample: match[0].slice(0, 100),
  }));
}

const files = (await walk(sourceRoot)).filter((path) => {
  const normalized = `/${relative(projectRoot, path).replaceAll('\\', '/')}`;
  return !ignoredGeneratedSegments.some((segment) => normalized.includes(segment));
});

const rows = [];
for (const path of files) {
  const text = await readFile(path, 'utf8');
  if (!text.includes('StyleSheet.create') && !text.includes('<Pressable') && !text.includes('<Text')) continue;
  const rel = relative(projectRoot, path).replaceAll('\\', '/');
  const violations = Object.fromEntries(
    Object.entries(patterns).map(([name, expression]) => [name, collect(text, expression)]),
  );
  const count = Object.values(violations).reduce((sum, list) => sum + list.length, 0);
  rows.push({
    path: rel,
    sha256: createHash('sha256').update(text).digest('hex'),
    usesRoyalSurface: /Royal(?:Surface|Positioning)/.test(text),
    usesRoyalFont: /ROYAL_FONT/.test(text),
    violationCount: count,
    violations,
  });
}

rows.sort((a, b) => b.violationCount - a.violationCount || a.path.localeCompare(b.path));
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  scope: 'production src only; generated knowledge data excluded',
  target: 'Royal A+F 2.5D',
  decisions: {
    homeHudHeight: 170,
    wideButtonAsset: 'button-wide-v2.png',
    allPlayerVisibleArtwork2_5D: true,
  },
  totals: {
    inspectedFiles: rows.length,
    filesUsingRoyalSurface: rows.filter((row) => row.usesRoyalSurface).length,
    filesUsingRoyalFont: rows.filter((row) => row.usesRoyalFont).length,
    violations: rows.reduce((sum, row) => sum + row.violationCount, 0),
    cleanFiles: rows.filter((row) => row.violationCount === 0).length,
  },
  files: rows,
};

await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report.totals, null, 2));
console.log(`Report: ${outputPath}`);
if (strict && report.totals.violations > 0) process.exitCode = 1;
