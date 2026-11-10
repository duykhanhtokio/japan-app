const fs=require('fs'),crypto=require('crypto'),z=require('zlib'),assert=require('assert/strict');
const dir=__dirname+'/',lp='docs/ssw-workspace/source-coverage-v2/agriculture.json';
const read=p=>JSON.parse(fs.readFileSync(p)),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ledger=read(lp),lessons=read('src/data/agriculture/lessons.ja.json').lessons;
const region=JSON.parse(z.gunzipSync(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture-AGR-S2-regions.json.gz')));
const files=['src/data/agriculture/weekly-checks.ja.json','src/data/agriculture/mock-exams.ja.json'];
const questions=new Map();for(const path of files)read(path).exams.forEach((e,i)=>e.questions.forEach((q,j)=>questions.set(q.id,{path,jsonPointer:`/exams/${i}/questions/${j}`,value:q})));
const groups=[
 {id:'nutrient-purpose-and-observation', rows:[
 ['FERTILIZER-NUTRIENTS-01',28,660,739,'土の養分だけでは不足する場合や収穫で持ち出す分があり、肥料は不足する養分を補うために考える。','agr-2-m08-q19'],
 ['FERTILIZER-NUTRIENTS-02',28,737,765,'肥料の三要素の表示は窒素・リン酸・カリであり、リン酸とリン、カリとカリウムの対応を保って元素名と表示名を分ける。','agr-2-m08-q20'],
 ['FERTILIZER-NUTRIENTS-03',29,50,177,'窒素は茎葉の伸長と葉色に関わり、タンパク質などの構成にも関係する。','agr-par03-fertilizer-q01'],
 ['PAR12-SOIL-NUTRIENT-DETAILS-01',29,125,151,'2号の窒素不足の掲載例には、葉色が薄くなるほか、葉が小さくなることがある。','agr-2-m05-q04'],
 ['PAR12-SOIL-NUTRIENT-DETAILS-02',29,227,254,'2号のリン酸の説明は主に開花と結実への影響を示す。','agr-par12-soil-q01'],
 ['PAR12-SOIL-NUTRIENT-DETAILS-03',29,253,305,'アルミニウムや鉄が多い土ではリン酸が水に溶けにくくなり、植物が利用しにくくなる。','agr-par12-soil-q02'],
 ['PAR12-SOIL-NUTRIENT-DETAILS-04',29,380,407,'2号のカリの説明には根の発育への影響がある。','agr-2-m05-q05'],
 ['PAR12-SOIL-NUTRIENT-DETAILS-05',29,406,433,'カリウムの過剰は他の元素の吸収を妨げる。','agr-par12-soil-q03'],
 ['PAR12-SOIL-NUTRIENT-DETAILS-06',29,432,484,'2号のカリ不足の例は、下葉・外葉からの葉縁の褐色化、又は葉全体の斑点である。','agr-par12-soil-q04']
 ]},
 {id:'application-range-and-equipment-functions',rows:[
 ['PAR12-SOIL-APPLICATION-AREA-TOOLS-01',33,74,126,'全面施肥は圃場全面へ、部分施肥は根が伸びる部分へ肥料を施す範囲の区分である。','agr-par12-soil-q05'],
 ['PAR12-SOIL-APPLICATION-AREA-TOOLS-02',33,126,178,'資料は広く根を張らせたい場合に全面施肥を対応させる。','agr-par12-soil-q06'],
 ['PAR12-SOIL-APPLICATION-AREA-TOOLS-03',33,126,178,'資料は無駄を減らしたい場合に部分施肥を対応させる。','agr-par12-soil-q06'],
 ['PAR12-SOIL-APPLICATION-AREA-TOOLS-04',33,335,402,'ブロードキャスタは粒状の肥料や土壌改良材を広い範囲に散布する用途で示される。','agr-par12-soil-q07',70,225],
 ['PAR12-SOIL-APPLICATION-AREA-TOOLS-05',33,335,402,'マニュアスプレッダは堆肥などの有機物を圃場全面へ散布する用途で示される。','agr-par12-soil-q07',229,377],
 ['PAR12-SOIL-APPLICATION-AREA-TOOLS-06',33,335,402,'ライムソーワの掲載用途は粉末状・砂状の石灰や有機質肥料の散布である。','agr-par12-soil-q08',385,535]
 ]},
 {id:'formulation-materials-and-duration',rows:[
 ['PAR22-FERTILIZER-01',30,355,382,'2号の窒素肥料の欄で硝安は硝酸アンモニウムという名称と対応する。','agr-2-m05-q18'],
 ['PAR22-FERTILIZER-02',30,228,305,'配合肥料は主に化学肥料の単肥を混ぜて作り、有機質肥料を混ぜたものが多いという傾向が示される。','agr-2-m05-q19'],
 ['PAR22-FERTILIZER-03',30,712,790,'牛ふん・豚ぷん・鶏ふんを主材料として積み発酵させた堆肥は、主な材料に対応した名前で区別される。','agr-2-m05-q20'],
 ['PAR22-FERTILIZER-04',31,380,433,'遅効性肥料の例には、微生物分解を経る有機質肥料と、成分が溶けにくい化学肥料の異なる経路がある。','agr-2-m02-q40'],
 ['PAR22-FERTILIZER-05',31,279,331,'2号の緩効性肥料には効果が一年以上続くものもあるが、全製品の一律の期間ではない。','agr-2-m05-q21'],
 ['PAR22-FERTILIZER-06',31,483,662,'円筒形のペレット状という形状と、化学肥料・有機質肥料を混ぜるという材料の情報は別に扱う。','agr-2-m02-q39']
 ]},
 {id:'essential-elements-transport-and-constitution',rows:[
 ['S30-SOIL-DETAIL-03',28,406,433,'生育に不可欠な養分をまとめて必須元素という。','agr-2-m06-q09'],
 ['S30-SOIL-DETAIL-04',28,509,611,'2号の養分の説明で炭素は空気中の二酸化炭素を葉から取り込む経路に対応する。','agr-s30-soil-detail-q02'],
 ['S30-SOIL-DETAIL-05',28,509,611,'2号の養分の説明で水素・酸素は根から水を吸収する経路にも対応する。','agr-s30-soil-detail-q02'],
 ['S30-SOIL-DETAIL-06',29,151,178,'2号は窒素がタンパク質や葉緑体の構成成分として生育・収量性に関わることを示す。','agr-2-m06-q12']
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
 after.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:'docs/ssw-workspace/agriculture/continuation-20261103f/soil/receipt.json'};
 updates.push({knowledgeId,beforeSha256:hash(before),before,after,groupId:group.id});
}
assert.equal(updates.length,25);
fs.writeFileSync(dir+'proposal.json',JSON.stringify({schemaVersion:1,baselineCommit:'77af4f21247007bef3bcfa502af34893821a187a',canonicalUpdates:updates,readerAdditions:[]},null,2)+'\n');
fs.writeFileSync(dir+'receipt.json',JSON.stringify({schemaVersion:1,sector:'agriculture',baselineCommit:'77af4f21247007bef3bcfa502af34893821a187a',source:{sourceId:'AGR-S2',sha256:'c19741bd8f6128a80d9d9f9e3ab39e8a5e9eb969a30f51771c47527ef6190a12',byteVerified:true,pagesTextAndPixelsSelfRead:[28,29,30,31,32,33]},groups:groups.map(g=>({id:g.id,coveredAiProposed:g.rows.length})),sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false,appContentChanged:false,newQuestions:0,notClosed:['Whole source page inventories and full diagrams remain open.','Fertilizer-types-03 needs assessment of the complete two-or-more plus 10% condition; current linked question tests mixing only.','No learner duration or responsive/physical device acceptance is inferred.','Existing approved 35–55% policy and all 449 accepted units preserved.']},null,2)+'\n');
console.log('SOIL_F_PACKET:25 units,4 successive source-backed groups');
