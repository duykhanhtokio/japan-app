// Actual component SSR and strict current-source guards; no browser/device acceptance.
const fs = require('fs'), path = require('path'), cp = require('child_process'), vm = require('vm'), assert = require('assert/strict');
const ts = require('typescript'), React = require('react'), server = require('react-dom/server');
const root = path.resolve(__dirname, '../..');
const out = process.env.AGRI_FOOD_GAPS_QA;
assert(out, 'Set AGRI_FOOD_GAPS_QA to a private QA output directory');
fs.mkdirSync(out, {recursive: true});
const cache = new Map();
const read = p => fs.existsSync(path.join(root, p)) ? fs.readFileSync(path.join(root, p), 'utf8') : cp.execFileSync('git', ['show', `HEAD:${p}`], {cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024});
const json = p => {if (!cache.has(p)) cache.set(p, JSON.parse(read(p))); return cache.get(p);};
const clone = x => JSON.parse(JSON.stringify(x));
const data = json('src/data/agriculture/food-daily-objective-gaps.json');
const content = json('src/data/agriculture/lessons.ja.json');
const languages = ['en', 'vi', 'id', 'zh-CN', 'zh-TW', 'hi', 'bn', 'ne', 'my', 'th', 'km', 'tl'];
const source = read('src/components/agriculture/FoodDailyObjectiveGapSupport.tsx');
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
    if (id.endsWith('food-daily-objective-gaps.json')) return options.data || data;
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

const api=compile(), colors={text:'#173750',translation:'#F2F0E5',translationText:'#173750',border:'#B38432'};
let renders=0,rejects=0,translated=0;
const ids=Object.keys(data.entries);
assert.equal(api.isFoodDailyObjectiveGapContext('unknown'),false);
for(const [index,id] of ids.entries()){
 const e=data.entries[id],l=content.lessons.find(l=>l.id===id),good=[id,l.sourceHash,l.revision,e.scopeLevels[0]];
 assert.deepEqual(e.lessonSnapshot,l);
 for(const language of ['ja',...languages]){
  assert(api.foodDailyObjectiveGapLabels(...good,language));
  for(const showTranslation of [false,true])for(const [width,height] of [[375,812],[812,375],[768,1024],[1440,900]]){
   const html=server.renderToStaticMarkup(React.createElement(api.FoodDailyObjectiveGapSupport,{lessonId:id,lessonSourceHash:l.sourceHash,lessonRevision:l.revision,level:good[3],language,showTranslation,colors}));
   assert(html.includes(`food-daily-gap-${e.kind}`));
   assert.equal((html.match(/data-testid="gap-source-paragraph"/g)||[]).length,l.paragraphs.length);
   const count=(html.match(/data-testid="gap-translated-paragraph"/g)||[]).length;
   assert.equal(count,language!=='ja'&&showTranslation?l.paragraphs.length:0);translated+=count;
   if(e.kind==='flow'){
    for(const key of ['circulation','discharge'])assert(html.includes(`gap-flow-${key}`));
    for(const key of ['return','treatment'])assert(html.includes(`gap-node-${key}`));
    assert(html.indexOf('gap-node-bed')<html.indexOf('gap-node-return'));
    assert(!html.includes('→')); // vertical arrows preserve order through narrow wrapping
   }else{
    assert(html.includes('gap-branch-removeAll')&&html.includes('gap-branch-retainSome'));
    assert.equal((html.match(/gap-label-weakYoung/g)||[]).length,1);
   }
   if(['vi','my'].includes(language)&&showTranslation&&[375,1440].includes(width))fs.writeFileSync(path.join(out,`${index+1}-${language}-${width}.html`),`<html><body><div style="width:${width}px">${html}</div></body></html>`);
   renders++;
  }
 }
 for(const args of [[id,'stale',l.revision,good[3]],[id,l.sourceHash,'stale',good[3]],[id,l.sourceHash,undefined,good[3]],[id,l.sourceHash,l.revision,'1'],['unknown',...good.slice(1)],[...good,[]]]){assert.equal(api.foodDailyObjectiveGapEntry(...args),null);rejects++;}
 if(l.paragraphs.length>1){assert.equal(api.foodDailyObjectiveGapEntry(...good,[l.paragraphs[0].id]),null);rejects++;}
 for(const mutate of [x=>{x.lessons.find(l=>l.id===id).paragraphs[0].textJa+='変';},x=>{x.lessons.find(l=>l.id===id).objectiveJa+='変';},x=>{x.lessons.find(l=>l.id===id).levels=['1'];}]){
  const changed=clone(content);mutate(changed);assert.equal(compile({content:changed}).foodDailyObjectiveGapEntry(...good),null);rejects++;
 }
 for(const mutate of [d=>{d.schemaVersion=9;},d=>{d.studyOnly=false;},d=>{d.kind='other';},d=>{d.entries[id].kind='other';},d=>{d.locales.ja.scope+='変更';},d=>{d.readingsKana.scope='漢字';}]){
  const changed=clone(data);mutate(changed);assert.equal(compile({data:changed}).foodDailyObjectiveGapEntry(...good),null);rejects++;
 }
 for(const language of languages){
  const changed=clone(data);changed.localeSourceJapanese[language].scope='stale';assert.equal(compile({data:changed}).foodDailyObjectiveGapLabels(...good,language),null);rejects++;
  for(const staleHash of [true,false]){
   const broken=compile({translationMutation:entries=>{if(staleHash)entries[id].sourceHash='stale';else entries[id].paragraphs[l.paragraphs[0].id]+='changed';}});
   assert.equal(broken.foodDailyObjectiveGapLabels(...good,language),null);assert(broken.foodDailyObjectiveGapLabels(...good,'ja'));rejects++;
  }
 }
}
// Isolated strict TS/prop contract; explicit RN ambient does not certify production RN styling.
fs.writeFileSync(path.join(out, 'ambient.d.ts'), "declare module 'react' { const React: {createElement: (...args: any[]) => any}; export default React; }\ndeclare module 'react-native' {export const Text: (props: any) => any; export const View: (props: any) => any;}\ndeclare module '@/data/agriculture/lessons.ja.json' {const value: {lessons: any[]}; export default value;}\ndeclare module '@/data/agriculture/food-daily-objective-gaps.json' {const value: unknown; export default value;}\ndeclare module '@/data/agriculture/translations' {export function agricultureLocaleTranslations(locale: string): Record<string, {sourceHash: string; title: string; objective: string; paragraphs: Record<string, string>; paragraphTitles: Record<string, string>; activity: string}> | null;}\ndeclare namespace JSX {interface Element {} interface ElementChildrenAttribute {children: {}} interface IntrinsicAttributes {key?: string | number}}\n");
fs.writeFileSync(path.join(out, 'type-props.tsx'), "import React from 'react';\nimport {FoodDailyObjectiveGapSupport} from '/workspace/scratch/ba446b40eb3c/japan-app/src/components/agriculture/FoodDailyObjectiveGapSupport';\nconst colors = {text:'#123',translation:'#fff',translationText:'#123',border:'#abc'};\n<FoodDailyObjectiveGapSupport lessonId=\"lesson\" lessonSourceHash=\"hash\" colors={colors} />;\n// @ts-expect-error Source hash must be a string.\n<FoodDailyObjectiveGapSupport lessonId=\"lesson\" lessonSourceHash={17} colors={colors} />;\n// @ts-expect-error Translation toggle must be boolean.\n<FoodDailyObjectiveGapSupport lessonId=\"lesson\" lessonSourceHash=\"hash\" colors={colors} showTranslation=\"yes\" />;\n// @ts-expect-error Partial scope must contain paragraph ID strings.\n<FoodDailyObjectiveGapSupport lessonId=\"lesson\" lessonSourceHash=\"hash\" colors={colors} paragraphIds={[1]} />;\n".replaceAll('/workspace/scratch/ba446b40eb3c/japan-app', root));
const program = ts.createProgram([path.join(root, 'src/components/agriculture/FoodDailyObjectiveGapSupport.tsx'), path.join(out, 'ambient.d.ts'), path.join(out, 'type-props.tsx')], {strict: true, noEmit: true, skipLibCheck: true, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, types: []});
assert.equal(ts.getPreEmitDiagnostics(program).length, 0);

const result={strictIsolatedPropContract:true,rejectedWrongPropTypes:3,PASS:true,contexts:ids.length,actualComponentSSRRenders:renders,translatedParagraphs:translated,staleScopeTypePartialTranslationRejections:rejects,browserVerified:false,physicalDeviceTested:false,domainReviewed:false,nativeReviewed:false,claim:'Actual TSX SSR with explicit RN host adapters, not production native/browser rendering'};
fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(result);
