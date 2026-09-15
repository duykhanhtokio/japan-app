import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const moduleNames = fs.readdirSync(path.join(root, 'src/data/jlpt-mock')).filter((name) => /^n[123]-\d{4}-(07|12)-official\.ts$/.test(name)).sort();
const rows = moduleNames.map((name) => {
  const [, digit, year, month] = name.match(/^n([123])-(\d{4})-(07|12)-official\.ts$/); const structured = name === 'n1-2012-07-official.ts';
  return { level:`N${digit}`,period:`${year}-${month}`,examId:`n${digit}-${year}-${month}`,questionText:structured,options:structured,correctAnswers:true,passages:structured,transcripts:structured,audio:true,audioBoundaries:structured,renderer:structured?'N1OfficialTrial':'none (source assets retained only)',status:structured?'structured_ready':'scanned_only',sourceModule:`src/data/jlpt-mock/${name}` };
});
rows.push({level:'N1',period:'2012-12',examId:'n1-2012-12-exam-02',questionText:true,options:true,correctAnswers:true,passages:true,transcripts:true,audio:true,audioBoundaries:true,renderer:'N1OfficialTrial',status:'structured_ready',sourceModule:'src/data/jlpt-official/n1-2012-12/'});
for (const level of ['N1','N2','N3','N4','N5']) rows.push({level,period:'mock-01',examId:`${level.toLowerCase()}-mock-01`,questionText:true,options:true,correctAnswers:true,passages:true,transcripts:true,audio:false,audioBoundaries:false,renderer:'ApprovedMockExam',status:'mock_ready',sourceModule:'src/data/jlpt-mock/sample-exams.ts'});
rows.sort((a,b)=>a.level.localeCompare(b.level)||a.period.localeCompare(b.period));
const summary={catalogTotal:rows.length,totalSourcePackages:rows.length,structuredReady:rows.filter(r=>r.status==='structured_ready').length,converting:0,scannedOnly:rows.filter(r=>r.status==='scanned_only').length,incomplete:0,notVerified:0,mockReady:rows.filter(r=>r.status==='mock_ready').length,readyTotal:rows.filter(r=>r.status==='structured_ready'||r.status==='mock_ready').length,visibleTotal:rows.length};
fs.mkdirSync(path.join(root,'docs/jlpt-workspace'),{recursive:true}); fs.writeFileSync(path.join(root,'docs/jlpt-workspace/JLPT_50_EXAMS_TRUTHFUL_INVENTORY.json'),`${JSON.stringify({generatedAt:new Date().toISOString(),summary,exams:rows},null,2)}\n`); console.log(summary);
