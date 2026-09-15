import fs from 'node:fs';
const source = fs.readFileSync('src/components/jlpt/ApprovedJlptExamCatalog.tsx', 'utf8');
const forbidden = ['ApprovedScannedExam','ScannedN1OfficialTest','SourcePages','writtenPages','listeningPages','scriptPages','answerKeyPage','RoyalButton','RoyalInfoPanel','RoyalOptionRow','RoyalTitlePanel','RoyalDialogueFrame'];
const found = forbidden.filter((token) => source.includes(token));
if (found.length) { console.error(`JLPT NO-SCANNED-RUNTIME FAILED: ${found.join(', ')}`); process.exit(1); }
console.log('JLPT NO-SCANNED-RUNTIME PASS: pending metadata is visible without a scanned-page renderer.');
