/* Mechanical evidence gate. It never infers semantic coverage from counts or keywords. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),zlib=require('node:zlib');
const ROOT=path.resolve(__dirname,'../..');
const SECTORS=['agriculture','manufacturing','food','restaurant','hospitality','construction','kaigo'];
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const sha=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
function fail(code,message){const e=new Error(`${code}: ${message}`);e.code=code;throw e;}
function need(ok,code,message){if(!ok)fail(code,message);}
function nonempty(x){return typeof x==='string'&&x.trim().length>0;}
function safe(root,p){need(nonempty(p)&&!path.isAbsolute(p)&&!p.split(/[\\/]/).includes('..')&&!p.includes('\\'),'UNSAFE_PATH',String(p));const f=path.resolve(root,p);need(f.startsWith(path.resolve(root)+path.sep),'UNSAFE_PATH',p);return f;}
function readJSON(file){const b=fs.readFileSync(file);return JSON.parse((file.endsWith('.gz')?zlib.gunzipSync(b):b).toString('utf8'));}
function pointer(value,p){need(typeof p==='string'&&(p===''||p.startsWith('/')),'INVALID_POINTER',String(p));if(p==='')return value;for(const raw of p.slice(1).split('/')){const key=raw.replace(/~1/g,'/').replace(/~0/g,'~');need(value!==null&&typeof value==='object'&&Object.hasOwn(value,key),'MISSING_POINTER',p);value=value[key];}return value;}
function validateSector(root,ledger){
 need(ledger.schemaVersion===2,'SCHEMA_VERSION','expected 2');need(SECTORS.includes(ledger.sector),'SECTOR',ledger.sector);
 need(/^[a-f0-9]{40}$/.test(ledger.baselineCommit||''),'BASELINE','exact baseline commit required');
 for(const k of ['sources','pages','knowledgeUnits','unresolved'])need(Array.isArray(ledger[k]),'ARRAY_REQUIRED',k);
 need(ledger.sources.length>0,'NO_SOURCES',ledger.sector);
 const sourceIds=new Map(),sourceHashes=new Set();let expectedPages=0;
 for(const s of ledger.sources){need(nonempty(s.sourceId)&&!sourceIds.has(s.sourceId),'DUPLICATE_SOURCE_ID',s.sourceId);need(sha(s.sha256),'SOURCE_SHA',s.sourceId);need(!sourceHashes.has(s.sha256),'DUPLICATE_SOURCE_HASH',`${s.sourceId}: use aliases for byte-identical files`);need(Number.isInteger(s.pdfPages)&&s.pdfPages>0,'SOURCE_PAGES',s.sourceId);need(typeof s.byteVerified==='boolean','SOURCE_VERIFICATION',s.sourceId);if(s.byteVerified)need(nonempty(s.verificationRef),'SOURCE_VERIFICATION',s.sourceId);sourceIds.set(s.sourceId,s);sourceHashes.add(s.sha256);expectedPages+=s.pdfPages;}
 const units=new Map();for(const u of ledger.knowledgeUnits){need(nonempty(u.knowledgeId)&&!units.has(u.knowledgeId),'DUPLICATE_KNOWLEDGE_ID',u.knowledgeId);units.set(u.knowledgeId,u);}
 const pages=new Map(),artifacts=new Map(),elements=new Map();let regionCount=0,censusPages=0,visualPages=0,semanticPages=0;
 const dispositions=['unclassified','instructional','navigation','publication','decorative','mixed'];
 const elementKinds=['text','text_span','image','vector','table','formula','unknown'];
 const elementClasses=['pending','knowledge','duplicate','navigation','decorative','blocked'];
 for(const p of ledger.pages){const sid=p.sourceId,s=sourceIds.get(sid),key=`${sid}:${p.pdfPage}`;need(s&&Number.isInteger(p.pdfPage)&&p.pdfPage>=1&&p.pdfPage<=s.pdfPages,'PAGE_RANGE',key);need(!pages.has(key),'DUPLICATE_PAGE',key);need(dispositions.includes(p.disposition),'PAGE_DISPOSITION',key);need(Array.isArray(p.knowledgeIds),'PAGE_KNOWLEDGE_IDS',key);p.knowledgeIds.forEach(id=>need(units.has(id),'UNKNOWN_PAGE_KNOWLEDGE',`${key}/${id}`));pages.set(key,p);
  const c=p.regionCensus;need(c&&['missing','extracted','visually_reviewed','blocked'].includes(c.status),'CENSUS_STATUS',key);need(Number.isInteger(c.elementCount)&&c.elementCount>=0,'ELEMENT_COUNT',key);
  const sem=p.semanticInventory;need(sem&&['pending','partial','complete_ai','excluded'].includes(sem.status),'SEMANTIC_STATUS',key);
  let els=[];
  if(c.status==='extracted'||c.status==='visually_reviewed'){
   const file=safe(root,c.artifactPath);need(fs.existsSync(file),'MISSING_ARTIFACT',c.artifactPath);need(sha(c.sha256),'ARTIFACT_SHA',key);
   if(!artifacts.has(c.artifactPath)){const bytes=fs.readFileSync(file),doc=readJSON(file);need(doc.schemaVersion===1&&doc.sector===ledger.sector&&Array.isArray(doc.pages),'ARTIFACT_SCHEMA',c.artifactPath);const m=new Map();for(const ap of doc.pages){const asid=ap.sourceId||doc.sourceId;need(sourceIds.has(asid)&&Number.isInteger(ap.pdfPage)&&ap.pdfPage>0&&ap.pdfPage<=sourceIds.get(asid).pdfPages,'ARTIFACT_PAGE_RANGE',`${asid}:${ap.pdfPage}`);const ak=`${asid}:${ap.pdfPage}`;need(!m.has(ak),'ARTIFACT_DUPLICATE_PAGE',ak);need(Array.isArray(ap.elements),'ARTIFACT_ELEMENTS',ak);m.set(ak,ap.elements);}artifacts.set(c.artifactPath,{sha256:hash(bytes),pages:m});}
   const a=artifacts.get(c.artifactPath);need(a.sha256===c.sha256,'STALE_ARTIFACT',key);need(a.pages.has(key),'MISSING_ARTIFACT_PAGE',key);els=a.pages.get(key);need(c.elementCount===els.length,'ELEMENT_COUNT_MISMATCH',key);censusPages++;
   for(const e of els){need(nonempty(e.elementId)&&!elements.has(e.elementId),'DUPLICATE_ELEMENT_ID',e.elementId);need(elementKinds.includes(e.kind)&&elementClasses.includes(e.classification),'ELEMENT_CLASS',e.elementId);need(Array.isArray(e.bbox)&&e.bbox.length===4&&e.bbox.every(Number.isFinite)&&e.bbox[2]>=e.bbox[0]&&e.bbox[3]>=e.bbox[1],'ELEMENT_BBOX',e.elementId);need(sha(e.sha256),'ELEMENT_SHA',e.elementId);need(Array.isArray(e.knowledgeIds),'ELEMENT_KNOWLEDGE_IDS',e.elementId);e.knowledgeIds.forEach(id=>need(units.has(id),'UNKNOWN_ELEMENT_KNOWLEDGE',id));if(e.classification==='knowledge')need(e.knowledgeIds.length>0,'EMPTY_ELEMENT_KNOWLEDGE',e.elementId);if(['duplicate','navigation','decorative','blocked'].includes(e.classification))need(nonempty(e.reason),'ELEMENT_REASON',e.elementId);elements.set(e.elementId,{...e,pageKey:key});regionCount++;}
  } else need(c.elementCount===0,'UNAVAILABLE_ELEMENT_COUNT',key);
  if(c.status==='visually_reviewed'){need(nonempty(c.visualReviewRef),'VISUAL_RECEIPT',key);visualPages++;}
  if(['complete_ai','excluded'].includes(sem.status)){need(c.status==='visually_reviewed'&&nonempty(sem.reviewRef),'SEMANTIC_RECEIPT',key);need(els.every(e=>!['pending','blocked'].includes(e.classification)),'UNCLASSIFIED_PAGE_ELEMENT',key);if(sem.status==='excluded'){need(['navigation','publication','decorative'].includes(p.disposition)&&nonempty(p.exclusionReason),'PAGE_EXCLUSION',key);need(!p.knowledgeIds.length&&els.every(e=>!e.knowledgeIds.length),'EXCLUDED_PAGE_HAS_KNOWLEDGE',key);}else need(p.disposition!=='unclassified','UNCLASSIFIED_PAGE',key);semanticPages++;}
 }
 need(pages.size===expectedPages,'MISSING_PAGE',`${pages.size}/${expectedPages}`);
 for(const s of ledger.sources)for(let n=1;n<=s.pdfPages;n++)need(pages.has(`${s.sourceId}:${n}`),'MISSING_PAGE',`${s.sourceId}:${n}`);
 const fileCache=new Map();
 function evidence(e,kind){need(e&&['file','json-value'].includes(e.sha256Mode),'EVIDENCE_HASH_MODE',kind);need(sha(e.sha256),'EVIDENCE_SHA',kind);need(['candidate','direct'].includes(e.relation)&&typeof e.semanticReviewed==='boolean','EVIDENCE_RELATION',kind);const f=safe(root,e.path);need(fs.existsSync(f),'MISSING_EVIDENCE',e.path);if(!fileCache.has(e.path)){const bytes=fs.readFileSync(f);fileCache.set(e.path,{bytes,sha256:hash(bytes)});}const cached=fileCache.get(e.path);let selected;
  if(e.sha256Mode==='json-value'){if(!Object.hasOwn(cached,'json'))cached.json=readJSON(f);selected=pointer(cached.json,e.jsonPointer);need(hash(JSON.stringify(selected))===e.sha256,'STALE_EVIDENCE',`${e.path}${e.jsonPointer}`);}else need(cached.sha256===e.sha256,'STALE_EVIDENCE',e.path);
  if(e.relation==='direct'){need(e.semanticReviewed===true&&nonempty(e.reviewNote),'DIRECT_EVIDENCE_REVIEW',e.path);if(['teaching','assessment'].includes(kind)&&e.sha256Mode==='file'){need(nonempty(e.locator)&&typeof e.quote==='string'&&e.quote.length>=12,'DIRECT_EVIDENCE_LOCATOR',e.path);need(cached.bytes.toString('utf8').includes(e.quote),'EVIDENCE_QUOTE_MISSING',e.path);}if(kind==='image'){need(!cached.bytes.subarray(0,100).toString().startsWith('version https://git-lfs.github.com/spec/v1'),'IMAGE_IS_LFS_POINTER',e.path);need(nonempty(e.keyObjectiveId)&&nonempty(e.caption)&&nonempty(e.alt)&&nonempty(e.rights),'IMAGE_METADATA',e.path);}}
  return e.relation==='direct'&&e.semanticReviewed;
 }
 let covered=0,teaching=0,assessed=0,excluded=0,duplicates=0,blocked=0;
 for(const u of units.values()){
  const id=u.knowledgeId;need(nonempty(u.statementJa),'KNOWLEDGE_STATEMENT',id);need(Array.isArray(u.sourceRefs)&&u.sourceRefs.length>0,'KNOWLEDGE_SOURCE',id);need(['core','safety','supporting','reference'].includes(u.importance),'IMPORTANCE',id);need(['knowledge','duplicate','excluded','blocked'].includes(u.classification),'KNOWLEDGE_CLASS',id);need(['candidate','partial','covered_ai','duplicate','excluded','blocked'].includes(u.status),'UNIT_STATUS',id);need(Array.isArray(u.conditionsJa)&&Array.isArray(u.exceptionsJa)&&Array.isArray(u.unresolved),'UNIT_FIELDS',id);
  for(const state of ['before','after'])for(const field of ['teaching','assessment'])need(u[state]&&['unknown','missing','partial','present'].includes(u[state][field]),'UNIT_STATE',`${id}/${state}/${field}`);
  let exact=true;
  for(const r of u.sourceRefs){const key=`${r.sourceId}:${r.pdfPage}`,p=pages.get(key);need(p,'UNKNOWN_SOURCE_PAGE',`${id}/${key}`);need(Array.isArray(r.elementIds),'SOURCE_ELEMENTS',id);if(!r.elementIds.length)exact=false;need(p.knowledgeIds.includes(id),'MISSING_PAGE_UNIT_BACKLINK',`${id}/${key}`);for(const eid of r.elementIds){const e=elements.get(eid);need(e&&e.pageKey===key,'UNKNOWN_SOURCE_ELEMENT',`${id}/${eid}`);need(e.knowledgeIds.includes(id),'MISSING_ELEMENT_UNIT_BACKLINK',`${id}/${eid}`);}}
  for(const k of ['teachingEvidence','assessmentEvidence','imageEvidence'])need(Array.isArray(u[k]),'EVIDENCE_ARRAY',`${id}/${k}`);
  const t=u.teachingEvidence.map(e=>evidence(e,'teaching')).some(Boolean),a=u.assessmentEvidence.map(e=>evidence(e,'assessment')).some(Boolean);u.imageEvidence.forEach(e=>evidence(e,'image'));teaching+=Number(t);assessed+=Number(a);
  need(['required','not_required','practical_external'].includes(u.assessmentRequirement),'ASSESSMENT_REQUIREMENT',id);if(u.assessmentRequirement!=='required')need(nonempty(u.assessmentExemptionReason),'ASSESSMENT_EXEMPTION',id);
  need(u.expressionReview&&['pending','independent_ai_checked','permission_required'].includes(u.expressionReview.status),'EXPRESSION_STATUS',id);
  if(u.status==='covered_ai'){need(u.classification==='knowledge'&&exact,'COVERED_SOURCE_NOT_EXACT',id);need(t&&u.after.teaching==='present','COVERED_TEACHING',id);need((a&&u.after.assessment==='present')||u.assessmentRequirement==='not_required','COVERED_ASSESSMENT',id);need(u.expressionReview.status==='independent_ai_checked'&&nonempty(u.expressionReview.note),'COVERED_EXPRESSION',id);need(u.unresolved.length===0,'COVERED_UNRESOLVED',id);need(u.sourceReview?.status==='self_checked_ai'&&u.sourceReview.conditionsChecked===true&&nonempty(u.sourceReview.reviewRef),'COVERED_SOURCE_REVIEW',id);covered++;}
  if(u.status==='duplicate'){need(u.classification==='duplicate'&&units.has(u.duplicateOf)&&u.duplicateOf!==id,'DUPLICATE_TARGET',id);need(!['duplicate','excluded','blocked'].includes(units.get(u.duplicateOf).classification),'DUPLICATE_CHAIN',id);need(nonempty(u.dispositionReason),'DUPLICATE_REASON',id);duplicates++;}
  if(u.status==='excluded'){need(u.classification==='excluded'&&nonempty(u.dispositionReason),'UNIT_EXCLUSION',id);need(u.importance==='reference','CORE_EXCLUDED',id);excluded++;}
  if(u.status==='blocked')blocked++;
 }
 // Reciprocal links prevent counters, orphan regions, or whole-page matches pretending to close facts.
 for(const p of pages.values())for(const id of p.knowledgeIds)need(units.get(id).sourceRefs.some(r=>r.sourceId===p.sourceId&&r.pdfPage===p.pdfPage),'ORPHAN_PAGE_UNIT',id);
 for(const e of elements.values())for(const id of e.knowledgeIds)need(units.get(id).sourceRefs.some(r=>r.elementIds.includes(e.elementId)),'ORPHAN_ELEMENT_UNIT',`${id}/${e.elementId}`);
 need(ledger.denominator&&['open','inventoried_ai'].includes(ledger.denominator.status)&&nonempty(ledger.denominator.reviewNote),'DENOMINATOR',ledger.sector);
 const inventoried=semanticPages===expectedPages&&[...sourceIds.values()].every(s=>s.byteVerified)&&ledger.unresolved.length===0;
 if(ledger.denominator.status==='inventoried_ai')need(inventoried,'FALSE_DENOMINATOR_COMPLETE',ledger.sector);
 const mandatory=[...units.values()].filter(u=>u.classification==='knowledge');
 const fullyCovered=inventoried&&ledger.denominator.status==='inventoried_ai'&&mandatory.length>0&&mandatory.every(u=>u.status==='covered_ai')&&blocked===0;
 need(typeof ledger.wholeSourceKnowledgeCovered==='boolean','WHOLE_COVERAGE_FLAG',ledger.sector);if(ledger.wholeSourceKnowledgeCovered)need(fullyCovered,'FALSE_WHOLE_COVERAGE',ledger.sector);
 const percent=ledger.denominator.status==='inventoried_ai'?Math.round(10000*covered/Math.max(1,mandatory.length))/100:null;
 return {status:'PASS_REGISTRY_CONTRACT',sector:ledger.sector,sources:sourceIds.size,sourcePages:expectedPages,censusPages,visualPages,semanticInventoryPages:semanticPages,regions:regionCount,knowledgeUnits:units.size,teachingDirect:teaching,assessmentDirect:assessed,coveredAi:covered,duplicates,excluded,blocked,sourceCoveragePercent:percent,fullyCovered,expertOrNativeAcceptanceInferred:false};
}
function validateFile(root,file){return validateSector(root,readJSON(safe(root,file)));}
module.exports={validateSector,validateFile,readJSON,pointer,hash,SECTORS};
if(require.main===module){const args=process.argv.slice(2),strict=args.includes('--require-covered'),files=args.filter(a=>a!=='--require-covered');const inputs=files.length?files:SECTORS.map(s=>`docs/ssw-workspace/source-coverage-v2/${s}.json`);let failed=false;for(const file of inputs){try{const r=validateFile(ROOT,file);console.log(JSON.stringify(r));if(strict&&!r.fullyCovered)failed=true;}catch(e){failed=true;console.error(JSON.stringify({status:'FAIL_REGISTRY_CONTRACT',file,code:e.code||'READ_ERROR',message:e.message}));}}if(failed)process.exitCode=1;}
