const fs=require('fs'),z=require('zlib'),crypto=require('crypto'),assert=require('assert/strict');
const dir=__dirname+'/',root=process.cwd(),lp='docs/ssw-workspace/source-coverage-v2/agriculture.json',L='src/data/agriculture/lessons.ja.json',W='src/data/agriculture/weekly-checks.ja.json',M='src/data/agriculture/mock-exams.ja.json';
const read=p=>JSON.parse(fs.readFileSync(p)),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const ledger=read(lp),lessons=read(L).lessons,weekly=read(W).exams,mocks=read(M).exams,artifact=JSON.parse(z.gunzipSync(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture-AGR-S2-regions.json.gz')));
const receipt='docs/ssw-workspace/agriculture/continuation-20261103f/rice/source-review.json';
const specs=[];
function add(suffix,page,start,end,lesson,paragraph,question,statement,conditions=[],extraAssess=[]){specs.push({suffix,page,start,end,lesson,paragraph,question,statement,conditions,extraAssess});}
const c='agr-par12-general-rice-classification-detail',d='agr-par12-general-direct-seeding-comparison',f='agr-par11-riceveg-feed-details',t='agr-workterms-seed-sequence';
add('PAR12-GENERAL-01-01',4,63,76,c,0,'agr-par12-general-q01','アジアイネはアジアを中心として世界で、アフリカイネは西アフリカを中心として栽培される。',['中心地域の説明であり、他地域に存在しないという限定ではない。'],['activityJa']);
add('PAR12-GENERAL-01-02',4,84,101,c,1,'agr-par12-general-q02','インディカでは、細長い粒と、炊飯後に粘りの少ないものが多いという傾向を対応させる。',['全品種の形や食感を一律に確定する基準ではない。']);
add('PAR12-GENERAL-01-03',4,101,120,c,2,'agr-par12-general-q02','ジャポニカでは、短く丸みのある粒と、炊飯後に粘りのあるものが多いという傾向を対応させる。',['主に・多いという限定を保つ。']);
add('PAR12-GENERAL-01-04',4,140,152,c,3,'agr-par12-general-q03','コメという呼び名には玄米と精米後の白米が含まれる。');
add('PAR12-GENERAL-01-05',4,189,207,c,4,'agr-par12-general-q04','栽培場所による区分では水田のイネを水稲、畑のイネを陸稲（オカボ）と呼ぶ。');
add('PAR12-GENERAL-01-06',5,1,49,c,5,'agr-2-m05-q03','資料では日本の稲作はほとんどが水稲で、沖縄県から北海道まで全都道府県に栽培があると説明する。',['主な栽培場所と地理的分布を別の情報として扱う。'],['activityJa']);
add('PAR12-GENERAL-02-02',5,168,181,d,1,'agr-par12-general-q05','直播では育苗・田植え作業の軽減が規模拡大のしやすさにつながる。',['規模拡大の成功保証ではない。']);
add('PAR12-GENERAL-02-03',5,209,220,d,2,'agr-par12-general-q06','直播では気候によって出芽や苗立ちが不安定になりやすい。',['気候による条件付きの起こりやすさを保つ。']);
add('PAR12-GENERAL-02-04',5,221,225,d,3,'agr-par12-general-q06','直播では品種によって倒伏しやすい場合がある。',['全品種の必然的な倒伏には一般化しない。']);
add('PAR12-GENERAL-02-05',5,226,230,d,4,'agr-par12-general-q07','直播の短所には鳥害を受けやすいこともあり、気候による苗立ちや品種による倒伏とは別に整理する。');
add('PAR12-GENERAL-02-06',5,141,157,d,5,'agr-par12-general-q08','機械化一貫体系の稲作について、資料は10a当たりの年間労働時間を約25時間という例で説明する。',['資料掲載値、10a当たり、年間、約を保つ。直播だけの労働時間・削減時間ではない。']);
add('PAR11-RICEVEG-FEED-DETAILS-01',70,143,165,f,0,'agr-par11-riceveg-q01','稲WCS向けには茎葉の多収性に着目した専用品種が育成されている。');
add('PAR11-RICEVEG-FEED-DETAILS-02',70,338,358,f,1,'agr-par11-riceveg-q02','飼料用米の品種には、炊飯食味や玄米品質に左右されないという用途上の評価軸が示される。',['一切の品質確認を不要にする説明ではない。']);
add('PAR11-RICEVEG-FEED-DETAILS-03',70,358,366,f,2,'agr-par11-riceveg-q03','資料では飼料用米に大粒品種が多いという傾向を挙げる。',['全品種が大粒とは限らず、大粒だけで用途を断定しない。']);
add('PAR11-RICEVEG-FEED-DETAILS-04',70,367,406,f,3,'agr-1-m02-q30','資料の販売単価比較では、飼料用米は主食用米より安いため低コスト生産が必要とされる。',['掲載資料の比較であり、現在の個別取引価格を表すものではない。']);
add('PAR11-RICEVEG-FEED-DETAILS-05',70,406,465,f,4,'agr-par11-riceveg-q04','飼料用米の生産費を抑える例として直播・疎植と畜産農家の堆肥利用を、栽培方法と資材利用に分ける。',['堆肥利用の量や費用削減を無条件に保証しない。']);
add('WORKTERMS-SEED-SEQUENCE-01',128,120,171,t,0,'agr-par06-terms-recognition-q04','種子予措は、イネの播種前に行う選種・消毒・浸種・催芽までの準備をまとめた呼び名である。');
add('WORKTERMS-SEED-SEQUENCE-02',128,328,350,t,1,'agr-1-m02-q38','選種の例である塩水選は、不良種子を除くために種子の比重の違いを利用する。',['語の意味から塩水濃度や調製方法を補わない。']);
add('WORKTERMS-SEED-SEQUENCE-03',128,172,212,t,2,'agr-par06-terms-recognition-q06','種子消毒は種子を対象に、伝染性の病気や害虫を防ぐために殺菌・殺虫する作業を指す。');
add('WORKTERMS-SEED-SEQUENCE-04',128,259,278,t,3,'agr-par06-terms-recognition-q05','浸種は、発芽に必要な水分を種子に十分吸収させる段階を指す。');
add('WORKTERMS-SEED-SEQUENCE-05',128,144,171,t,4,'agr-1-m09-q40','種子予措に含まれる作業は選種・消毒・浸種・催芽の順で整理し、どの段階まで終わったかを区別する。',[],['q:agr-1-m10-q15']);
add('WORKTERMS-SEED-SEQUENCE-06',128,144,171,t,5,'agr-1-m09-q38','種子予措の一連の作業は種をまく前の準備であり、苗を植える前の作業と取り違えない。');
function evidence(path,pointer,note){const doc=read(path);let v=doc;for(const k of pointer.slice(1).split('/'))v=v[k];return{path,jsonPointer:pointer,sha256:hash(v),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:note};}
function question(id,note){for(const [path,exams]of [[W,weekly],[M,mocks]])for(let i=0;i<exams.length;i++){const j=exams[i].questions.findIndex(q=>q.id===id);if(j>=0)return evidence(path,`/exams/${i}/questions/${j}`,note);}throw Error(id);}
const changes=[];
for(const s of specs){const id='agriculture-v2-AGR-K-'+s.suffix,old=ledger.knowledgeUnits.find(u=>u.knowledgeId===id);assert.equal(old.status,'candidate');const li=lessons.findIndex(l=>l.id===s.lesson);assert(li>=0);const l=lessons[li];assert(l.paragraphs[s.paragraph].knowledgeIds.includes('AGR-K-'+s.suffix));
 const elements=artifact.pages.find(p=>p.pdfPage===s.page).elements.filter(e=>{const n=+e.elementId.split(':e')[1];return n>=s.start&&n<=s.end;});assert(elements.length);
 const after=structuredClone(old);after.previousSourceRefs=old.sourceRefs;after.sourceRefs=[{sourceId:'AGR-S2',pdfPage:s.page,elementIds:elements.map(e=>e.elementId)}];after.statementJa=s.statement;after.conditionsJa=s.conditions;after.exceptionsJa=[];
 after.teachingEvidence=[evidence(L,`/lessons/${li}/paragraphs/${s.paragraph}`,s.statement+' 既存の独立説明と限定を源頁に自己対照した。')];
 after.assessmentEvidence=[question(s.question,s.statement+' 設問・正答・全誤答理由を自己対照した。')];
 for(const field of s.extraAssess)after.assessmentEvidence.push(field.startsWith('q:')?question(field.slice(2),'催芽の読みを既存の段階順序評価と併せて確認する。'):evidence(L,`/lessons/${li}/${field}`,'実際の学習活動で主な地域の両方、又は水稲中心と全都道府県分布の両方を別欄へ書いて説明する。単独選択問だけで残りの要素を達成扱いにしない。'));
 after.after={teaching:'present',assessment:'present'};after.status='covered_ai';after.unresolved=[];after.expressionReview={status:'independent_ai_checked',note:'既存アプリは分類軸・作業記録・用途比較を学習課題として構成し、原文の逐文言い換えや写真の転載ではない。資料の限定、例と実作業指示の区別を自己確認した。'};after.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:receipt};
 changes.push({knowledgeId:id,beforeSha256:hash(old),after});
}
const packet={schemaVersion:1,baselineCommit:'77af4f21247007bef3bcfa502af34893821a187a',worker:'rice',changes,readerAdditions:[]};
fs.writeFileSync(dir+'packet.json',JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync(dir+'source-review.json',JSON.stringify({schemaVersion:1,worker:'rice',sourceId:'AGR-S2',sourceSha256:'c19741bd8f6128a80d9d9f9e3ab39e8a5e9eb969a30f51771c47527ef6190a12',pdfPages:[4,5,70,128],sourceTextAndPixelsSelfInspected:true,privateRendersCommitted:false,groups:[{name:'栽培地域・形・粘り・加工名・場所・分布',units:6},{name:'直播の経営上の利点、条件別短所と労働時間例',units:5},{name:'WCSと飼料用米の品種・評価・費用',units:5},{name:'種子予措の総称・各段階・播種前という範囲',units:6}],knowledgeIds:changes.map(c=>c.knowledgeId),newlyCoveredAi:changes.length,checks:['source PDF hash verified','source-region ranges include ruby spans','all questions including distractor reasons self-reviewed','existing lesson activities retained as complementary formative assessment for two multi-part units','current JSON-value hashes recomputed','existing IDs/reader data unchanged'],sourceCoveragePercent:null,wholeSourceKnowledgeCovered:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false},null,2)+'\n');
console.log(JSON.stringify({covered:changes.length,groups:4,newRuntimeContent:0,packet:dir+'packet.json'}));
