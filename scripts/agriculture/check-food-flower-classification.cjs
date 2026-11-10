// Actual component SSR and strict current-source guards; no browser/device acceptance.
const fs = require('fs'), path = require('path'), cp = require('child_process'), vm = require('vm'), assert = require('assert/strict');
const ts = require('typescript'), React = require('react'), server = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const out = process.env.AGRI_FOOD_FLOWER_QA;
assert(out, 'Set AGRI_FOOD_FLOWER_QA to a private QA output directory');
fs.mkdirSync(out, {recursive: true});
const cache = new Map();
const read = p => fs.existsSync(path.join(root, p)) ? fs.readFileSync(path.join(root, p), 'utf8') : cp.execFileSync('git', ['show', `HEAD:${p}`], {cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024});
const json = p => {if (!cache.has(p)) cache.set(p, JSON.parse(read(p))); return cache.get(p);};
const clone = x => JSON.parse(JSON.stringify(x));
const data = json('src/data/agriculture/food-flower-classification-native.json');
const content = json('src/data/agriculture/lessons.ja.json');
const languages = ['en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'];
const source = read('src/components/agriculture/FoodFlowerClassificationSupport.tsx');
const js = ts.transpileModule(source, {reportDiagnostics: true, compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, target: ts.ScriptTarget.ES2020}});
assert(!js.diagnostics.some(d => d.category === ts.DiagnosticCategory.Error));
function styles(input, view) {
  const native = Array.isArray(input) ? Object.assign({}, ...input) : {...input};
  const result = view ? {display: 'flex', flexDirection: 'column', boxSizing: 'border-box', flexShrink: 0} : {display: 'block', margin: 0, overflowWrap: 'anywhere'};
  for (const [key, value] of Object.entries(native || {})) {
    if (key === 'paddingHorizontal' || key === 'marginHorizontal') {const k = key.startsWith('padding') ? 'padding' : 'margin'; result[k + 'Left'] = value; result[k + 'Right'] = value;}
    else if (key === 'paddingVertical' || key === 'marginVertical') {const k = key.startsWith('padding') ? 'padding' : 'margin'; result[k + 'Top'] = value; result[k + 'Bottom'] = value;}
    else result[key] = key === 'lineHeight' && typeof value === 'number' ? `${value}px` : value;
  }
  return result;
}
const host = tag => ({children, style, testID, accessibilityLabel, accessibilityRole}) => React.createElement(tag, {style: styles(style, tag === 'div'), 'data-testid': testID, 'aria-label': accessibilityLabel, role: accessibilityRole}, children);
function compile(options = {}) {
  const module = {exports: {}};
  vm.runInNewContext(js.outputText, {module, exports: module.exports, require: id => {
    if (id === 'react') return React;
    if (id === 'react-native') return {View: host('div'), Text: host('span')};
    if (id.endsWith('food-flower-classification-native.json')) return options.data || data;
    if (id.endsWith('lessons.ja.json')) return options.content || content;
    if (id.endsWith('/translations')) return {agricultureLocaleTranslations: lang => {
      const entries = clone(json(`src/data/agriculture/translations/${lang}.json`));
      options.translationMutation?.(entries, lang);
      return entries;
    }};
    throw new Error('Unexpected dependency ' + id);
  }});
  return module.exports;
}
const api = compile();
assert(!api.isFoodFlowerClassificationContext('unknown'));
assert(Object.keys(data.entries).every(id => api.isFoodFlowerClassificationContext(id)));
const colors = {text: '#173750', translation: '#F2F0E5', translationText: '#173750', border: '#B38432'};
let renders = 0, translatedGroups = 0, rejects = 0, nativeLabels = 0;
const examples = [11, 25];
const ids = Object.keys(data.entries);
for (const [index, lessonId] of ids.entries()) {
  const entry = data.entries[lessonId], lesson = content.lessons.find(l => l.id === lessonId);
  assert.deepEqual(entry.lessonSnapshot, lesson);
  assert.equal(entry.rows.length, 8);
  for (const level of entry.scopeLevels) for (const language of ['ja', ...languages]) {
    assert(api.foodFlowerClassificationLabels(lessonId, lesson.sourceHash, lesson.revision, level, language));
    for (const showTranslation of [false, true]) for (const [width, height] of [[375, 812], [812, 375], [768, 1024], [1440, 900]]) {
      const html = server.renderToStaticMarkup(React.createElement(api.FoodFlowerClassificationSupport, {lessonId, lessonSourceHash: lesson.sourceHash, lessonRevision: lesson.revision, level, language, showTranslation, colors}));
      assert.equal((html.match(/data-testid="agri-food-flower-row-/g) || []).length, 8);
      assert.equal((html.match(/data-testid="agri-food-flower-example"/g) || []).length, examples[index]);
      const groups = (html.match(/data-testid="agri-food-flower-canonical-/g) || []).length;
      assert.equal(groups, showTranslation && language !== 'ja' ? 6 : 0);
      if (!showTranslation || language === 'ja') assert(!html.includes(`-${language}"`));
      assert(html.includes('max-width:100%'));
      renders++; translatedGroups += groups; nativeLabels += (html.match(/agri-food-flower-ruby-/g) || []).length;
      if (showTranslation && ['vi', 'my'].includes(language) && [375, 1440].includes(width)) {
        fs.writeFileSync(path.join(out, `${index + 1}-${language}-${width}.html`), `<!doctype html><meta charset="utf-8"><style>@page{size:${width}px 1600px;margin:12px}body{margin:0;background:#FFFAEF;font-family:'Noto Sans CJK JP','Noto Sans Myanmar',sans-serif;width:${width - 24}px}*{box-sizing:border-box}</style>${html}`);
      }
    }
  }
  const good = [lessonId, lesson.sourceHash, lesson.revision, entry.scopeLevels[0]];
  const badCalls = [[lessonId, 'stale', lesson.revision, good[3]], [lessonId, lesson.sourceHash, 'stale', good[3]], [lessonId, lesson.sourceHash, undefined, good[3]], [lessonId, lesson.sourceHash, lesson.revision, '1'], ['unknown', ...good.slice(1)], [...good, []], [...good, [lesson.paragraphs[0].id]]];
  for (const args of badCalls) {assert.equal(api.foodFlowerClassificationEntry(...args), null); rejects++;}
  for (const mutation of [x => {x.lessons.find(l => l.id === lessonId).paragraphs[0].textJa += '変更';}, x => {x.lessons.find(l => l.id === lessonId).objectiveJa += '変更';}, x => {x.lessons.find(l => l.id === lessonId).levels = ['1'];}]) {
    const changed = clone(content); mutation(changed); assert.equal(compile({content: changed}).foodFlowerClassificationEntry(...good), null); rejects++;
  }
  for (const mutation of [d => {d.studyOnly = false;}, d => {d.kind = 'other';}, d => {d.entries[lessonId].rows[0].examplesJa = ['別の植物'];}, d => {d.entries[lessonId].rows.pop();}, d => {d.locales.ja.category += '変更';}, d => {d.readingsKana.category = '分類';}]) {
    const changed = clone(data); mutation(changed); assert.equal(compile({data: changed}).foodFlowerClassificationEntry(...good), null); rejects++;
  }
  for (const language of languages) {const changed = clone(data); changed.localeSourceJapanese[language].category = 'stale'; assert.equal(compile({data: changed}).foodFlowerClassificationLabels(...good, language), null); rejects++;}
  for (const language of languages) for (const staleHash of [true, false]) {
    const changed = compile({translationMutation: entries => {if (staleHash) entries[lessonId].sourceHash = 'stale'; else entries[lessonId].paragraphs[lesson.paragraphs[0].id] += 'changed';}});
    assert.equal(changed.foodFlowerClassificationLabels(...good, language), null); rejects++;
    assert(changed.foodFlowerClassificationLabels(...good, 'ja'));
  }
}
// Isolated strict TS/prop contract; explicit RN ambient does not certify production RN styling.
fs.writeFileSync(path.join(out, 'ambient.d.ts'), "declare module 'react' { const React: {createElement: (...args: any[]) => any}; export default React; }\ndeclare module 'react-native' {export const Text: (props: any) => any; export const View: (props: any) => any;}\ndeclare module '@/data/agriculture/lessons.ja.json' {const value: {lessons: any[]}; export default value;}\ndeclare module '@/data/agriculture/food-flower-classification-native.json' {const value: unknown; export default value;}\ndeclare module '@/data/agriculture/translations' {export function agricultureLocaleTranslations(locale: string): Record<string, {sourceHash: string; title: string; objective: string; paragraphs: Record<string, string>; paragraphTitles: Record<string, string>; activity: string}> | null;}\ndeclare namespace JSX {interface Element {} interface ElementChildrenAttribute {children: {}} interface IntrinsicAttributes {key?: string | number}}\n");
fs.writeFileSync(path.join(out, 'type-props.tsx'), "import React from 'react';\nimport {FoodFlowerClassificationSupport} from '/workspace/scratch/ba446b40eb3c/japan-app/src/components/agriculture/FoodFlowerClassificationSupport';\nconst colors = {text:'#123',translation:'#fff',translationText:'#123',border:'#abc'};\n<FoodFlowerClassificationSupport lessonId=\"lesson\" lessonSourceHash=\"hash\" colors={colors} />;\n// @ts-expect-error Source hash must be a string.\n<FoodFlowerClassificationSupport lessonId=\"lesson\" lessonSourceHash={17} colors={colors} />;\n// @ts-expect-error Translation toggle must be boolean.\n<FoodFlowerClassificationSupport lessonId=\"lesson\" lessonSourceHash=\"hash\" colors={colors} showTranslation=\"yes\" />;\n// @ts-expect-error Partial scope must contain paragraph ID strings.\n<FoodFlowerClassificationSupport lessonId=\"lesson\" lessonSourceHash=\"hash\" colors={colors} paragraphIds={[1]} />;\n".replaceAll('/workspace/scratch/ba446b40eb3c/japan-app', root));
const program = ts.createProgram([path.join(root, 'src/components/agriculture/FoodFlowerClassificationSupport.tsx'), path.join(out, 'ambient.d.ts'), path.join(out, 'type-props.tsx')], {strict: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, types: []});
assert.equal(ts.getPreEmitDiagnostics(program).length, 0);
const result = {PASS: true, exactSourceContexts: ids.length, sourceRows: 16, namedExampleOccurrences: 36, actualComponentSSRRenders: renders, exactCanonicalTranslatedGroups: translatedGroups, nativeReadingLabelOccurrences: nativeLabels, staleTypeScopePartialOrTranslationRejects: rejects, sourcePixelRedo: 0, strictIsolatedComponentAndPropContract: true, rejectedWrongPropTypes: 3, claim: 'Actual TSX component SSR with explicit RN structural/CSS host adapters; not browser, native phone, domain or release acceptance'};
fs.writeFileSync(path.join(out, 'result.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));
