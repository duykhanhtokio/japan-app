// A pointer audit proves traceability structure, not medical correctness or exhaustive book coverage.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'src/data/kaigo/japanese-master');
let paragraphs=0,weeks=0;
for(const file of fs.readdirSync(base).filter(n=>/^week-\d{2}\.json$/.test(n)).sort()){
 const master=JSON.parse(fs.readFileSync(path.join(base,file))),week=file.match(/\d{2}/)[0];
 const ledger=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/kaigo/japanese-master/week-'+week+'-source-ledger.json')));
 assert.equal(ledger.source.sha256,'997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54');
 const rows=ledger.rows??ledger.entries??ledger.paragraphs??ledger.records;assert(Array.isArray(rows),'Missing paragraph rows '+week);
 const links=new Set();
 for(const row of rows){if(!master.sections[row.sectionId])continue;
  const section=master.sections[row.sectionId];assert(Number.isInteger(row.paragraphIndex)&&row.paragraphIndex>=0&&row.paragraphIndex<section.paragraphsJa.length,'Invalid source pointer '+row.sectionId);
  assert(row.knowledgePointJa&&row.evidenceType,'Unidentified knowledge/evidence '+row.sectionId);assert.equal(row.humanReviewed,false);assert.equal(row.domainReviewed,false);assert.equal(row.nativeReviewed,false);
  links.add(row.sectionId+':'+row.paragraphIndex);
 }
 for(const [id,section] of Object.entries(master.sections))for(let index=0;index<section.paragraphsJa.length;index++){assert(links.has(id+':'+index),'Missing paragraph trace '+id+':'+index);paragraphs++;}
 weeks++;
}
console.log(JSON.stringify({status:'PASS_JAPANESE_PARAGRAPH_LEDGER_POINTERS',weeks,paragraphs,sourceKnowledgeCoveragePercent:null,humanReviewed:false,domainReviewed:false}));
