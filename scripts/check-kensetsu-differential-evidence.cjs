// Source/paragraph identity checks for source-difference batches.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),doc=path.join(root,'docs/ssw-workspace/kensetsu'),read=p=>JSON.parse(fs.readFileSync(p)),hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const policy=read(path.join(root,'src/data/kensetsu/reuse-policy.json')),sources=new Map(read(path.join(doc,'SOURCE_FINAL_INTEGRITY_AUDIT_2026-10-17.json')).sources.map(s=>[s.sourceId,s]));
const lessonPath=id=>id.startsWith('kensetsu-common-')?path.join(doc,'shared-session-'+id.split('-').pop()+'.json'):path.join(doc,id.includes('-building-')?'building':'civil','practical','session-'+id.split('-').pop()+'.json');
let paragraphBindings=0,pageBindings=0;
for(const name of ['FINAL_STRUCTURAL_DIFFERENTIAL_LEDGER_2026-10-17.json','COMPONENT_RECOGNITION_DIFFERENTIAL_LEDGER_2026-10-17.json','EQUIPMENT_ROLE_DIFFERENTIAL_LEDGER_2026-10-17.json','SOURCE_LABEL_DIFFERENTIAL_LEDGER_2026-10-17.json']){
 const ledger=read(path.join(doc,name));assert.equal(ledger.rows.length,ledger.newJapaneseParagraphs);
 for(const row of ledger.rows){
  const file=lessonPath(row.lessonId),lesson=read(file);assert.equal(hash(file),row.lessonSha256);assert(lesson.clusters.flatMap(c=>c.paragraphs).some(p=>p.id===row.paragraphId));
  assert(policy.deltaViews.some(v=>v.sessionId===row.lessonId&&v.activeParagraphIds.includes(row.paragraphId)));
  assert.deepEqual(lesson.applicableLevels,['1']);for(const field of row.fields){assert(['building','civil'].includes(field));if(field==='civil'&&lesson.id.includes('-building-'))assert(policy.crossFieldDeltaAssignments.civil.includes(lesson.id));}
  for(const ref of row.sourceBindings){const source=sources.get(ref.sourceId);assert(source);assert.equal(source.sha256,ref.sha256);for(const p of ref.pdfPages){assert(Number.isInteger(p)&&p>0&&p<=source.pages);pageBindings++;}}
  for(const id of row.existingKnowledgeReferences)assert(fs.existsSync(lessonPath(id)),'Missing prior knowledge '+id);
  assert(row.primaryVerificationUrls.length>0);assert.equal(row.domainReviewed,false);assert.equal(row.operationalApproval,false);paragraphBindings++;
 }
}
const legacy=read(path.join(doc,'LEGACY_MISSING_ITEMS_RECONCILIATION_2026-10-17.json'));assert.equal(legacy.rows.length,12);
for(const row of legacy.rows){const file=lessonPath(row.currentLessonId),lesson=read(file);assert.equal(hash(file),row.currentLessonSha256);const ids=new Set(lesson.clusters.flatMap(c=>c.paragraphs.map(p=>p.id)));row.paragraphIds.forEach(id=>assert(ids.has(id)));assert.equal(hash(path.join(doc,row.historicalAuditFile)),row.historicalAuditSha256);}
const audit=read(path.join(doc,'SOURCE_FINAL_INTEGRITY_AUDIT_2026-10-17.json'));assert.equal(audit.pages,387);assert.equal(audit.referencedPages,370);assert.equal(audit.unreferencedInstructionalPages.length,0);assert.equal(audit.wholeSourceCoverageConfirmed,false);assert.equal(audit.completeAtomicDenominator,false);
for(const row of audit.rows){assert.equal(row.semanticCoverageApproved,false);for(const id of row.lessonReferenceIds)assert(fs.existsSync(lessonPath(id)),'Missing lineage lesson '+id);}
console.log(JSON.stringify({status:'PASS_SOURCE_DIFFERENTIAL_EVIDENCE_NOT_DOMAIN_APPROVAL',paragraphBindings,pageBindings,legacyMissingRows:legacy.rows.length,sourcePages:audit.pages,lineageAnchoredPages:audit.referencedPages,wholeSourceCoverageConfirmed:false}));
