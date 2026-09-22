import assert from 'node:assert/strict';
import fs from 'node:fs';

const root='docs/jlpt-workspace/conversion/n4-2018-07';
const manifest=JSON.parse(fs.readFileSync(`${root}/WORK_MANIFEST.json`));
const catalog=fs.readFileSync('src/data/jlpt-official/jlpt-exam-catalog.ts','utf8');

assert.equal(manifest.targetExamId,'n4-2018-07-exam-07');
assert.equal(manifest.catalogPeriodId,'n4-2018-07');
assert.equal(manifest.status,'incomplete');
assert.equal(manifest.sourceClassification,'official_practice_workbook_2018');
assert.equal(manifest.targetIdentityVerified,false);
assert.equal(manifest.identity.coverPrintsPeriod,false);
assert.equal(manifest.identity.filenamePrintsMonth,false);
assert.equal(manifest.identity.folderOnlyPrintsMonth,true);
assert.deepEqual(manifest.counts,{writtenResponsesObserved:70,listeningResponsesObserved:28});
assert.equal(manifest.source.answerKeyPresent,true);
assert.equal(manifest.source.chineseExplanationsAndTranslationsPresent,true);
assert.equal(manifest.source.japaneseListeningTranscriptPresent,true);
assert.equal(manifest.source.sourceTimingPresent,false);
assert.equal(manifest.source.pdfSha256,'694022621a697f32633c30d69680a00167607984af7f975c47e2e661b8426fc4');
assert.equal(manifest.source.audioSha256,'ba81cfbc6265384a0f8992367efbfaa4175bff17c965610bf1671ffc0dd9bed5');
assert.equal(manifest.source.audioDurationSeconds,2302.432993);
assert.deepEqual(manifest.runtime,{structuredDataCreated:false,runtimeAudioCreated:false,candidateTimingCreated:false});
assert.equal(manifest.blockers.length,2);
assert.match(catalog,/'n4-2018-07'/);
assert.doesNotMatch(catalog,/n4-2018-07-exam-07/);
assert.equal(fs.existsSync('assets/jlpt/n4/2018-07/audio/n4-2018-07.mp3'),false);
console.log('N4 2018-07 SOURCE AUDIT PASS: supplied files are classified as Official Practice Workbook 2018; target exam remains incomplete; no runtime data, audio, or timing created.');
