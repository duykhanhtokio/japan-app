// Adversarial coverage tests: false 100%, lost regions, stale evidence and keyword-only matches.
const {validateSector,hash}=require('./check.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path'),assert=require('node:assert/strict'),zlib=require('node:zlib');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'coverage-v2-test-'));const copy=x=>JSON.parse(JSON.stringify(x));let checks=0;
try{
 const teaching={body:'A newly authored explanation with source conditions.'},question={prompt:'Apply the condition in an independently authored case.',answer:1};
 fs.writeFileSync(path.join(dir,'lesson.json'),JSON.stringify(teaching));fs.writeFileSync(path.join(dir,'question.json'),JSON.stringify(question));
 const regions={schemaVersion:1,sector:'food',sourceId:'source',pages:[{pdfPage:1,elements:[{elementId:'source:1:text',kind:'text_span',bbox:[1,2,30,40],sha256:'a'.repeat(64),fontSize:5,classification:'knowledge',knowledgeIds:['k1'],reason:null}]}]};
 const bytes=zlib.gzipSync(Buffer.from(JSON.stringify(regions)),{mtime:0});fs.writeFileSync(path.join(dir,'regions.json.gz'),bytes);
 const ev=(p,v,ptr)=>({path:p,jsonPointer:ptr,sha256:hash(JSON.stringify(v)),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:'Self-checked exact claim and its condition, not shared topic.'});
 const unit={knowledgeId:'k1',sourceRefs:[{sourceId:'source',pdfPage:1,elementIds:['source:1:text']}],statementJa:'独立した条件付きの知識説明',conditionsJa:['条件を確認する'],exceptionsJa:[],importance:'core',classification:'knowledge',before:{teaching:'missing',assessment:'missing'},after:{teaching:'present',assessment:'present'},teachingEvidence:[ev('lesson.json',teaching.body,'/body')],assessmentEvidence:[ev('question.json',question,'')],imageEvidence:[],assessmentRequirement:'required',assessmentExemptionReason:null,expressionReview:{status:'independent_ai_checked',note:'New scenario and explanation; no source prose or copied visual.'},sourceReview:{status:'self_checked_ai',conditionsChecked:true,reviewRef:'source-page-1-self-review'},status:'covered_ai',unresolved:[],review:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false}};
 const baseline={schemaVersion:2,sector:'food',baselineCommit:'b'.repeat(40),sources:[{sourceId:'source',sha256:'c'.repeat(64),pdfPages:1,byteVerified:true,verificationRef:'source hash/page receipt'}],pages:[{sourceId:'source',pdfPage:1,disposition:'instructional',exclusionReason:null,regionCensus:{artifactPath:'regions.json.gz',sha256:hash(bytes),elementCount:1,status:'visually_reviewed',visualReviewRef:'private visual review receipt'},semanticInventory:{status:'complete_ai',reviewRef:'every element and condition checked'},knowledgeIds:['k1']}],knowledgeUnits:[unit],denominator:{status:'inventoried_ai',reviewNote:'Complete reviewed one-page fixture only'},wholeSourceKnowledgeCovered:true,review:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false},unresolved:[]};
 const good=validateSector(dir,baseline);assert(good.fullyCovered);assert.equal(good.sourceCoveragePercent,100);assert.equal(good.instructionalPagesCoveredAi,1);checks++;
 function reject(name,edit,code){const x=copy(baseline);edit(x);assert.throws(()=>validateSector(dir,x),e=>e.code===code,name);checks++;}
 reject('missing page',x=>x.pages=[],'MISSING_PAGE');
 reject('missing tiny-font region count',x=>x.pages[0].regionCensus.elementCount=0,'ELEMENT_COUNT_MISMATCH');
 reject('stale artifact bytes',x=>x.pages[0].regionCensus.sha256='d'.repeat(64),'STALE_ARTIFACT');
 reject('keyword match is not direct teaching',x=>x.knowledgeUnits[0].teachingEvidence[0].relation='candidate','COVERED_TEACHING');
 reject('unreviewed semantics',x=>x.knowledgeUnits[0].teachingEvidence[0].semanticReviewed=false,'DIRECT_EVIDENCE_REVIEW');
 reject('stale translation/paragraph revision',x=>x.knowledgeUnits[0].teachingEvidence[0].sha256='d'.repeat(64),'STALE_EVIDENCE');
 reject('whole-page link cannot close exact idea',x=>x.knowledgeUnits[0].sourceRefs[0].elementIds=[],'COVERED_SOURCE_NOT_EXACT');
 reject('source conditions must be checked',x=>x.knowledgeUnits[0].sourceReview.conditionsChecked=false,'COVERED_SOURCE_REVIEW');
 reject('copied/unreviewed expression cannot close',x=>x.knowledgeUnits[0].expressionReview.status='pending','COVERED_EXPRESSION');
 reject('missing assessment',x=>x.knowledgeUnits[0].assessmentEvidence=[],'COVERED_ASSESSMENT');
 reject('blank assessment exemption',x=>x.knowledgeUnits[0].assessmentRequirement='not_required','ASSESSMENT_EXEMPTION');
 reject('unresolved cannot close',x=>x.knowledgeUnits[0].unresolved=['label unreadable'],'COVERED_UNRESOLVED');
 reject('exclusion cannot hide safety',x=>{const u=x.knowledgeUnits[0];u.status='excluded';u.classification='excluded';u.importance='safety';u.dispositionReason='too short';},'CORE_EXCLUDED');
 reject('duplicate cannot point to itself',x=>{const u=x.knowledgeUnits[0];u.status='duplicate';u.classification='duplicate';u.duplicateOf='k1';},'DUPLICATE_TARGET');
 reject('false complete census',x=>{x.pages[0].semanticInventory.status='partial';},'FALSE_DENOMINATOR_COMPLETE');
 reject('false 100 percent with open denominator',x=>x.denominator.status='open','FALSE_WHOLE_COVERAGE');
 reject('missing source bytes cannot freeze denominator',x=>x.sources[0].byteVerified=false,'FALSE_DENOMINATOR_COMPLETE');
 reject('unsupported human review claim',x=>x.review.humanReviewed=true,'UNSUPPORTED_REVIEW_CLAIM');
 reject('unsupported native review claim',x=>x.review.nativeReviewed=true,'UNSUPPORTED_REVIEW_CLAIM');
 reject('unsupported measured learner time',x=>x.review.learnerDurationMeasured=true,'UNSUPPORTED_REVIEW_CLAIM');
 reject('unsupported unit expert review',x=>x.knowledgeUnits[0].review.domainReviewed=true,'UNSUPPORTED_REVIEW_CLAIM');
 reject('path traversal',x=>x.knowledgeUnits[0].teachingEvidence[0].path='../lesson.json','UNSAFE_PATH');
 const partial=copy(baseline);partial.denominator.status='open';partial.pages[0].semanticInventory.status='partial';partial.wholeSourceKnowledgeCovered=false;partial.knowledgeUnits[0].status='partial';const result=validateSector(dir,partial);assert.equal(result.sourceCoveragePercent,null);assert.equal(result.fullyCovered,false);assert.equal(result.instructionalPagesCoveredAi,0);checks++;
 const {scan}=require('./check-artifact-privacy.cjs');
 scan({elementId:'x',kind:'text',sha256:'a'.repeat(64),font:'Noto',textLength:5});checks++;
 for(const payload of [{text:'Original source paragraph'},{elements:[{rawText:'raw source'}]},{imageBytes:[1,2]},{drawingCommands:['line']},{meta:{dataUrl:'data:image/png'}}]){assert.throws(()=>scan(payload),/RAW_SOURCE_PAYLOAD/);checks++;}
 console.log(JSON.stringify({status:'PASS_ADVERSARIAL_COVERAGE_GATE',checks,smallFontRetained:true,compressedArtifactsVerified:true,semanticAcceptanceNotInferredFromCounts:true,sourcePayloadHygieneProbes:true}));
}finally{fs.rmSync(dir,{recursive:true,force:true});}
