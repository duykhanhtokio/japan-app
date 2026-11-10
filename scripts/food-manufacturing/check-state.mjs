import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {stripTypeScriptTypes} from 'node:module';
function load(path){let source=fs.readFileSync(path,'utf8').replace(/^import type .*;$/gm,'').replace(/^export \{.*\} from .*;$/gm,'');source=stripTypeScriptTypes(source).replace(/export /g,'');return vm.runInNewContext(`${source}\n;({${path.includes('kensetsu')?'freshTestAttempt,restoreTestAttempt,gradeTest':'foodManufacturingCompletionKey,foodManufacturingExamKey,restoreFoodManufacturingProgress,foodManufacturingLessonDone'}})`);}
const storage=load('src/services/food-manufacturing-study-state.ts'),tests=load('src/services/kensetsu-test-state.ts');
const exam={id:'food-1-mock-01',revision:'content-a',questions:[{id:'a',correctIndex:2},{id:'b',correctIndex:0}]};
const fresh=tests.freshTestAttempt(exam);assert.equal(fresh.answers.length,2);assert.equal(tests.gradeTest(exam,[2,null]).correct,1);assert.equal(tests.gradeTest(exam,[2,null]).unanswered,1);
const saved={...fresh,answers:[2,1],currentQuestion:1};assert.equal(tests.restoreTestAttempt(JSON.stringify(saved),exam).currentQuestion,1);
assert.equal(tests.restoreTestAttempt(JSON.stringify(saved),{...exam,revision:'content-b'}),null);
assert.equal(tests.restoreTestAttempt(JSON.stringify({...saved,answers:[2,4]}),exam),null);
assert.equal(storage.restoreFoodManufacturingProgress('{broken'),null);
assert.equal(storage.restoreFoodManufacturingProgress(JSON.stringify({version:1,entries:{'agr-rice':'abc'}})),null);
assert.notEqual(storage.foodManufacturingCompletionKey('a:b','1'),storage.foodManufacturingCompletionKey('a','2'));
assert.notEqual(storage.foodManufacturingExamKey('a','1','same'),storage.foodManufacturingExamKey('a','2','same'));
assert.equal(storage.foodManufacturingLessonDone({version:1,entries:{'food-1-001':'old'}},{id:'food-1-001',sourceHash:'new'}),false);
console.log('Food manufacturing state: PASS (resume, revision invalidation, scoring, malformed storage, namespace isolation).');
