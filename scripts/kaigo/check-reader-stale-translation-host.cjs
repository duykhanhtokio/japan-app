// Actual KaigoCourse with one controlled newer Japanese snapshot; host rendering only.
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '../..'), modules = process.env.TOKUTEI_QA_MODULES || root;
const dep = name => require(require.resolve(name, { paths: [modules] }));
const React = dep('react'), {act, create} = dep('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT = true;
global.__tokuteiStorage = new Map();
global.requestAnimationFrame = fn => setTimeout(fn, 0); global.cancelAnimationFrame = clearTimeout;
const file = path.join(root, 'src/data/kaigo/reader-communication-checks.json');
const data = JSON.parse(fs.readFileSync(file));
const row = data.checks.find(c => c.id === 'kaigo-reader-consent-decision-support');
row.promptJa += '版の変更。'; row.promptRuby.push({text: '版の変更。'});
const snapshots = new Map([[file, JSON.stringify(data)]]);
const locales = ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
const nodes = (tree,id) => tree.root.findAll(n => typeof n.type === 'string' && n.props.testID === id);
async function click(tree,id) {const n=nodes(tree,id); assert(n.length,id); await act(async()=>{n[0].props.onPress(); await new Promise(setImmediate);});}
(async()=>{
  const app = await require('../tokutei-ui-qa/compile.cjs')(root, modules, snapshots);
  for (const locale of locales) {
    global.__tokuteiLanguage = locale; let tree;
    await act(async()=>{tree=create(React.createElement(app.KaigoCourse,{active:false,onBack(){}})); await new Promise(setImmediate);});
    await click(tree,'kaigo-week-'+Math.ceil(row.day/7)); await click(tree,'kaigo-calendar-day-'+row.day);
    await click(tree,'kaigo-translation');
    assert(tree.root.findAll(n=>n.props.testID===row.id+'-prompt' && n.props.text===row.promptJa).length,
      'Keep newer Japanese visible');
    for(const suffix of ['translation','teaching-translation','answer-translation'])assert.equal(nodes(tree,row.id+'-'+suffix).length,0);
    await click(tree,row.id+'-toggle');
    assert.equal(nodes(tree,row.id+'-answer').length,1,'Keep Japanese answer available');
    assert.equal(nodes(tree,row.id+'-answer-translation').length,0,'Never show old answer translation');
    await act(async()=>tree.unmount());
  }
  delete global.__tokuteiLanguage;
  console.log(JSON.stringify({status:'PASS_KAIGO_STALE_READER_TRANSLATION_HOST',locales:locales.length,
    actualCourse:true,staleTranslationsHidden:true,newJapanesePreserved:true,deviceOrSemanticAcceptance:false}));
})().catch(e=>{console.error(e);process.exitCode=1;});
