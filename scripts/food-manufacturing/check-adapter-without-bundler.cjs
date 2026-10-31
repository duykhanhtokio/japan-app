const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {stripTypeScriptTypes} = require('node:module');
const root = path.resolve(__dirname, '../..');
const file = path.join(root, 'src/data/food-manufacturing/index.ts');
// Evaluate the actual adapter; replace only JSON imports for this Node-only check.
function evaluate(file, names) {
  let source = stripTypeScriptTypes(fs.readFileSync(file, 'utf8'))
    .replace(/^import (\w+) from ['"](.+\.json)['"];?$/gm,
      (_, name, relative) => `const ${name} = loadJson(${JSON.stringify(relative)});`)
    .replace(/^import \{([^}]+)\} from ['"]\.\/supplemental['"];?$/gm,
      (_, names) => `const {${names}} = supplemental;`)
    .replace(/^export /gm, '');
  return vm.runInNewContext(source + `\n;({${names.join(',')}})`, {
    supplemental: file.endsWith('supplemental.ts') ? undefined : supplemental,
    loadJson(relative) { return JSON.parse(fs.readFileSync(path.resolve(path.dirname(file), relative), 'utf8')); }
  });
}
const supplemental = evaluate(path.join(path.dirname(file), 'supplemental.ts'), [
  'supplementalLessons','supplementalExams','supplementalTranslations','supplementalTestTranslations'
]);
const adapter = evaluate(file, ['foodManufacturingChecks','foodManufacturingQuestionTranslation','foodManufacturingExamTitleTranslation']);
const locales = ['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];
let valid = 0, missing = 0, stale = 0, titles = 0;
for (const locale of locales) {
  const pack = JSON.parse(fs.readFileSync(path.join(path.dirname(file), 'test-translations', locale + '.json'), 'utf8'));
  Object.assign(pack.questions, supplemental.supplementalTestTranslations[locale]?.questions);
  Object.assign(pack.examTitles, supplemental.supplementalTestTranslations[locale]?.examTitles);
  for (const level of ['1','2']) for (const exam of adapter.foodManufacturingChecks(level)) {
    const title = adapter.foodManufacturingExamTitleTranslation(exam, locale);
    if (pack.examTitles[exam.id]) { assert.equal(title, pack.examTitles[exam.id].title); titles++; }
    else assert.equal(title, null);
    for (const q of exam.questions) {
      const entry = adapter.foodManufacturingQuestionTranslation(q, locale);
      if (!pack.questions[q.id]) { assert.equal(entry, null); missing++; continue; }
      assert(entry, `${locale}/${q.id}: missing or stale`);
      assert.equal(entry.prompt, pack.questions[q.id].prompt);
      assert.equal(entry.options.length, 4);
      assert.equal(entry.optionExplanations.length, 4);
      assert.equal(entry.explanation, entry.optionExplanations[q.correctIndex]);
      assert.equal(adapter.foodManufacturingQuestionTranslation({...q, sourceHash:q.sourceHash+'-stale'}, locale), null);
      valid++; stale++;
    }
  }
}
assert.equal(valid, 848 * 12);
assert.equal(missing, 0);
assert.equal(titles, 36 * 12);
console.log(JSON.stringify({status:'PASS',validTranslationPairs:valid,rejectedStalePairs:stale,missingPairsWithoutFallback:missing,validTitles:titles,browserTested:false,nativeDeviceTested:false}));
