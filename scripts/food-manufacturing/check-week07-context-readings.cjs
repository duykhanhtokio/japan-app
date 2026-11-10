/* Tests the actual production label renderer; this does not certify native pronunciation. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const babel=require('@babel/core'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.env.FOOD_QA_REPO_ROOT||path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,'src/data/food-manufacturing',p),'utf8'));
const axisReadings=read('royal-technical-axis-readings.json'),keys=read('royal-week7-technical-labels.json');
const oldRuby=read('ruby/lessons-02.json'),runtimeRuby=read('runtime-supplemental/lesson-ruby.json'),closure=read('source-closure31.json');
const currentLessons=read('lessons.1.ja.json').lessons;
assert.equal(oldRuby.lessons['food-1-021'].sourceHash,currentLessons.find(l=>l.id==='food-1-021').sourceHash);
assert.equal(runtimeRuby['food-2-038'].sourceHash,keys.figures.find(f=>f.lessonId==='food-2-038').sourceHash);
const title=oldRuby.lessons['food-1-021'].fields.titleJa;
assert.deepEqual(title.slice(0,2),[{text:'加熱',reading:'かねつ'},{text:'前',reading:'まえ'}]);
const company=runtimeRuby['food-2-038'].fields['paragraphs.p2.textJa'];
assert.deepEqual(company.slice(30,32),[{text:'全',reading:'ぜん'},{text:'企業',reading:'きぎょう'}]);
const targets=[
 ['加熱前',title.slice(0,2).map(x=>x.reading).join('')],
 ['全企業',company.slice(30,32).map(x=>x.reading).join('')],
 ['値',runtimeRuby['food-2-043'].fields['paragraphs.p2.textJa'][18].reading],
];
assert.equal(closure.sections[2].ruby[49].text,'飛沫');
assert.equal(closure.sections[2].ruby[49].reading,'しぶき');
const lessonTerms=read('lessons.2.ja.json').lessons.flatMap(l=>l.terms);
assert(lessonTerms.some(t=>t.ja==='飛沫'&&t.reading==='ひまつ'));
assert(!axisReadings.tokens['飛沫'],'Conflicting canonical readings remain unresolved; do not settle with global token');
assert.equal(runtimeRuby['food-2-043'].fields['paragraphs.p2.textJa'][18].text,'値');
const source=fs.readFileSync(path.join(root,'src/components/food-manufacturing/FoodSourcePracticeVisuals.tsx'),'utf8');
const begin=source.indexOf('function TechnicalJapaneseLabel('),end=source.indexOf('const week04TechnicalIds=',begin);assert(begin>=0&&end>begin);
const code=babel.transformSync(source.slice(begin,end)+'\n exports.Label=TechnicalJapaneseLabel;',{filename:'actual-label.tsx',babelrc:false,configFile:false,plugins:[['@babel/plugin-transform-typescript',{isTSX:true}],['@babel/plugin-transform-react-jsx',{runtime:'classic'}]]}).code;
const wrap=tag=>({children,accessibilityLabel})=>React.createElement(tag,{'aria-label':accessibilityLabel},children),exportsObject={};
vm.runInNewContext('(function(React,View,Text,axisReadings,exports){'+code+'})')(React,wrap('div'),wrap('span'),axisReadings,exportsObject);
const render=text=>renderToStaticMarkup(React.createElement(exportsObject.Label,{text,color:'#183044'}));
let contexts=0;
for(const [text,reading] of targets){
 assert.equal(axisReadings.tokens[text]?.reading,reading,'Source-qualified token must exist: '+text);
 assert.equal((render(text).match(new RegExp('<span>'+reading+'</span><span>'+text+'</span>','g'))||[]).length,1,'Actual greedy renderer must preserve exact whole token '+text);
 const saved=axisReadings.tokens[text];delete axisReadings.tokens[text];assert(!render(text).includes('<span>'+reading+'</span><span>'+text+'</span>'),'Regression baseline lacks exact annotation '+text);axisReadings.tokens[text]=saved;
 for(const label of keys.keysJa.filter(label=>label.includes(text))){assert(render(label).includes('<span>'+reading+'</span><span>'+text+'</span>'),'Actual W7 label '+label);contexts++;}
}
assert(!axisReadings.tokens['全'],'Do not install ambiguous standalone 全 globally');
assert(!axisReadings.tokens['前'],'Do not install ambiguous standalone 前 globally');
assert(!axisReadings.tokens['等'],'Unresolved 等 remains explicit, not guessed');
assert(Object.keys(axisReadings.week07CanonicalExpansion.unknownHanDebt).length>0,'Keep unresolved current W7 debt visible');
console.log(JSON.stringify({result:'PASS',sourceQualifiedTokens:targets,actualProductionLabelContexts:contexts,remainingWeek07Debt:axisReadings.week07CanonicalExpansion.unknownHanDebt,nativeAcceptance:false},null,2));
