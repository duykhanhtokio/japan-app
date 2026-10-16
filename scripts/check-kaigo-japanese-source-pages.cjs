// Page accounting and revision evidence do not certify exhaustive meaning or clinical correctness.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..'), dir = 'docs/ssw-workspace/kaigo/reviews/';
const baseline = '8004eaa24f40df5448c348f781a942523e3c6639';
const japaneseSha = '2fa47d80d4167c5173e9f24c93178d90fdcf5e6cc45ca574360364f9820325af';
const vietnameseSha = '997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54';
const ranges = [[1,43],[44,99],[100,144],[145,171],[172,204],[205,276]];
const read = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const fromGit = file => execFileSync('git', ['show', `${baseline}:${file}`], { cwd: root, maxBuffer: 12e6 });
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const mp = week => `src/data/kaigo/japanese-master/week-${String(week).padStart(2, '0')}.json`;
const qp = week => `docs/ssw-workspace/kaigo/japanese-master/week-${String(week).padStart(2, '0')}-questions.draft.json`;
const originals = {}, masters = {}, originalQuestions = {};
for (let week=1; week<=26; week++) {
  originals[week] = JSON.parse(fromGit(mp(week)));
  masters[week] = read(mp(week));
  originalQuestions[week] = JSON.parse(fromGit(qp(week))).questions;
}
const reports = ranges.map((_, i) => read(dir + `JAPANESE_SOURCE_PAGE_AUDIT_0${i+1}.json`));
const resolution = read(dir + 'JAPANESE_SOURCE_PAGE_RESOLUTION.json');
const key = t => `${t.week}:${t.sectionId}:${t.paragraphIndex}`;
function approvals(object) {
  for (const field of ['humanReviewed','domainReviewed','nativeReviewed']) assert.equal(object[field],false,field);
  for (const field of ['rightsReviewed','rightsApproved','releaseReady','nativeDeviceTested']) if (field in object) assert.equal(object[field],false,field);
}
function textAt(corpus, target) {
  const paragraphs = corpus[target.week]?.sections[target.sectionId]?.paragraphsJa;
  assert(Array.isArray(paragraphs), 'Unknown target section');
  assert(Number.isInteger(target.paragraphIndex) && target.paragraphIndex>=0 && target.paragraphIndex<paragraphs.length, 'Invalid paragraph pointer');
  return paragraphs[target.paragraphIndex];
}
function validate(input = reports, current = masters) {
  approvals(resolution); assert.equal(resolution.baselineCommit,baseline);
  const patches = new Map(), proposals = new Map(), conceptIds = new Set();
  for (const report of input) for (const patch of report.proposedPatches) {
    assert(!proposals.has(patch.patchId), 'Duplicate proposed patch ID'); proposals.set(patch.patchId,patch);
  }
  for (const patch of resolution.patches) {
    approvals(patch); const proposal=proposals.get(patch.patchId); assert(proposal, 'Unknown applied proposal');
    assert.equal(key(patch),key(proposal)); assert(!patches.has(key(patch)), 'Overlapping unmerged patches');
    assert.equal(sha(textAt(current,patch)),patch.afterParagraphSha256);
    assert.equal(sha(proposal.afterJa),patch.afterParagraphSha256);
    if (proposal.beforeJa === null) {
      assert.equal(patch.beforeParagraphSha256,null);
      assert(patch.paragraphIndex>=originals[patch.week].sections[patch.sectionId].paragraphsJa.length);
    } else {
      assert.equal(textAt(originals,patch),proposal.beforeJa,'Stale exact-before proposal');
      assert.equal(sha(proposal.beforeJa),patch.beforeParagraphSha256);
    }
    patches.set(key(patch),patch);
  }
  assert.equal(resolution.patches.length,proposals.size,'Unapplied proposal lacks an explicit disposition');
  const pageIds=new Set(), counts={}, domains=[]; let targets=0, concepts=0, teachingPages=0, repaired=0;
  input.forEach((report,index)=>{
    approvals(report); assert.equal(report.baselineCommit,baseline);
    assert.equal(report.source.japaneseSha256,japaneseSha); assert.equal(report.source.canonicalViSha256,vietnameseSha);
    const [start,end]=ranges[index], expected=Array.from({length:end-start+1},(_,i)=>start+i);
    assert.deepEqual(report.scopePdfPages,expected); assert.deepEqual(report.pages.map(page=>page.pdfPage),expected,'Unaccounted or reordered source page');
    let n=0;const baselineCounts={};
    for (const page of report.pages) {
      assert(!pageIds.has(page.pdfPage));pageIds.add(page.pdfPage);assert.equal(page.textRead,true);
      assert(['teaching','front_matter','divider','answer_key','answer_sheet','advertisement','colophon','blank'].includes(page.role));
      assert.equal(typeof page.visualChecked,'boolean');
      if(page.role==='teaching') { teachingPages++; assert(page.concepts.length>0,'Teaching page has no concept inventory');assert.equal(page.printedPage,page.pdfPage-2); }
      else assert.equal(page.concepts.length,0,'Do not reproduce non-teaching/answer content');
      for(const concept of page.concepts) {
        assert(!conceptIds.has(concept.id),'Duplicate concept ID');conceptIds.add(concept.id);
        assert(concept.knowledgePointJa?.trim() && concept.sourceLocatorJa?.trim() && concept.qualificationJa?.trim(),'Missing meaning/locator/qualification');
        assert(['covered','partial','missing','pending','corrected_source_error'].includes(concept.status));
        baselineCounts[concept.status]=(baselineCounts[concept.status]??0)+1;
        if(concept.correctionApplied===false) {
          for(const id of concept.proposedPatchIds??[]) assert(resolution.patches.some(p=>p.patchId===id),'Source correction not applied');
        }
        assert(Array.isArray(concept.targets));
        if(['covered','corrected_source_error'].includes(concept.status)) assert(concept.targets.length,'Missing semantic target');
        for(const target of concept.targets) {textAt(originals,target);textAt(current,target);targets++;}
        let status=concept.status;
        if(['partial','missing'].includes(status)) {
          const applied=resolution.patches.filter(p=>p.affectedConceptIds.includes(concept.id));
          assert(applied.length || resolution.deferredConcepts?.some(c=>c.id===concept.id && c.reason),'Unresolved content gap lacks disposition');
          if(applied.length){status='covered';repaired++;}
        }
        counts[status]=(counts[status]??0)+1;n++;concepts++;
      }
    }
    const declared=report.counts.concepts??report.counts.conceptUnits??report.counts.conceptRecords??report.counts.independentlyEnumeratedConceptRecords;
    assert.equal(declared,n,'Misstated concept count');
    const statuses=report.counts.byStatus??report.counts.statusCounts??report.counts.conceptsByStatus??report.counts.statuses;
    for(const status of ['covered','partial','missing','pending','corrected_source_error']) assert.equal(statuses[status]??0,baselineCounts[status]??0,'Misstated status count');
    domains.push({group:index+1,pdfPages:report.pages.length,conceptRecords:n});
  });
  assert.equal(pageIds.size,276);
  for(const patch of resolution.patches) for(const id of patch.affectedConceptIds) assert(conceptIds.has(id),'Patch references unknown concept');
  let paragraphs=0, changed=0, added=0, questionsUnchanged=0;
  for(let week=1;week<=26;week++) {
    assert.deepEqual(Object.keys(current[week].sections),Object.keys(originals[week].sections),'Section IDs changed');
    assert.deepEqual(current[week].lessons,originals[week].lessons,'Day metadata changed outside scope');
    for(const [sectionId,section] of Object.entries(current[week].sections)) {
      const old=originals[week].sections[sectionId]; assert.deepEqual({...section,paragraphsJa:[]},{...old,paragraphsJa:[]});
      assert(section.paragraphsJa.length>=old.paragraphsJa.length,'Japanese paragraph deleted');
      section.paragraphsJa.forEach((text,paragraphIndex)=>{
        paragraphs++;if(text!==old.paragraphsJa[paragraphIndex]) {assert(patches.has(key({week,sectionId,paragraphIndex})),'Unrecorded Japanese edit');if(paragraphIndex>=old.paragraphsJa.length)added++;else changed++;}
      });
    }
    const draft=read(qp(week));assert.deepEqual(draft.questions,originalQuestions[week],'Question objects changed');questionsUnchanged+=Object.keys(draft.questions).length;
    assert.equal(draft.sourceJapaneseSha256,sha(fs.readFileSync(path.join(root,mp(week)))));
  }
  return {status:'PASS_SOURCE_PAGE_INVENTORY_AND_CURRENT_JAPANESE_REVISIONS',baselineCommit:baseline,pdfPages:pageIds.size,teachingPages,conceptRecords:concepts,paragraphPointers:targets,domainCounts:domains,effectiveConceptCounts:counts,conceptRecordsRepaired:repaired,paragraphs,revisedParagraphs:changed,addedParagraphs:added,questionsUnchanged,sourceKnowledgeCoveragePercent:null,semanticExhaustivenessCertified:false,humanReviewed:false,domainReviewed:false,nativeReviewed:false,nativeDeviceTested:false,releaseReady:false};
}
const result=validate();
for(const [name,mutate] of [
  ['missing_source_page',data=>data[0].pages.pop()],
  ['invalid_semantic_pointer',data=>{const c=data.flatMap(r=>r.pages).flatMap(p=>p.concepts).find(c=>c.targets.length);c.targets[0].paragraphIndex=99999;}],
  ['unearned_approval',data=>{data[0].domainReviewed=true;}],
  ['misstated_concept_count',data=>{data[0].counts.independentlyEnumeratedConceptRecords++;}],
]) {const altered=structuredClone(reports);mutate(altered);assert.throws(()=>validate(altered),undefined,name);}
const altered=structuredClone(masters);const sid=Object.keys(altered[1].sections)[0];altered[1].sections[sid].paragraphsJa[0]+='未確認の変更';assert.throws(()=>validate(reports,altered),undefined,'Unrecorded current text change');
result.negativeControls=['missing_source_page','invalid_semantic_pointer','unearned_approval','misstated_concept_count','unrecorded_japanese_change'];
if(process.env.KAIGO_SOURCE_PAGE_REPORT)fs.writeFileSync(path.resolve(root,process.env.KAIGO_SOURCE_PAGE_REPORT),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
