// Guard the removed page fills and dimmers without banning functional card,
// answer-selection, progress, whiteboard, or artwork layers.
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const root = path.resolve(__dirname, '..');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'background-layer-contract.json'), 'utf8'));
let failures = 0;
for (const { file, styles } of baseline) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const found = new Map();
  function visit(node, parent) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'ObjectExpression' && parent?.type === 'ObjectProperty') {
      const name = parent.key.name ?? parent.key.value;
      if (styles.includes(name)) {
        const fill = node.properties.find(p => p.type === 'ObjectProperty' && p.key.name === 'backgroundColor');
        if (fill) found.set(name, source.slice(fill.value.start, fill.value.end));
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (['loc', 'start', 'end'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(child => visit(child, node));
      else if (value && typeof value === 'object') visit(value, node);
    }
  }
  visit(parser.parse(source, { sourceType: 'module', plugins: ['typescript', 'jsx'] }));
  for (const name of styles) {
    if (found.has(name) && !/^['"]transparent['"]$/.test(found.get(name))) {
      console.error(`LEGACY BACKGROUND: ${file} ${name}=${found.get(name)}`); failures++;
    }
  }
}
const catalog = fs.readFileSync(path.join(root, 'src/components/jlpt/ApprovedJlptExamCatalog.tsx'), 'utf8');
if (/\bexamStarted\b|\bonStartedChange\b|\bactiveExam\b|<JlptStudyBackground\s+enabled=/.test(catalog)) {
  console.error('JLPT catalog may disable the official backdrop during an exam'); failures++;
}
const layout = fs.readFileSync(path.join(root, 'src/app/_layout.tsx'), 'utf8');
if (!layout.includes('<AppBackdrop pathname={pathname}>') || !layout.includes("contentStyle: { backgroundColor: 'transparent' }")) {
  console.error('Native stack must inherit the official root backdrop'); failures++;
}
if (!layout.includes('ThemeProvider value={officialBackdropTheme}') || !layout.includes("background: 'transparent'")) {
  console.error('React Navigation Screen theme must not paint a default page fill'); failures++;
}
const backdrop = fs.readFileSync(path.join(root, 'src/components/ui/AppBackdrop.tsx'), 'utf8');
const ast = parser.parse(backdrop, {sourceType:'module',plugins:['typescript','jsx']});
const ownerNode = ast.program.body.find(n=>n.type==='ExportNamedDeclaration'&&n.declaration?.id?.name==='ownsSceneBackdrop').declaration;
const owns = new Function('pathname', backdrop.slice(ownerNode.body.start+1, ownerNode.body.end-1));
for(const route of ['/world', ...['hokkaido','tohoku','kanto','chubu','kansai','chugoku','shikoku','kyushu'].map(x=>'/world/'+x)]) {
  if(!owns(route)){console.error('Duplicate shared/map backdrop owner: '+route);failures++;}
}
for(const route of ['/learn','/N5/grammar','/N5/test','/N1/test','/dictionary','/settings']) {
  if(owns(route)){console.error('Shared official backdrop must persist: '+route);failures++;}
}
for(const file of ['FocusedImageBackground.tsx','FocusedArtwork.tsx']) {
  const source = fs.readFileSync(path.join(root,'src/components/ui',file),'utf8');
  if(!source.includes('useArtworkVisible()')){console.error('Hidden scene artwork must unmount: '+file);failures++;}
}
if(!layout.includes('useSyncExternalStore') || !layout.includes("keys.join('\\n')")) {
  console.error('Backdrop visibility must share the active root navigation commit'); failures++;
}
if (failures) process.exit(1);
console.log(`BACKGROUND OWNERSHIP PASS: ${baseline.length} files; ${baseline.reduce((sum, x) => sum + x.styles.length, 0)} removed page/dimmer/content fills; persistent JLPT backdrop contract.`);
