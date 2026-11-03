const fs=require('fs'),z=require('zlib'),crypto=require('crypto'),assert=require('assert/strict');
const dir='docs/ssw-workspace/agriculture/continuation-20261104a/greenhouse/',lp='docs/ssw-workspace/source-coverage-v2/agriculture.json',lessons=require('../../../../../src/data/agriculture/lessons.ja.json').lessons;
const l=JSON.parse(fs.readFileSync(lp)),assigned=new Set(require('../assignments.json').greenhouse),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const refs=(s,p,y1,y2)=>{let a=JSON.parse(z.gunzipSync(fs.readFileSync(`docs/ssw-workspace/source-coverage-v2/agriculture-${s}-regions.json.gz`)));let es=a.pages.find(x=>x.pdfPage===p).elements.filter(e=>e.bbox&&['text','text_span'].includes(e.kind)&&e.bbox[1]>=y1&&e.bbox[1]<=y2);assert(es.length,`${s}:${p}:${y1}-${y2}`);return {sourceId:s,pdfPage:p,elementIds:es.map(e=>e.elementId)};};
const ev=(path,pointer,note)=>{let v=JSON.parse(fs.readFileSync(path));for(let k of pointer.slice(1).split('/'))v=v[k];return {path,jsonPointer:pointer,sha256:hash(v),sha256Mode:'json-value',relation:'direct',semanticReviewed:true,reviewNote:note};};
const banks=['weekly-checks','mock-exams'].map(n=>['src/data/agriculture/'+n+'.ja.json',JSON.parse(fs.readFileSync('src/data/agriculture/'+n+'.ja.json'))]);
const qe=id=>{for(let [path,b] of banks)for(let ei=0;ei<b.exams.length;ei++){let qi=b.exams[ei].questions.findIndex(q=>q.id===id);if(qi>=0)return ev(path,`/exams/${ei}/questions/${qi}`,'Source condition, answer and all distractors/reasons self-checked against the current independently authored teaching.');}throw Error(id);};
const updates=[],readers=[];
function add(suffix,statement,sourceRefs,qids,opts={}){let id='agriculture-v2-AGR-K-'+suffix,u=l.knowledgeUnits.find(u=>u.knowledgeId===id);assert(assigned.has(id));let ti=-1,pi=-1;for(let i=0;i<lessons.length;i++){let j=lessons[i].paragraphs.findIndex(p=>p.knowledgeIds?.includes(u.legacyRefs.id));if(j>=0){ti=i;pi=j;break;}}assert(ti>=0);let after=structuredClone(u);after.previousSourceRefs=u.sourceRefs;after.sourceRefs=sourceRefs;after.statementJa=statement;after.conditionsJa=opts.conditions||[];after.teachingEvidence=[ev('src/data/agriculture/lessons.ja.json',`/lessons/${ti}/paragraphs/${pi}/textJa`,'Exact independently authored paragraph checked for this source fact, its scope and limitations.')];after.assessmentEvidence=qids.map(qe);if(opts.checkId)after.assessmentEvidence.push({checkId:opts.checkId,checkField:'modelAnswerJa',path:'src/data/agriculture/reader-moisture-checks.json',relation:'direct',semanticReviewed:true,reviewNote:'New recall/comparison prompt requires the specific named relations, with the model answer available only after learner interaction.'});after.after={teaching:'present',assessment:after.assessmentEvidence.length?'present':'missing'};after.expressionReview={status:'independent_ai_checked',note:'Independently structured explanations and comparison/scenario questions checked against factual source clauses; no source image or prose republished.'};after.sourceReview={status:'self_checked_ai',conditionsChecked:true,reviewRef:dir+'source-review.json'};after.status=opts.partial?'partial':'covered_ai';after.unresolved=opts.partial||[];updates.push({knowledgeId:id,beforeSha256:hash(u),after});}
const S2=(p,a,b)=>refs('AGR-S2',p,a,b),S1=(p,a,b)=>refs('AGR-S1',p,a,b);
add('CLIMATE-01','沖縄と北海道は教材の気候区分が異なり、南北差を保って理解する。',[S2(3,98,155)],['agr-2-w01-q01']);
add('CLIMATE-02','春の昇温・梅雨の長雨・高温多湿の夏という順で季節を捉える。',[S2(3,175,232)],['agr-2-m05-q31','agr-2-w01-q02']);
add('CLIMATE-03','冬は日本海側で降雪、太平洋側で乾燥した晴天が起こりやすい。',[S2(3,227,278)],['agr-2-w01-q03']);
add('CLIMATE-04','局地的大雨と広域で長く続く雨は、範囲と継続時間を区別する。',[S2(3,276,354)],['agr-2-m03-q01']);
add('CLIMATE-05','土地の利用では水田のイネと畑地の畑作物・野菜・果樹・花を対応させる。',[S2(3,352,380)],['agr-2-w01-q04']);
add('VEGWORK-ENVIRONMENT-01','作物の生育適温は種類と生育時期に応じて考える。',[S1(59,686,737),S2(79,480,533)],['agr-1-m08-q20']);
add('FACILITY-STRUCTURE-VEGETABLES-01','施設野菜の科はトマトがナス科、イチゴがバラ科、キュウリがウリ科である。',[S1(63,175,201),S1(63,354,380),S1(63,583,609)],['agr-par06-facility-structure-q01']);
add('FACILITY-STRUCTURE-VEGETABLES-02','トマトは強い光を必要とし、施設内でも採光の確認を続ける。',[S1(63,251,278)],['agr-1-m07-q25']);
add('FACILITY-STRUCTURE-VEGETABLES-03','トマトは時期に適した作型の組合せで周年栽培する。',[S1(63,201,227),S2(82,352,380)],['agr-2-m09-q02']);
add('FACILITY-STRUCTURE-VEGETABLES-05','食用のキュウリでは成熟しきる前の若い果実を利用する。',[S1(63,583,610),S2(83,98,124)],['agr-2-m09-q04']);
add('FACILITY-STRUCTURE-VEGETABLES-06','キュウリは雄花と雌花が別で、受粉・受精なしでも結実する性質を持つ。',[S1(63,609,660),S2(83,201,252)],['agr-par06-facility-structure-q02']);
add('FACILITY-STRUCTURE-STRAWBERRY-03','イチゴの子株は親株から伸びるランナーの先にできる。',[S1(63,405,456),S2(82,609,660)],['agr-par06-facility-structure-q03']);
add('FACILITY-STRUCTURE-STRAWBERRY-04','高設ベンチ栽培は栽培位置を高くし、立って作業できる方式である。',[S1(63,379,405),S2(82,455,507)],['agr-par06-facility-structure-q04']);
add('FACILITY-STRUCTURE-STRAWBERRY-06','花芽分化を早める育苗はイチゴの促成栽培につながる。',[S1(63,456,507)],['agr-1-m07-q28']);
add('FACILITY-STRUCTURE-ROOF-TYPES-03','両屋根型は両側に傾斜面を持つ屋根断面の名称である。',[S1(66,328,380),S2(86,73,150)],['agr-1-m07-q37']);
add('FACILITY-STRUCTURE-ROOF-TYPES-04','丸屋根型は丸い屋根輪郭を持ち、形だけで材料や気象対策を決めない。',[S1(66,379,431),S2(86,150,227)],['agr-1-m07-q31']);
add('FACILITY-ENV-NURSERY-METHODS-01','地床育苗では苗床を使い、温床は電熱線で床土を温め、冷床には特別な資材が不要とされる。',[S1(75,124,176),S2(17,634,686)],['agr-1-m01-q24','agr-1-m08-q33']);
add('FACILITY-ENV-NURSERY-METHODS-06','育苗方法の名称は箱・独立したポット・区画付きトレイなどの構造や材質と対応させる。',[S1(75,175,432),S2(18,73,201)],['agr-1-m08-q03']);
add('FACILITY-ENV-GRAFTED-SEEDLINGS-04','接ぎ木苗の利用例にはナス・キュウリ・トマト・スイカがある。',[S1(75,737,763),S2(18,507,533)],['agr-1-m08-q21']);
add('FACILITY-ENV-GRAFTED-SEEDLINGS-05','良い苗の外観として節間が詰まり、茎が太く、しっかりした姿を確認する。',[S1(76,150,176),S2(19,354,380)],['agr-1-m07-q06']);
add('FACILITY-ENV-GRAFTED-SEEDLINGS-06','水分過剰・高温管理・光不足は徒長と関係し、苗の環境管理が必要である。',[S1(76,175,252),S2(19,379,456)],['agr-par06-facility-environment-q16']);
add('PAR12-FACILITY-STRAWBERRY-DEVELOPMENT-2-01','イチゴは開花・結実の終了、又は栄養過剰の場合にランナーが発生すると教材にある。',[S2(82,609,660)],['agr-par12-facility-q05']);
add('PAR12-FACILITY-STRAWBERRY-DEVELOPMENT-2-02','自然条件のイチゴは秋以降の低温・短日で花芽分化する。',[S2(82,660,712)],['agr-par12-facility-q06'],{conditions:['自然条件の季節変化についての記述。']});
add('PAR12-FACILITY-STRAWBERRY-DEVELOPMENT-2-03','自然条件では分化の翌春以降の高温・長日で開花・結実へ進む。',[S2(82,660,712)],['agr-par12-facility-q06'],{conditions:['前年秋の分化から翌年春への年のつながりを保つ。']});
add('PAR12-FACILITY-STRAWBERRY-DEVELOPMENT-2-04','花芽分化促進の育苗条件例には低温・短日・肥料中断がある。',[S2(82,711,763)],['agr-par12-facility-q07'],{conditions:['個別の施肥停止日数・開始日の指示ではない。']});
add('PAR12-FACILITY-STRAWBERRY-DEVELOPMENT-2-05','イチゴ育苗の方法名には高冷地育苗と夜冷育苗がある。',[S2(82,762,792)],['agr-par12-facility-q08']);
add('PAR12-FACILITY-STRAWBERRY-DEVELOPMENT-2-06','イチゴ育苗では低温暗黒育苗とポット育苗も別の方法名として挙げられる。',[S2(82,762,792),S2(83,48,74)],['agr-par12-facility-q08']);
add('PAR22-FACILITY-01','2018年の施設トマト生産量約56.2万tと、施設栽培面積の順位は別の指標である。',[S2(82,276,329)],['agr-2-m02-q15'],{conditions:['2018年の施設トマトの生産重量であり現在値ではない。']});
add('PAR22-FACILITY-02','トマトの産地例と、各産地に適した作型をつなぐ周年出荷を対応させる。',[S2(82,327,380)],['agr-2-m05-q28'],{partial:['周年出荷の関係は評価済みだが、熊本・愛知・北海道という産地例の全てを答える評価がまだない。']});
add('PAR22-FACILITY-03','トマトは栄養成長と生殖成長を並行させながら生育する。',[S2(82,378,405)],['agr-2-m02-q16']);
add('PAR22-FACILITY-04','2018年の全国の施設イチゴ生産量約13.5万tは、約135000tに対応する。',[S2(82,506,533)],['agr-2-m05-q29'],{conditions:['2018年の施設栽培分であり、現在又は全栽培方式の量ではない。']});
add('PAR22-FACILITY-05','施設イチゴの産地例は栃木・福岡・熊本である。',[S2(82,532,558)],['agr-2-m05-q30']);
add('PAR22-FACILITY-06','教材のイチゴでは作付面積が減少する一方、10a当たり収量は増加する傾向が示される。',[S2(82,557,609)],['agr-2-m02-q17'],{conditions:['比較年や増減率をこの記述から補わない。']});
add('S27-CLIMATE-DETAIL-01','日本は東アジア沿岸に位置し、主な気候帯は温帯である。',[S2(3,98,155)],['agr-2-m01-q18']);
add('S27-CLIMATE-DETAIL-02','教材は日本の海洋性気候と年間降水量の多さを関連付けている。',[S2(3,124,176)],['agr-2-m01-q18'],{partial:['現行問題は海洋性という分類を問うが、年間降水量の多さを説明する評価は不足。']});
add('S27-CLIMATE-DETAIL-03','季節の流れは春の昇温、梅雨の長雨、高温多湿の夏として整理する。',[S2(3,175,232)],['agr-2-m05-q31']);
add('F40-FACILITY-01','良い果樹苗の根の例は太い根が少なく細根が多い構成である。',[S2(102,98,150)],['agr-2-m03-q29']);
add('F40-FACILITY-02','苗木の白いカビやこぶ状の膨らみは病虫害の心配として観察する。',[S2(102,124,150)],['agr-2-m06-q27']);
add('F40-FACILITY-03','車枝は主幹の一か所から複数の主枝が出る形で、整枝では避ける。',[S2(105,225,278)],['agr-2-m06-q32']);
add('F40-FACILITY-04','不要枝を基部から除く間引きせん定では、太い枝にのこぎり、細い枝にはさみを使う。',[S2(106,186,239),S2(106,288,341)],['agr-2-m06-q36']);
add('F40-FACILITY-05','樹形の追加例はクリの変則主幹形、カンキツ類の開心自然形、キウイの棚仕立てである。',[S2(108,124,201),S2(108,497,546)],['agr-2-m07-q13'],{partial:['問題はクリとキウイを直接問うが、カンキツ類と開心自然形の追加対応は評価が不足。']});
add('F40-FACILITY-06','わい性台木で低樹高・密植にする栽培には作業性向上・早期多収・農薬散布量軽減の利点が挙がる。',[S2(108,200,304)],['agr-2-m07-q20'],{partial:['農薬散布量軽減は直接評価されるが、作業性向上と早期多収を合わせて説明する評価が不足。']});
add('F40-FACILITY-BRIDGE-02','施設バラでは四季咲き性品種が中心である。',[S1(64,659,687)],['agr-1-m08-q06']);
add('F40-FACILITY-BRIDGE-03','窒素肥料不足の掲載例では下葉の黄化と苗の勢い低下が見られる。',[S1(76,251,278)],['agr-1-m08-q07']);
// Reader activities are written below, before final packet serialization.
function ruby(s){let ts=[],i=0,re=/\{([^|{}]+)\|([^{}]+)\}/g,m;while((m=re.exec(s))){if(m.index>i)ts.push({text:s.slice(i,m.index)});ts.push({text:m[1],readingKana:m[2]});i=re.lastIndex;}if(i<s.length)ts.push({text:s.slice(i)});return {text:ts.map(t=>t.text).join(''),tokens:ts};}
function reader(id,lessonId,kid,prompt,answer,translations,sourceRefs,origins){const p=ruby(prompt),a=ruby(answer);assert.equal(Object.keys(translations).length,12);let c={id,knowledgeId:'agriculture-v2-AGR-K-'+kid,lessonId,levels:['1','2'],promptJa:p.text,modelAnswerJa:a.text,promptRuby:p.tokens,modelAnswerRuby:a.tokens,translations:Object.fromEntries(Object.entries(translations).map(([k,v])=>[k,{prompt:v[0],modelAnswer:v[1],translatedFrom:'ja'}])),nativeReviewed:false,domainReviewed:false,sourceRefs,answerOrigin:{parts:origins.map(([lid,paragraphIds])=>({lessonId:lid,paragraphIds,sourceHash:lessons.find(l=>l.id===lid).sourceHash}))}};readers.push(c);return c;}
const propagation=reader('agr-reader-a-strawberry-propagation','agr-facility-structure-vegetables','FACILITY-STRUCTURE-VEGETABLES-04','イチゴはたねからふやすのですか。おやかぶ、ランナー、こかぶのつながりをせつめいしてください。','イチゴは{栄養繁殖|えいようはんしょく}します。{親株|おやかぶ}からランナーが{伸び|のび}、その{先|さき}の{子株|こかぶ}を{繁殖|はんしょく}に{使います|つかいます}。{種子|しゅし}から{育てる|そだてる}{方法|ほうほう}とは{区別|くべつ}します。',{
en:['Are strawberries propagated from seed here? Explain the relationship between the parent plant, runner and daughter plant.','Strawberries are propagated vegetatively here. A runner grows from the parent plant, and the daughter plant at its tip is used for propagation. Distinguish this from growing plants from seed.'],
vi:['Trong bài, dâu tây được nhân giống bằng hạt hay bằng cách nào? Giải thích quan hệ giữa cây mẹ, thân bò và cây con.','Dâu tây được nhân giống sinh dưỡng. Thân bò mọc từ cây mẹ; cây con ở đầu thân bò được dùng để nhân giống. Phân biệt cách này với trồng cây từ hạt.'],
id:['Apakah stroberi diperbanyak dari biji dalam pelajaran ini? Jelaskan hubungan tanaman induk, sulur dan anakan.','Stroberi diperbanyak secara vegetatif. Sulur tumbuh dari tanaman induk; anakan di ujungnya digunakan untuk perbanyakan. Bedakan cara ini dari menanam dari biji.'],
'zh-CN':['本课草莓是用种子繁殖的吗？请说明母株、匍匐茎和子株的关系。','草莓采用营养繁殖。母株长出匍匐茎，用其末端形成的子株繁殖。这与从种子培育植株的方法不同。'],
'zh-TW':['本課草莓是用種子繁殖的嗎？請說明母株、匍匐莖和子株的關係。','草莓採用營養繁殖。母株長出匍匐莖，用其末端形成的子株繁殖。這與從種子培育植株的方法不同。'],
hi:['इस पाठ में स्ट्रॉबेरी का प्रवर्धन बीज से होता है? मातृ पौधे, रनर और नए पौधे का संबंध समझाइए।','यहाँ स्ट्रॉबेरी का कायिक प्रवर्धन होता है। मातृ पौधे से रनर निकलता है और उसके सिरे पर बने नए पौधे को प्रवर्धन के लिए इस्तेमाल करते हैं। इसे बीज से पौधा उगाने से अलग समझें।'],
bn:['এই পাঠে স্ট্রবেরি কি বীজ থেকে বংশবিস্তার করে? মাতৃগাছ, রানার ও নতুন চারার সম্পর্ক ব্যাখ্যা করুন।','স্ট্রবেরির অঙ্গজ বংশবিস্তার করা হয়। মাতৃগাছ থেকে রানার বের হয় এবং তার আগার নতুন চারা বংশবিস্তারে ব্যবহার করা হয়। এটি বীজ থেকে গাছ জন্মানোর পদ্ধতি থেকে আলাদা।'],
ne:['यस पाठमा स्ट्रबेरी बीउबाट बढाइन्छ? माउ बिरुवा, रनर र नयाँ बिरुवाबीचको सम्बन्ध बताउनुहोस्।','स्ट्रबेरीको वानस्पतिक प्रजनन गरिन्छ। माउ बिरुवाबाट रनर निस्कन्छ र त्यसको टुप्पामा बनेको नयाँ बिरुवा प्रजननका लागि प्रयोग गरिन्छ। यसलाई बीउबाट बिरुवा उमार्ने विधिबाट छुट्याउनुहोस्।'],
my:['ဤသင်ခန်းစာတွင် စတော်ဘယ်ရီကို မျိုးစေ့ဖြင့် ပွားသလား။ မိခင်ပင်၊ မြေလျှောက်ပင်စည်နှင့် အပင်ငယ်တို့၏ ဆက်နွယ်မှုကို ရှင်းပြပါ။','စတော်ဘယ်ရီကို အပင်အစိတ်အပိုင်းဖြင့် မျိုးပွားသည်။ မိခင်ပင်မှ မြေလျှောက်ပင်စည် ထွက်လာပြီး ၎င်း၏အဖျားရှိ အပင်ငယ်ကို မျိုးပွားရန် အသုံးပြုသည်။ မျိုးစေ့မှ စိုက်ပျိုးခြင်းနှင့် ခွဲခြားပါ။'],
th:['ในบทเรียนนี้สตรอว์เบอร์รีขยายพันธุ์จากเมล็ดหรือไม่ อธิบายความสัมพันธ์ระหว่างต้นแม่ ไหล และต้นลูก','สตรอว์เบอร์รีขยายพันธุ์แบบไม่อาศัยเพศ ไหลยื่นจากต้นแม่ และใช้ต้นลูกที่ปลายไหลขยายพันธุ์ แยกวิธีนี้จากการเพาะเมล็ด'],
km:['ក្នុងមេរៀននេះ ស្ត្របឺរីបន្តពូជដោយគ្រាប់ឬ? សូមពន្យល់ទំនាក់ទំនងរវាងដើមមេ ដើមលូន និងកូនដើម។','ស្ត្របឺរីបន្តពូជដោយផ្នែកលូតលាស់។ ដើមលូនដុះចេញពីដើមមេ ហើយកូនដើមនៅចុងដើមលូនត្រូវបានប្រើសម្រាប់បន្តពូជ។ វាខុសពីការដាំពីគ្រាប់។'],
tl:['Sa araling ito, sa buto ba pinaparami ang strawberry? Ipaliwanag ang ugnayan ng inang halaman, runner at bagong supling.','Vegetative ang pagpaparami ng strawberry. Tumutubo ang runner mula sa inang halaman, at ginagamit sa pagpaparami ang supling sa dulo nito. Ihiwalay ito sa pagpapalaki mula sa buto.']
},[S1(63,405,456),S2(82,609,660)],[['agr-facility-structure-vegetables',['agr-facility-structure-vegetables-p4']],['agr-facility-structure-strawberry',['agr-facility-structure-strawberry-p1','agr-facility-structure-strawberry-p2','agr-facility-structure-strawberry-p3']]]);
for(let suffix of ['FACILITY-STRUCTURE-VEGETABLES-04','FACILITY-STRUCTURE-STRAWBERRY-01','FACILITY-STRUCTURE-STRAWBERRY-02'])add(suffix,'イチゴは種子繁殖と区別される栄養繁殖を行い、親株から伸びたランナーの先の子株を利用する。',[S1(63,405,456),S2(82,609,660)],[],{checkId:propagation.id});
const env=reader('agr-reader-a-above-below-environment','agr-f40-facility-environment-equipment','F40-FACILITY-ENV-05','しせつのかんきょうを、ちじょうとちかにわけます。それぞれ、ほんぶんのれいをみっつずつあげてください。','{地上|ちじょう}は{気温|きおん}・{湿度|しつど}・{光|ひかり}、{地下|ちか}は{地温|ちおん}・{土壌水分|どじょうすいぶん}・{養分濃度|ようぶんのうど}です。{気温|きおん}と{地温|ちおん}を{同じ|おなじ}{項目|こうもく}にしません。',{
en:['Divide the greenhouse environment into above-ground and below-ground conditions. Give three examples from the lesson for each.','Above ground: air temperature, humidity and light. Below ground: soil temperature, soil moisture and nutrient concentration. Air temperature and soil temperature are separate items.'],
vi:['Chia môi trường nhà kính thành phần trên mặt đất và dưới đất. Nêu ba ví dụ trong bài cho mỗi phần.','Trên mặt đất: nhiệt độ không khí, độ ẩm không khí và ánh sáng. Dưới đất: nhiệt độ đất, độ ẩm đất và nồng độ dinh dưỡng. Không gộp nhiệt độ không khí và nhiệt độ đất thành một mục.'],
id:['Pisahkan lingkungan rumah kaca menjadi kondisi di atas dan di bawah tanah. Sebutkan tiga contoh dalam pelajaran untuk masing-masing.','Di atas tanah: suhu udara, kelembapan udara dan cahaya. Di bawah tanah: suhu tanah, kelembapan tanah dan konsentrasi unsur hara. Suhu udara dan suhu tanah merupakan dua butir berbeda.'],
'zh-CN':['将设施环境分为地上和地下两类，各说出课文中的三个例子。','地上是气温、湿度和光；地下是地温、土壤水分和养分浓度。气温与地温应分开记录。'],
'zh-TW':['將設施環境分為地上和地下兩類，各說出課文中的三個例子。','地上是氣溫、濕度和光；地下是地溫、土壤水分和養分濃度。氣溫與地溫應分開記錄。'],
hi:['ग्रीनहाउस के वातावरण को जमीन के ऊपर और नीचे के भागों में बाँटिए। पाठ से प्रत्येक के तीन उदाहरण दीजिए।','ऊपर: हवा का तापमान, आर्द्रता और प्रकाश। नीचे: मिट्टी का तापमान, मिट्टी की नमी और पोषक तत्वों की सांद्रता। हवा और मिट्टी के तापमान को अलग मदों में रखें।'],
bn:['গ্রিনহাউসের পরিবেশকে মাটির ওপর ও নিচের অবস্থায় ভাগ করুন। পাঠ থেকে প্রতিটির তিনটি উদাহরণ দিন।','ওপরে: বায়ুর তাপমাত্রা, আর্দ্রতা ও আলো। নিচে: মাটির তাপমাত্রা, মাটির আর্দ্রতা ও পুষ্টি উপাদানের ঘনত্ব। বায়ু ও মাটির তাপমাত্রা আলাদা বিষয় হিসেবে রাখুন।'],
ne:['हरितगृहको वातावरणलाई जमिनमाथि र जमिनमुनि छुट्याउनुहोस्। पाठका तीन-तीन उदाहरण दिनुहोस्।','माथि: हावाको तापक्रम, आर्द्रता र प्रकाश। मुनि: माटोको तापक्रम, माटोको चिस्यान र पोषक तत्त्वको सान्द्रता। हावा र माटोको तापक्रमलाई अलग विषयमा राख्नुहोस्।'],
my:['ဖန်လုံအိမ်ပတ်ဝန်းကျင်ကို မြေပေါ်နှင့် မြေအောက်ဟူ၍ ခွဲပါ။ သင်ခန်းစာမှ တစ်ခုစီအတွက် ဥပမာသုံးခု ပေးပါ။','မြေပေါ်တွင် လေအပူချိန်၊ လေထုစိုထိုင်းဆနှင့် အလင်းဖြစ်သည်။ မြေအောက်တွင် မြေအပူချိန်၊ မြေအစိုဓာတ်နှင့် အာဟာရဓာတ်ပါဝင်နှုန်းဖြစ်သည်။ လေအပူချိန်နှင့် မြေအပူချိန်ကို သီးခြားမှတ်တမ်းတင်ပါ။'],
th:['แบ่งสภาพแวดล้อมในโรงเรือนเป็นเหนือดินและใต้ดิน ยกตัวอย่างจากบทเรียนด้านละสามรายการ','เหนือดิน: อุณหภูมิอากาศ ความชื้นอากาศ และแสง ใต้ดิน: อุณหภูมิดิน ความชื้นดิน และความเข้มข้นของธาตุอาหาร แยกอุณหภูมิอากาศออกจากอุณหภูมิดิน'],
km:['បែងចែកបរិស្ថានក្នុងផ្ទះដំណាំជាផ្នែកលើដី និងក្រោមដី។ សូមលើកឧទាហរណ៍បីពីមេរៀនសម្រាប់ផ្នែកនីមួយៗ។','លើដី៖ សីតុណ្ហភាពខ្យល់ សំណើមខ្យល់ និងពន្លឺ។ ក្រោមដី៖ សីតុណ្ហភាពដី សំណើមដី និងកំហាប់សារធាតុចិញ្ចឹម។ ត្រូវកត់សីតុណ្ហភាពខ្យល់ និងសីតុណ្ហភាពដីដាច់ពីគ្នា។'],
tl:['Hatiin ang kapaligiran ng greenhouse sa ibabaw at ilalim ng lupa. Magbigay ng tig-tatlong halimbawa mula sa aralin.','Sa ibabaw: temperatura ng hangin, halumigmig at liwanag. Sa ilalim: temperatura ng lupa, kahalumigmigan ng lupa at konsentrasyon ng sustansiya. Magkahiwalay na item ang temperatura ng hangin at lupa.']
},[S2(90,608,660)],[['agr-f40-facility-environment-equipment',['agr-f40-facility-environment-equipment-p5']]]);
env.levels=['2']; // This lesson is scheduled only at level 2.
add('F40-FACILITY-ENV-05','施設環境は地上の気温・湿度・光と、地下の地温・土壌水分・養分濃度を分けて記録する。',[S2(90,608,660)],[],{checkId:env.id});
add('FACILITY-ENV-CO2-LIGHT-02','二酸化炭素の光合成促進は光の条件と関連し、補給量や装置の有無だけでは判断しない。',[S1(69,532,635),S2(90,73,124)],['agr-1-m01-q14']);
add('FACILITY-ENV-SOLUTION-CIRCULATION-2-06','循環と非循環は成分・量の安定性、病害の広がり、排液処理を別々に比較する。',[S2(96,72,233)],['agr-par21-facility-fruit-q03','agr-2-m01-q17','agr-2-m03-q35','agr-2-m03-q36']);
add('F40-FACILITY-ENV-02','防虫照明の名称は黄色灯が黄色防蛾灯、青色灯が紫外線殺虫器に対応する。',[S2(90,434,547)],['agr-1-m07-q08']);
add('F40-FACILITY-BRIDGE-01','イチゴは施設栽培が中心で、開花・結実後に伸びるランナーの先の子株を繁殖に使う。',[S1(63,405,456),S1(63,507,533)],['agr-1-m08-q32'],{checkId:propagation.id});
add('F40-FACILITY-BRIDGE-04','良い果樹苗は細根の発達と病害虫に侵されていない状態の両方を確認する。',[S1(81,302,329)],['agr-week49-q01']);
add('F40-FACILITY-BRIDGE-05','高接ぎは比較的短い期間で既存樹の品種を更新する目的を持つ。',[S1(81,455,482)],['agr-par08-seed-graft-q08']);

const refinements={
'FACILITY-STRUCTURE-VEGETABLES-04':'イチゴは苗を栄養繁殖によって増やす。',
'FACILITY-STRUCTURE-STRAWBERRY-01':'イチゴの教材に示す栄養繁殖と、種子から苗を育てる方法を区別する。',
'FACILITY-STRUCTURE-STRAWBERRY-02':'イチゴの繁殖では親株から伸びるランナーを観察する。'
};
for(const [suffix,statement]of Object.entries(refinements))updates.find(u=>u.knowledgeId==='agriculture-v2-AGR-K-'+suffix).after.statementJa=statement;
// FINAL_PACKET
const packet={schemaVersion:1,sector:'agriculture',lane:'greenhouse',baselineCommit:'bfd4cdeaa5b4abced2c7de2a847f218f57a435b9',canonicalUpdates:updates,readerAdditions:readers,sourceCoveragePercent:null,review:{domainReviewed:false,nativeReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false},pending:[...assigned].filter(id=>!updates.some(p=>p.knowledgeId===id)),integrationNote:'Coordinator resolves checkId/checkField references after additions; preserve accepted prior units and reciprocal region links.'};
fs.writeFileSync(dir+'packet.json',JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync(dir+'source-review.json',JSON.stringify({baselineCommit:packet.baselineCommit,status:'self_checked_ai',sourceBytes:'Private PDFs verified by coordinator source registry; same local PDFs read directly.',sourceTextReading:true,visualPagesInspected:['AGR-S2:3','AGR-S2:82','AGR-S2:83','AGR-S2:85','AGR-S2:86','AGR-S2:90','AGR-S2:102','AGR-S2:105','AGR-S2:108'],sourceLocators:'Current gzip region bboxes selected for the specific source clauses; original ruby retained in exact regions. Source screenshots/prose not included.',units:updates.map(p=>({knowledgeId:p.knowledgeId,status:p.after.status,sourceRefs:p.after.sourceRefs,remaining:p.after.unresolved})),newReaderChecks:readers.map(c=>c.id),independentExpression:'Teaching uses independent explanatory structure and limits; questions use original comparisons, records or scenarios. Factual technical terminology retained.',crossWorkerSemanticReview:false,nativeReviewed:false,domainReviewed:false,physicalDeviceTested:false,learnerDurationMeasured:false},null,2)+'\n');
console.log(JSON.stringify({updates:updates.length,covered:updates.filter(p=>p.after.status==='covered_ai').length,partial:updates.filter(p=>p.after.status==='partial').length,readerChecks:readers.length,pending:packet.pending.length}));
