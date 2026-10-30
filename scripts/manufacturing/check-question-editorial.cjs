const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const esbuild=require('esbuild');
function compiled(file,bundle=false){const full=path.join(root,file),m=new Module(full,module);m.filename=full;m.paths=Module._nodeModulePaths(path.dirname(full));const code=bundle?esbuild.buildSync({entryPoints:[full],bundle:true,platform:'node',format:'cjs',write:false}).outputFiles[0].text:esbuild.transformSync(fs.readFileSync(full,'utf8'),{loader:'ts',format:'cjs'}).code;m._compile(code,full);return m.exports;}
const helper=compiled('src/data/manufacturing/question-editorial.ts'),api=compiled('src/services/manufacturing-mock-state.ts'),loader=compiled('src/data/manufacturing/mocks.ts',true);
const patch=require(path.join(root,'src/data/manufacturing/question-editorial.json'));
const original=read('src/data/manufacturing/mocks/surface.json').exams.find(e=>e.sections.theory.questions.some(q=>q.id===patch.questionId));
const q=original.sections.theory.questions.find(q=>q.id===patch.questionId),before=JSON.stringify(original),revised=helper.revisedManufacturingMockQuestion(q);
assert.equal(helper.revisedManufacturingMockQuestion(revised),revised);assert.equal(revised.stemJa,patch.after);assert.equal(q.stemJa,patch.before);assert.equal(q.sourceHash,patch.sourceHash);assert.deepEqual({...revised,stemJa:q.stemJa},q);
const effective=loader.loadManufacturingMocks('surface').find(e=>e.id===original.id),effectiveQ=effective.sections.theory.questions.find(q=>q.id===patch.questionId);
assert.equal(effectiveQ.stemJa,patch.after);assert.deepEqual({...effective,sections:{...effective.sections,theory:{...effective.sections.theory,questions:effective.sections.theory.questions.map(x=>x.id===q.id?{...x,stemJa:q.stemJa}:x)}}},original);
const ruby=loader.manufacturingMockRuby(effectiveQ,'stem');assert.equal(ruby.map(x=>x.text).join(''),patch.after);assert(ruby.filter(x=>/[一-龯]/.test(x.text)).every(x=>typeof x.reading==='string'&&x.reading));
for(let i=0;i<2;i++)assert.equal(loader.manufacturingMockRuby(effectiveQ,i).map(x=>x.text).join(''),q.optionsJa[i]);
const frozenTargets=read('src/data/manufacturing/mock-translations.json').locales;
const locales=read('docs/ssw-workspace/manufacturing/approved-scope.json').targetLocales;assert.deepEqual(Object.keys(patch.translations).sort(),[...locales].sort());
for(const locale of locales){assert.equal(frozenTargets[locale][q.id].stem,patch.translations[locale].before);const entry=loader.manufacturingMockTranslation(effectiveQ,locale);assert.equal(entry.stem,patch.translations[locale].after);assert.equal(entry.sourceHash,q.sourceHash);assert.equal(helper.revisedManufacturingMockStemTranslation(revised,locale,{...entry,stem:'drift'}).stem,'drift');assert.equal(helper.revisedManufacturingMockStemTranslation({...revised,sourceHash:'stale'},locale,{...entry,stem:patch.translations[locale].before}).stem,patch.translations[locale].before);}
const rejected=[];
for(const [name,changed]of [['qid',{...q,id:'other'}],['source',{...q,sourceHash:'stale'}],['stem',{...q,stemJa:'drift'}],['key',{...q,correctIndex:1}],['options',{...q,optionsJa:['誤り','正しい']}]] ){assert.equal(helper.revisedManufacturingMockQuestion(changed),changed);rejected.push(name);}
for(const locale of ['xx','toString','__proto__']){const entry={sourceHash:q.sourceHash,stem:'prior'};assert.equal(helper.revisedManufacturingMockStemTranslation(revised,locale,entry),entry);rejected.push(locale);}
assert.equal(helper.revisedManufacturingMockStemRuby(revised,[{text:'drift'}])[0].text,'drift');rejected.push('stale ruby');
const after=patch.after;patch.after='';assert.equal(helper.revisedManufacturingMockQuestion(q),q);patch.after=after;rejected.push('empty Japanese');
let attempt=api.startManufacturingMockSection(api.freshManufacturingMock(original),original,'theory',1000);
const qi=original.sections.theory.questions.findIndex(x=>x.id===q.id);attempt=api.answerManufacturingMock(attempt,original,'theory',qi,q.correctIndex,1100);attempt=api.navigateManufacturingMock(attempt,original,'theory',qi,1200);
assert.deepEqual(api.restoreManufacturingMock(JSON.stringify(attempt),effective),attempt);assert.equal(api.gradeManufacturingMock(attempt,effective),null);
attempt=api.submitManufacturingMockSection(attempt,original,'theory',1300);attempt=api.startManufacturingMockSection(attempt,original,'practical',1400);attempt=api.submitManufacturingMockSection(attempt,original,'practical',1500);
assert.deepEqual(api.restoreManufacturingMock(JSON.stringify(attempt),effective),attempt);assert.deepEqual(api.gradeManufacturingMock(attempt,effective),api.gradeManufacturingMock(attempt,original));
assert.equal(api.manufacturingMockKey('reviewer','surface',effective.id),api.manufacturingMockKey('reviewer','surface',original.id));
assert.equal(JSON.stringify(original),before);
for(const flag of ['independentReviewed','nativeReviewed','domainReviewed','humanReviewed','releaseReady'])assert.equal(patch[flag],false);
const result={status:'PASS',questionId:q.id,japaneseAndTargets:13,rubyAligned:true,originalQuestionUnchanged:true,negativeGuards:rejected,priorAttemptRestored:true,answersPositionTimersAndRevisionPreserved:true,gradingUnchanged:true,preSubmissionGradeSuppressed:true,nativeReviewed:false,domainReviewed:false,releaseReady:false};
console.log(JSON.stringify(result));
