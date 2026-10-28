const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'src/data/food-manufacturing');
const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));
function evaluate(file,names){let source=fs.readFileSync(path.join(dir,file),'utf8').replace(/^import (\w+) from ['"](.+\.json)['"];?$/gm,(_,name,relative)=>`const ${name}=loadJson(${JSON.stringify(relative)});`);source=stripTypeScriptTypes(source).replace(/^export /gm,'');return vm.runInNewContext(source+'\n;({'+names.join(',')+'})',{loadJson:relative=>read(relative)});}
const data=evaluate('index.ts',['foodManufacturingLessons','foodManufacturingChecks']);
const ruby=evaluate('ruby.ts',['hasAlignedFoodRuby','foodManufacturingLessonRuby','foodManufacturingQuestionRuby']);
let lessons=0,questions=0,lessonFields=0,questionFields=0,annotations=0;
function check(text,segments){assert(ruby.hasAlignedFoodRuby(text,segments));assert.equal(segments.map(x=>x.text).join(''),text);assert(!ruby.hasAlignedFoodRuby(text,[{text,reading:'BAD'}]));annotations+=segments.filter(x=>x.reading).length;}
for(const lesson of data.foodManufacturingLessons){
 const fields=ruby.foodManufacturingLessonRuby(lesson);assert(fields,lesson.id);lessons++;
 for(const key of ['titleJa','objectiveJa','activityJa','summaryJa']){check(lesson[key],fields[key]);lessonFields++;}
 for(const p of lesson.paragraphs)for(const key of ['titleJa','textJa']){check(p[key],fields.paragraphs[p.id][key]);lessonFields++;}
 assert.equal(ruby.foodManufacturingLessonRuby({...lesson,sourceHash:'stale'}),undefined);
 assert.equal(ruby.foodManufacturingLessonRuby({...lesson,objectiveJa:lesson.objectiveJa+'changed'}),undefined);
}
for(const level of ['1','2'])for(const exam of data.foodManufacturingChecks(level))for(const q of exam.questions){
 const fields=ruby.foodManufacturingQuestionRuby(q);assert(fields,q.id);questions++;
 check(q.stemJa,fields.promptJa);check(q.explanationJa,fields.explanationJa);questionFields+=2;
 for(let i=0;i<4;i++){check(q.optionsJa[i],fields.optionsJa[i]);check(q.optionReasonsJa[i],fields.optionExplanationsJa[i]);questionFields+=2;}
 assert.deepEqual(fields.explanationJa,fields.optionExplanationsJa[q.correctIndex]);
 assert.equal(ruby.foodManufacturingQuestionRuby({...q,sourceHash:'stale'}),undefined);
 assert.equal(ruby.foodManufacturingQuestionRuby({...q,stemJa:q.stemJa+'changed'}),undefined);
}
assert.equal(lessons,78);assert.equal(questions,839);assert.equal(lessonFields,788);assert.equal(questionFields,8390);
console.log(JSON.stringify({status:'PASS',lessons,questions,lessonFields,questionFields,annotations,staleAndChangedSourcesRejected:true,incorrectReadingSyntaxRejected:true,sourceTextPreserved:true,correctReasonRubyEqualsMain:true,nativeReviewed:false,browserTested:false}));
