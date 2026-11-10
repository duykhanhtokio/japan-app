const fs=require('fs'),z=require('zlib'),crypto=require('crypto'),assert=require('assert/strict');
const dir='docs/ssw-workspace/agriculture/continuation-20261104a/orchard/',receipt=dir+'source-review.json';
const ledger=JSON.parse(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture.json')),assigned=new Set(JSON.parse(fs.readFileSync('docs/ssw-workspace/agriculture/continuation-20261104a/assignments.json')).orchard),lp='src/data/agriculture/lessons.ja.json',lessons=JSON.parse(fs.readFileSync(lp)).lessons;
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex'),regions=Object.fromEntries(['AGR-S1','AGR-S2'].map(s=>[s,JSON.parse(z.gunzipSync(fs.readFileSync('docs/ssw-workspace/source-coverage-v2/agriculture-'+s+'-regions.json.gz')))]));
const refs=(s,p,y0,y1,x0=0,x1=1000)=>{const es=regions[s].pages.find(x=>x.pdfPage===p).elements.filter(e=>(e.kind==='text_span'||s==='AGR-S2'&&p===98&&y0===53&&e.kind==='vector')&&e.bbox[1]>=y0-5&&e.bbox[1]<y1&&e.bbox[0]>=x0-5&&e.bbox[0]<x1);assert(es.length,`${s}/${p}/${y0}`);return {sourceId:s,pdfPage:p,elementIds:es.map(e=>e.elementId)};};
function ev(path,jsonPointer,reviewNote){let v=JSON.parse(fs.readFileSync(path));for(let k of jsonPointer.slice(1).split('/'))v=v[k];assert(v!==undefined,jsonPointer);return {path,jsonPointer,sha256:hash(v),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote};}
const qs=[];for(const f of ['weekly-checks.ja.json','mock-exams.ja.json']){const path='src/data/agriculture/'+f;for(const [ei,e]of JSON.parse(fs.readFileSync(path)).exams.entries())for(const [qi,q]of e.questions.entries())qs.push({q,path,ptr:`/exams/${ei}/questions/${qi}`});}
function qev(id,note){const a=qs.find(x=>x.q.id===id);assert(a,id);assert.equal(a.q.lessonSourceHash,lessons.find(l=>l.id===a.q.lessonId).sourceHash);return ev(a.path,a.ptr,note+' Stem, all options, correct index and four rationales self-read; no neighbouring knowledge inferred.');}
const rows=[];
function add(lid,pi,statement,rects,qids=[],activityNote=null,gap=null){const li=lessons.findIndex(l=>l.id===lid),l=lessons[li];assert(l);const id='agriculture-v2-'+l.paragraphs[pi].knowledgeIds[0],old=ledger.knowledgeUnits.find(u=>u.knowledgeId===id);assert(assigned.has(id),id);assert(!['covered_ai','duplicate','excluded'].includes(old.status));let ae=qids.map(q=>qev(q,'This question directly tests '+statement));if(activityNote)ae.push(ev(lp,`/lessons/${li}/activityJa`,activityNote));assert(ae.length||gap);const after={...structuredClone(old),statementJa:statement,conditionsJa:['資料の対象・例・年・期間・区分を保持する。名称の照合は実物識別や実際の操作の認定ではない。'],exceptionsJa:[],sourceRefs:rects.map(r=>refs(...r)),after:{teaching:'present',assessment:gap?'partial':'present'},teachingEvidence:[ev(lp,`/lessons/${li}/paragraphs/${pi}/textJa`,'Owner compared the full current paragraph with the specific private source clauses/table cells/diagram labels. Only the independently stated factual relation and its conditions are mapped.')],assessmentEvidence:ae,expressionReview:{status:'independent_ai_checked',note:'Existing independently authored app teaching and original assessment scenarios self-compared. No source prose, distinctive source tables, source figures or page images reproduced. Concise factual objectives only.'},sourceReview:{status:'self_checked_ai',conditionsChecked:true,reviewRef:receipt},status:gap?'partial':'covered_ai',unresolved:gap?[gap]:[]};rows.push({knowledgeId:id,beforeSha256:hash(old),after});}
const S1=(p,a,b,x0=0,x1=1000)=>['AGR-S1',p,a,b,x0,x1],S2=(p,a,b,x0=0,x1=1000)=>['AGR-S2',p,a,b,x0,x1];
// Group 1: classification, environment and flower differentiation.
add('agr-fruit',1,'カンキツ類とビワは常緑果樹に含まれる。',[S1(7,706,737),S2(6,202,218)],['agr-1-w01-q07']);
add('agr-fruit',2,'リンゴ・ブドウ・ナシ・モモ・カキは落葉果樹の例である。',[S2(6,227,242)],['agr-1-m03-q13','agr-1-w01-q07']);
add('agr-fruit',3,'リンゴは寒い地域、ウンシュウミカンは暖かい地域で多く栽培される傾向として読む。',[S1(7,762,792)],['agr-1-w01-q08']);
add('agr-fruit',4,'常緑・落葉の分類と寒暖による栽培地域の傾向を別の情報として整理する。',[S1(7,706,792)],['agr-1-w01-q08']);
const fl=[
['栄養成長後に花芽が形成される段階が花芽分化であり、開花とは異なる。',S1(10,70,122),['agr-shared-w02-q09']],
['トマトは一定の成長後に規則的に花芽分化する例である。',S1(10,146,184),['agr-shared-w02-q10']],
['温度と日長などの環境条件は、区別して花芽分化と対応させる。',S1(10,198,233),['agr-1-m05-q14']],
['イチゴ・キクは一定より長い暗期で花芽分化する短日植物の例である。',S1(10,249,292),['agr-shared-w02-q11','agr-shared-w02-q10']],
['ホウレンソウは一定より短い暗期で花芽分化する長日植物の例である。',S1(10,300,340),['agr-1-m03-q34']],
['ダイコン・キャベツ・ブロッコリーには低温による花芽分化が示されている。',S1(10,351,393),['agr-shared-w02-q12']]];
fl.forEach(([s,r,q],i)=>add('agr-flowering',i,s,[r],q));
const cal=[
['切り花と鉢物は、生育年数ではなく出荷・利用する形の違いである。',[S1(64,300,340)],['agr-1-m07-q15']],
['周年出荷は作型・系統などを組み合わせ一年を通して出荷することで、一株の連続開花を意味しない。',[S1(64,508,544)],['agr-par06-facility-structure-q06']],
['秋ギクの開花調節では短日性と昼夜の長さを考える。',[S1(64,453,493)],['agr-1-m07-q36','agr-2-m09-q07']],
['秋ギクへの夜間電照は開花を遅らせることをねらう。',[S1(64,453,493)],['agr-par06-facility-structure-q05']],
['夏ギク・夏秋ギク・秋ギクなどの系統を組み合わせ周年出荷する。',[S1(64,508,544)],['agr-par06-facility-structure-q06'],'The scheduled activity explicitly requires explaining the combination of chrysanthemum lines, separately from night lighting and lily bulb treatment.' ],
['ユリの球根への低温処理などは時期調節に使われ、キクの電照とは方法が異なる。',[S1(65,74,160),S2(84,325,387)],['agr-2-m09-q09']]];
cal.forEach(([s,r,q,a],i)=>add('agr-facility-structure-flower-calendar',i,s,r,q,a));
const forms=[
['切り花は利用形態であり、花木・宿根草・球根類という植物体の型とは別の分類である。',[S1(64,300,340),S1(64,402,442),S1(64,608,648),S1(65,74,83)],['agr-1-m07-q15','agr-1-m07-q07']],
['バラは花木として育つ植物を切り花として利用する例である。',[S1(64,608,648)],['agr-1-m07-q07','agr-2-m09-q10']],
['キクは宿根草で、主な繁殖方法はさし芽である。',[S1(64,402,442)],['agr-1-m07-q29','agr-2-m09-q11']],
['テッポウユリ・アジアティック系・オリエンタル系などのユリを球根から育てて切り花にする。',[S1(65,74,160)],['agr-par06-facility-structure-q08'],'The current four-flower activity asks the plant type and the propagation/form described in the text; lily examples are retained as examples rather than cultivar identification.' ],
['スプレータイプのカーネーションでは一本の茎に複数の花がつく。',[S1(65,249,316)],['agr-par06-facility-structure-q07']],
['カーネーションの四季咲き性とスタンダード／スプレーという花型を区別する。',[S1(65,329,368)],['agr-1-m07-q05','agr-2-m09-q12']]];
forms.forEach(([s,r,q,a],i)=>add('agr-facility-structure-flower-forms',i,s,r,q,a));
// Group 2: perennial planning, buds and diagram interpretation.
const life=[
['植え付け直後の数年間は木を育てる段階で、成木と同量の収穫を最初から計画しない。',[S2(97,686,750)],['agr-par06-fruit-foundations-q01']],
['果樹の一生の模式図は幼木・若木・成木・老木の順で表される。',[S2(98,53,373)],['agr-1-m01-q27']],
['樹体の大きさと結実量は異なる指標なので、図の二本の線を別々に記録する。',[S2(98,53,373)],['agr-1-m01-q28']],
['模式図では成木期から老木期に樹体の大きさと結実量が低下する。',[S2(98,53,373)],['agr-1-m01-q29']],
['種類による違いを条件として20～40年の収穫期間が示され、模式図から全樹種の開始年を固定しない。',[S2(97,737,752),S2(98,53,373)],['agr-1-m09-q13','agr-par06-fruit-foundations-q02']]];
life.forEach(([s,r,q],i)=>add('agr-fruit-foundation-life',i,s,r,q));
const buds=[
['葉芽と花芽は役割が違い、せん定の前に区別して観察する。',[S2(98,457,492)],['agr-par06-fruit-foundations-q03','agr-par21-facility-fruit-q04']],
['多くの果樹は収穫する前年に花芽を形成するため、前年の枝・芽も確認する。',[S2(98,508,544)],['agr-2-m01-q20']],
['モモやオウトウでは前年に伸びた枝に花芽が付く。',[S2(98,559,594)],['agr-par06-fruit-foundations-q03'],'The current activity explicitly compares peach and grape flower-bearing branches, while the paragraph retains sweet cherry as an additional source example.' ],
['ブドウは今年新しく伸びる枝に花を付ける型として前年枝への直接着花と区別する。',[S2(98,584,621),S2(100,67,164,390,600)],['agr-1-m10-q03','agr-2-m09-q31']],
['ウンシュウミカンには掲載された花芽を付ける枝の二つの型がある。',[S2(98,606,620)],['agr-1-m09-q37']],
['花芽分化を助ける管理は窒素の効き過ぎを抑え、弱いせん定・結実過多回避・やや少なめの土壌水分を区別して考える。',[S2(98,660,777)],['agr-par06-fruit-foundations-q04']]];
buds.forEach(([s,r,q,a],i)=>add('agr-fruit-foundation-buds',i,s,r,q,a));
add('agr-fruit-foundation-definition-2',1,'2号では一年以内に枯れる草であるメロン・スイカを、果実を取っても野菜として扱う。',[S2(97,202,240)],['agr-2-m02-q04'],'The existing activity requires explaining melon classification using life span and plant character, directly applying the one-year distinction.');
add('agr-fruit-foundation-definition-2',2,'クリ・ウメは多年生の木から実を収穫するため、日常の呼称によらず果樹として扱う。',[S2(97,253,291)],['agr-2-m03-q37']);
add('agr-fruit-foundation-definition-2',3,'果実収穫を目的として2年以上育てる木本・草本という定義の条件を同時に保つ。',[S2(97,151,188)],['agr-2-m02-q04']);
add('agr-fruit-foundation-definition-2',4,'2021年の例では収穫量と生産額を別の指標とし、掲載群を現在の順位へ替えない。',[S2(97,559,596)],['agr-2-m09-q05'],'Activity explicitly asks both quantity and value examples with their reference year; it is an open book retrieval, not a claim of current rankings.');
const pat=[
['葉芽は葉、純正花芽は花だけ、混合花芽は葉と花を出す。',[S2(98,457,492)],['agr-par21-facility-fruit-q04']],
['枝の図の印は凡例で葉芽・花芽・果実などを区別してから読む。',[S2(100,530,581)],['agr-2-m03-q38']],
['第1型では前年の枝に付いた花芽がその位置で開花・結実する。',[S2(100,67,164,0,220)],['agr-2-m01-q29']],
['第2型では前年の結果枝の先端や頂部腋芽が少し伸びた先で開花・結実する。',[S2(100,67,164,220,390)],['agr-2-m01-q29']],
['第3型では今年伸びた新梢の葉腋に花芽を付けて開花・結実する。',[S2(100,67,164,390,600)],['agr-2-m01-q29']]];
pat.forEach(([s,r,q],i)=>add('agr-fruit-foundation-bud-patterns-2',i,s,r,q));
// Group 3: source table relations and their exact assessment bounds.
add('agr-flower-work-classification',0,'花きの園芸的分類は形態・生育習性・栽培や利用方法に基づき、自然分類とは目的が異なる。',[S2(124,147,234),S2(124,300,364)],['agr-par06-flowers-q01']);
add('agr-flower-work-classification',1,'掲載表でサルビアは非耐寒性一年草、パンジーは耐寒性一年草に分けられる。',[S2(124,400,505)],['agr-par06-flowers-q02']);
add('agr-flower-work-classification',2,'ジギタリスとカンパニュラは二年草の掲載例である。',[S2(124,507,529)],['agr-2-m04-q01']);
add('agr-flower-work-classification',3,'キク・カーネーション・ガーベラは宿根草の例だが、実際の経営上の栽培期間は別に確認する。',[S2(124,531,588),S2(125,620,648)],['agr-2-m04-q02']);
add('agr-flower-work-classification',4,'プリムラ類は本来宿根草の性質を持つが園芸利用上は一年草に分類される例である。',[S2(124,325,364)],['agr-par06-flowers-q03']);
add('agr-flower-work-organs',0,'球根類の内部はりん茎・球茎・塊茎・根茎・塊根に分かれ、全てを根としない。',[S2(124,594,730)],['agr-2-m04-q03']);
add('agr-flower-work-organs',2,'シクラメンは塊茎、カンナは根茎の掲載例として区別する。',[S2(124,661,706)],['agr-2-m04-q04']);
add('agr-flower-work-organs',5,'観葉植物のフィカスとハーブのミントを利用区分で区別し、区分だけで全ての栽培条件を決めない。',[S2(125,164,286)],['agr-2-m04-q06'],'Scheduled activity requires Ficus and mint groups and explicitly separates name matching from actual recognition.');
add('agr-flower-details-table-examples',0,'ペチュニアとニチニチソウは掲載表の非耐寒性一年草の例である。',[S2(124,400,455)],['agr-2-m04-q32']);
add('agr-flower-details-table-examples',2,'ビジョナデシコはジギタリスやカンパニュラと同じ二年草の欄にある。',[S2(124,507,529)],['agr-2-m04-q33','agr-2-m04-q01']);
add('agr-flower-details-table-examples',4,'ファレノプシスは洋ラン、エビネランは東洋ランの掲載例である。',[S2(125,53,119)],['agr-par08-flower-details-q02']);
add('agr-flower-details-table-examples',5,'観葉植物内でクロトンは木本類、ポトスは草本類に分かれる。',[S2(125,164,215)],['agr-par08-flower-details-q03']);
const eco=[
['切り花比較表では種苗費・市場価格・労力を別々の指標として読む。',[S2(125,570,729)],['agr-2-m04-q35']],
['一・二年草では種苗費と市場価格は安い側だが労力は多い側である。',[S2(125,598,625)],['agr-par08-flower-details-q04'],'Scheduled activity explicitly compares all three fields for annuals/biennials, perennials and bulb crops; the market-price field is included in that retrieval.'],
['宿根草では種苗費・市場価格はやや高い側、労力は多い側として程度を保つ。',[S2(125,622,648)],['agr-2-m04-q36'],'Scheduled activity explicitly compares all three table fields for the perennial group; degree words are retained.'],
['球根類は種苗費が高い側、市場価格がやや高い側、労力は少ない側という組合せである。',[S2(125,646,674)],['agr-par08-flower-details-q05'],'Scheduled activity explicitly compares all three fields, including the seedling-cost field, for bulb crops.'],
['花木・枝ものでは労力がバラは多い側、その他は少ない側に分かれる。',[S2(125,674,712)],['agr-par08-flower-details-q06','agr-par06-flowers-q09']],
['相対的な価格・費用・労力の表だけから販売額や総費用の金額が分からず、利益額は計算できない。',[S2(125,570,729)],['agr-par21-g6-q01']]];
eco.forEach(([s,r,q,a],i)=>add('agr-flower-details-economic-rows',i,s,r,q,a));
// Group 4: grape stage decisions, measured indicators and calendar reading.
const grape=[
['ブドウの房づくりは花振るいを防ぎ房全体の形を整えることを目的とする。',['agr-2-m02-q13']],
['房づくりは開花数日前、摘粒は着粒後という異なる段階の作業である。',['agr-par21-g5-q01']],
['房づくりで取り除く副穂・岐肩は房の肩口で枝分かれした部分である。',['agr-2-m02-q14']],
['房づくりでは副穂の除去とは別に房の長さも整える。',['agr-2-m03-q39']],
['着粒後の摘粒は不良果粒などを取り除き粒数を整える作業で、房全体を取ることとは異なる。',['agr-par21-g5-q01']],
['房づくり・摘粒は品種特性と品質を考え、資料にない長さや粒数を全品種へ一律に設定しない。',[]]];
grape.forEach(([s,q],i)=>add('agr-fruit-manage-grape-cluster-2',i,s,[S2(110,329,469)],q,'The existing scheduled activity requires a two-stage description and separates shoulder branches, cluster length and berries, explicitly leaving unprovided lengths and berry counts unconfirmed. The source paragraph ties these operations to cultivar traits and quality.'));
add('agr-fruit-manage-maturity-indicators-2',0,'収穫判断に代表果実の測定を使う場合、測定した対象と指標を明記し全果実の結果へ広げない。',[S2(113,176,213)],['agr-2-m03-q40']);
add('agr-fruit-manage-maturity-indicators-2',1,'カラーチャートは果実の着色程度を見て熟度・収穫時期を考える資料である。',[S2(113,535,622,0,220)],['agr-par21-g5-q02']);
add('agr-fruit-manage-maturity-indicators-2',2,'屈折糖度計は果実の糖度を測る器具で、硬さを測る器具とは異なる。',[S2(113,535,622,220,390)],['agr-par21-g5-q02']);
add('agr-fruit-manage-maturity-indicators-2',3,'硬度計は果実の硬さを測り、色や糖度とは測定対象が違う。',[S2(113,535,622,390,600)],['agr-par21-g5-q02']);
add('agr-fruit-manage-maturity-indicators-2',5,'代表果実・果樹の種類・測定指標を報告し、資料に示されていない全果実共通の合格値を補わない。',[S2(113,176,213),S2(113,535,622)],['agr-2-m03-q40'],'The existing activity explicitly asks a report sentence for a representative fruit and prohibits adding common pass values that the source does not provide.');
const calrows=[
['モモの掲載収穫期は6月下旬～8月下旬であり、開始・終了の旬を保つ。',S2(113,356,377),['agr-1-m09-q36']],
['ブドウの掲載収穫期は8月中旬～10月上旬である。',S2(113,332,352),['agr-1-m09-q36']],
['リンゴの掲載収穫期は9月上旬～11月中旬であり、実際の熟度判定とは別である。',S2(113,284,304),[]],
['2号表のニホンナシの掲載収穫期は8月中旬～11月下旬で、セイヨウナシの追熟と混同しない。',S2(113,308,328),[]],
['カキの掲載収穫期は9月下旬～12月上旬で、ウンシュウミカンより開始が早い。',S2(113,380,400),['agr-1-m09-q08']],
['ウンシュウミカンの掲載収穫期は10月中旬～12月上旬で、カキと終了が同じ表現である。',S2(113,259,280),['agr-1-m09-q08']]];
calrows.forEach(([s,r,q],i)=>add('agr-fruit-detail-harvest-calendar',i,s,[r],q,'The scheduled activity explicitly asks all six named fruit rows, sorting their starting periods, finding shared endpoints, and reading BOTH ends aloud. This is direct open-book calendar retrieval; actual maturity or nationwide harvest dates are not certified.'));
// Keep precise local assessment gaps open; neighbouring questions do not close them.
const boundedGaps={
'agriculture-v2-AGR-K-FACILITY-STRUCTURE-FLOWER-FORMS-04':'球根から育てるという型は既存設問で直接評価されるが、掲載三系統名を全て取り出して対応させる評価が不足。',
'agriculture-v2-AGR-K-FRUIT-FOUNDATION-BUDS-03':'モモの前年枝は直接評価されるが、同じ説明に含まれるオウトウの対応を明示回答させる評価が不足。',
'agriculture-v2-AGR-K-FRUIT-FOUNDATION-BUDS-06':'既存設問は窒素・弱いせん定・結実過多回避を正答に含むが、土壌水分を「やや少なめ」と明示回答させる評価が不足。'};
for(const u of rows)if(boundedGaps[u.knowledgeId]){u.after.status='partial';u.after.after.assessment='partial';u.after.unresolved=[boundedGaps[u.knowledgeId]];}
fs.writeFileSync(dir+'packet.json',JSON.stringify({schemaVersion:1,canonicalUpdates:rows,readerAdditions:[]},null,2)+'\n');
console.log(JSON.stringify({reviewed:rows.length,covered:rows.filter(r=>r.after.status==='covered_ai').length}));
