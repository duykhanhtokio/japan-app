const fs=require('fs'),crypto=require('crypto'),z=require('zlib'),assert=require('assert/strict');
const dir=__dirname+'/',lp='docs/ssw-workspace/source-coverage-v2/agriculture.json';
const read=p=>JSON.parse(fs.readFileSync(p)),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ledger=read(lp),lessons=read('src/data/agriculture/lessons.ja.json').lessons;
const region=JSON.parse(z.gunzipSync(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture-AGR-S2-regions.json.gz')));
const files=['src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/mock-exams.ja.json'];
const questions=new Map();for(const path of files)read(path).exams.forEach((e,i)=>e.questions.forEach((q,j)=>questions.set(q.id,{path,jsonPointer:`/exams/${i}/questions/${j}`,value:q})));
const groups=[
{id:'soil-texture-observation-and-gaps',rows:[
['SOIL-TEXTURE-03',21,437,630,'土性表の保肥力は埴土・埴壌土・壌土で良い、砂壌土で少し悪い、砂土で悪いという対応である。','agr-1-m05-q21'],
['SOIL-TEXTURE-04',21,437,630,'土性表の水はけは埴土で悪い、埴壌土で少し悪い、壌土・砂壌土・砂土で良いという対応である。','agr-water-soil-q06'],
['SOIL-TEXTURE-06',22,50,340,'握って固まらない、少し固まりひびが入る、固まるという状態は、土性の見当を付ける簡易な観察として区別する。','agr-2-m08-q09']
]},
{id:'physical-chemical-biological-factors',rows:[
['SOIL-BIOLOGICAL-2-01',24,340,475,'2号の地力の説明は、物理的・化学的・生物的要因の三面に分けて考える。','agr-2-m03-q12'],
['SOIL-BIOLOGICAL-2-02',24,340,475,'耕うんの難しさ、排水性、保水性は、地力を考える物理的要因の例である。','agr-2-m03-q13'],
['SOIL-BIOLOGICAL-2-03',24,340,475,'養分保持力、pH、酸化還元電位は地力を考える化学的要因の例である。','agr-2-m03-q14'],
['SOIL-BIOLOGICAL-2-04',24,340,475,'有機物分解や窒素固定には土壌微生物・土壌動物が関わり、生物的要因として扱う。','agr-2-m03-q15'],
['SOIL-BIOLOGICAL-2-06',24,470,560,'土壌微生物の拮抗・共生などの関係を通して多様性が保たれると、よい土の環境が整いやすい。','agr-par21-g1-q04']
]},
{id:'replanting-intervals-and-limits',rows:[
['SOIL-DETAIL-ROTATION-INTERVALS-2-01',27,450,583,'2号の年数は同じ野菜を再び植えるまでの目安で、土壌や気候の状況によって異なる。','agr-par08-soil-details-q01'],
['SOIL-DETAIL-ROTATION-INTERVALS-2-02',27,477,506,'2号はショウガ・ゴボウなどの再作付け間隔を4～5年の目安として示す。','agr-par08-soil-details-q02'],
['SOIL-DETAIL-ROTATION-INTERVALS-2-03',27,505,532,'2号はトマト・ナス・ピーマン・サトイモなどの再作付け間隔を3～4年の目安として示す。','agr-2-m04-q16'],
['SOIL-DETAIL-ROTATION-INTERVALS-2-04',27,505,557,'2号はキュウリ・スイカ・ジャガイモ・ハクサイなどを2～3年、ダイコン・ニンジン・ホウレンソウなどを1～2年の再作付け目安として示す。','agr-par08-soil-details-q03'],
['SOIL-DETAIL-ROTATION-INTERVALS-2-05',27,556,583,'2号はトウモロコシ・カボチャ・サツマイモなどを連作可能な例として挙げる。','agr-par08-soil-details-q04']
]}
];
const updates=[];
for(const group of groups)for(const [suffix,page,y0,y1,statement,qid,x0=0,x1=600] of group.rows){
 const knowledgeId='agriculture-v2-AGR-K-'+suffix,before=ledger.knowledgeUnits.find(u=>u.knowledgeId===knowledgeId);assert.equal(before.status,'candidate');
 const li=lessons.findIndex(l=>l.id===before.legacyRefs.lessonIds[0]),pi=lessons[li].paragraphs.findIndex(p=>p.knowledgeIds.includes('AGR-K-'+suffix));assert(pi>=0);
 const para=lessons[li].paragraphs[pi],q=questions.get(qid);assert(q);const elements=region.pages.find(p=>p.pdfPage===page).elements.filter(e=>e.kind==='text_span'&&e.bbox[0]>=x0&&e.bbox[2]<=x1&&e.bbox[1]>=y0&&e.bbox[3]<=y1);assert(elements.length>0);
 const after=structuredClone(before);after.previousSourceRefsSoilF=after.sourceRefs;after.sourceRefs=[{sourceId:'AGR-S2',pdfPage:page,elementIds:elements.map(e=>e.elementId)}];after.statementJa=statement;
 after.conditionsJa=['掲載された用語・関係・用途の学習範囲。症状例や用途の説明だけから全作物共通の施肥量、診断、実機設定を決定しない。'];
 if(suffix==='PAR22-FERTILIZER-02')after.conditionsJa.push('「主に」「多い」は原料の傾向であり、全製品共通の原料保証ではない。');
 if(suffix==='PAR22-FERTILIZER-05')after.conditionsJa.push('一年以上という説明は長く続くものの例であり全製品への保証ではない。');
 const ev=(path,pointer,value,note)=>({path,jsonPointer:pointer,sha256:hash(value),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:note});
 after.teachingEvidence=[ev('src/data/agriculture/lessons.ja.json',`/lessons/${li}/paragraphs/${pi}/textJa`,para.textJa,'Self-read verified AGR-S2 page text and pixels, then current paragraph. This teaches the stated relationship/condition, not whole-page coverage.')];
 after.assessmentEvidence=[ev(q.path,q.jsonPointer,q.value,'Self-read stem, all options, answer and reasons. Tests this named relationship/condition directly; combined questions retain distinct compared relationships.')];
 after.after={teaching:'present',assessment:'present'};after.status='covered_ai';after.unresolved=[];
 after.expressionReview={status:'independent_ai_checked',note:'App organizes the verified fact as an occupational observation/comparison exercise with independent explanations and distractors; no source page, prose or figure reproduction is proposed.'};
 after.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:'docs/ssw-workspace/agriculture/continuation-20261103f/soil/receipt-soil-details.json'};
 if(suffix.startsWith('SOIL-DETAIL-ROTATION-INTERVALS'))after.conditionsJa.push('土壌や気候により異なる目安であり、記載年数や連作可能という例は病害虫・養分の問題がない保証ではない。');
 if(suffix==='SOIL-TEXTURE-03'||suffix==='SOIL-TEXTURE-04'){after.status='partial';after.after.assessment='partial';after.unresolved=['Current linked question tests only one row or one property; remaining table-row relationships are taught but not fully assessed.'];}
 updates.push({knowledgeId,beforeSha256:hash(before),before,after,groupId:group.id});
}
assert.equal(updates.length,13);
fs.writeFileSync(dir+'proposal-soil-details.json',JSON.stringify({schemaVersion:1,baselineCommit:'77af4f21247007bef3bcfa502af34893821a187a',canonicalUpdates:updates,readerAdditions:[]},null,2)+'\n');
fs.writeFileSync(dir+'receipt-soil-details.json',JSON.stringify({schemaVersion:1,sector:'agriculture',baselineCommit:'77af4f21247007bef3bcfa502af34893821a187a',source:{sourceId:'AGR-S2',sha256:'c19741bd8f6128a80d9d9f9e3ab39e8a5e9eb969a30f51771c47527ef6190a12',byteVerified:true,pagesTextAndPixelsSelfRead:[21,22,24,25,27]},groups:groups.map(g=>({id:g.id,unitsProposed:g.rows.length})),sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,appContentChanged:false,newQuestions:0,notClosed:['Whole source page inventories and full diagrams remain open.','Fertilizer-types-03 needs assessment of the complete two-or-more plus 10% condition; current linked question tests mixing only.','No learner duration or responsive/physical device acceptance is inferred.','Existing approved 35–55% policy and all 449 accepted units preserved.']},null,2)+'\n');
console.log('SOIL_F_DETAILS:13 units,11covered+2partial,3 additional groups');
