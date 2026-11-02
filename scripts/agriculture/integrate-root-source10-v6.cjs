// Mechanical integration of root-authored source10; source acceptance belongs to the root author receipt.
const fs=require('fs'),z=require('zlib'),crypto=require('crypto');
process.chdir(require('path').resolve(__dirname,'../..'));
const base='docs/ssw-workspace/source-coverage-v2/',lp=base+'agriculture.json',rp='src/data/agriculture/reader-moisture-checks.json',delta=JSON.parse(fs.readFileSync('docs/ssw-workspace/agriculture/root-v6/source10-unit-delta.json')),checks=JSON.parse(fs.readFileSync(delta.readerChecksPath));
const sha=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ledger=JSON.parse(fs.readFileSync(lp)),reader=JSON.parse(fs.readFileSync(rp));
const authored=Array.isArray(checks)?checks:checks.checks;
if(authored.length!==3)throw Error('Expected three unchanged author checks');
for(const c of authored){const expect=delta.readerCheckValueSha256.find(x=>x.id===c.id);if(!expect||expect.sha256!==sha(c))throw Error('Authorcheckhash '+c.id);const old=reader.checks.find(x=>x.id===c.id);if(old&&sha(old)!==sha(c))throw Error('Existingcheckcollision');if(!old)reader.checks.push(c);}
const units=JSON.parse(JSON.stringify(delta.knowledgeUnits));
for(const u of units)for(const type of ['teachingEvidence','assessmentEvidence'])for(const e of u[type])if(e.pendingReaderCheckBinding){const b=e.pendingReaderCheckBinding,i=reader.checks.findIndex(c=>c.id===b.checkId);if(i<0)throw Error('Missingcheck');const v=b.field==='whole_check'?reader.checks[i]:reader.checks[i][b.field];if(sha(v)!==b.expectedValueSha256)throw Error('Exactbindinghash');delete e.pendingReaderCheckBinding;Object.assign(e,{path:rp,jsonPointer:'/checks/'+i+(b.field==='whole_check'?'':'/'+b.field),sha256:sha(v),sha256Mode:'json-value'});}
// No semantic review here: root author's self-review remains the source acceptance attribution.
for(const u of units){const i=ledger.knowledgeUnits.findIndex(x=>x.knowledgeId===u.knowledgeId);if(i>=0)ledger.knowledgeUnits[i]=u;else ledger.knowledgeUnits.push(u);}
for(const n of delta.legacyNarrowings){const u=ledger.knowledgeUnits.find(x=>x.knowledgeId===n.knowledgeId);if(!u)throw Error('Narrowingunitmissing');u.legacyRefs={...u.legacyRefs,source10OriginalRefs:u.sourceRefs,source10NarrowingReason:n.reason};u.sourceRefs=u.sourceRefs.filter(r=>!n.removeSourceRefs.some(x=>x.sourceId===r.sourceId&&x.pdfPage===r.pdfPage));}
const pdelta=delta.sourcePage,artp=base+'agriculture-AGR-S1-regions.json.gz',art=JSON.parse(z.gunzipSync(fs.readFileSync(artp))),ap=art.pages.find(p=>p.pdfPage===pdelta.pdfPage),page=ledger.pages.find(p=>p.sourceId===pdelta.sourceId&&p.pdfPage===pdelta.pdfPage);
if(ap.elements.length!==pdelta.elementClassifications.length)throw Error('Fullpageelementcount');
for(const e of ap.elements){const d=pdelta.elementClassifications.find(x=>x.elementId===e.elementId);if(!d)throw Error('Unclassifiedelement');Object.assign(e,d);}
for(const p of ledger.pages)p.knowledgeIds=ledger.knowledgeUnits.filter(u=>u.sourceRefs.some(r=>r.sourceId===p.sourceId&&r.pdfPage===p.pdfPage)).map(u=>u.knowledgeId);
page.disposition=pdelta.disposition;page.regionCensus.status='visually_reviewed';page.regionCensus.visualReviewRef=pdelta.visualReviewRef;page.semanticInventory={status:'complete_ai',reviewRef:pdelta.semanticReviewRef};
const raw=z.gzipSync(JSON.stringify(art),{mtime:0}),h=crypto.createHash('sha256').update(raw).digest('hex');for(const p of ledger.pages.filter(p=>p.sourceId==='AGR-S1'))p.regionCensus.sha256=h;
// Apply only when explicitly invoked with --apply. Then actual host tests are mandatory.
if(!process.argv.includes('--apply')){console.log(JSON.stringify({preparedOnly:true,units:units.length,checksAdded:authored.length,pageElements:ap.elements.length,checksTotal:reader.checks.length}));process.exit(0);}
fs.writeFileSync(rp,JSON.stringify(reader,null,2)+'\n');fs.writeFileSync(artp,raw);fs.writeFileSync(lp,JSON.stringify(ledger,null,2)+'\n');
console.log('Mechanical source10 integration written; host acceptance still required.');
