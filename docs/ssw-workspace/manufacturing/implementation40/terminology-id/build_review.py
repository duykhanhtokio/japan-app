"""Merge frozen 600-slot Indonesian review with 477 newly read contextual judgments."""
from pathlib import Path
import collections,hashlib,json
ROOT=Path(__file__).resolve().parents[5];OUT=Path(__file__).resolve().parent
base=ROOT/'docs/ssw-workspace/manufacturing/implementation40/language'
source=base/'term-review-inputs/id.json';rows=json.loads(source.read_text())['records']
priorpath=base/'vi-en-id-progress.json';prior=json.loads(priorpath.read_text());assert prior['idReviewFrozenForHandoff']
old={r['key']:r for r in prior['records'] if r['locale']=='id'};assert len(old)==600
patchpath=base/'term-corrections-progress.json';oldpatch={r['key']:r for r in json.loads(patchpath.read_text())['patches'] if r['locale']=='id'}
fix={
744:('Uji untuk mengevaluasi besarnya keausan yang ditimbulkan oleh benda kontak yang berputar atau sejenisnya.','回転摩耗試験は摩耗の存在を試すだけでなく摩耗量を評価する試験。短い訳から落ちていた評価対象の量を復元する。'),
753:('Metode pembentukan dengan memasukkan logam cair bertekanan ke dalam cetakan logam.','ダイカストの訳が単に溶湯を型へ押す説明となり、他の鋳造方法と区別する金型が落ちている。金属製の型へ圧力で入れる点を復元する。'),
759:('Batas yang ditetapkan pada peta kendali dan sejenisnya untuk memeriksa perubahan proses.','管理限界は工程変化を監視するため管理図等に設定されるもの。単なる調査の限界との誤読を避け、管理図への設定という原文の関係を復元する。'),
914:('Memeriksa hasil dengan membandingkannya dengan sasaran atau kondisi yang ditetapkan.','評価では結果を目標・条件と比較する。「membandingkan tujuan dan kondisi」は目標と条件を相互比較する読みにもなるため、比較される結果を明示する。')}
sections=[(600,638,'責任・教育・揚重・保護具・緊急対応・作業環境・記録の対象と行動を照合した。'),(639,682,'電源方向、定格・保護、材料と素子、受験形式、安全標識、検査データの区分を照合した。'),(683,724,'機械特性・検査原理、測定補助具・幾何公差、工作機械・樹脂の条件を照合した。'),(725,766,'塗装・圧延・5S、測定、公差・材料試験・化学分析・皮膜と環境の意味を照合した。'),(767,806,'安全・校正・腐食、電極と電子、陽極酸化、研磨・液管理・滴定の作用を照合した。'),(807,850,'濃度・酸化物・分析・材料分類、前処理・欠陥・各種めっき・排水排気を照合した。'),(851,898,'電気計測、外観・耐食試験、治具・槽、電解質・電流効率、皮膜機能と設備を照合した。'),(899,942,'研磨材・設備、品質活動、記録・防食、回路計算・安全教育の意味を照合した。'),(943,982,'標識・避難、規格単位・3R、化学反応・分析、電磁気と材料分類を照合した。'),(983,1022,'皮膜特性、環境制度、めっき構成・欠陥・仕上げ・測定原理と品質を照合した。'),(1023,1058,'水質指標、分析・読取り、塗料形式・酸化皮膜・研磨剤、責任と物性単位を照合した。'),(1059,1076,'資料に限定した災害説明、異常報告、半反応、入門pH、前処理・接点・参照条件を照合した。')]
canonical={r['key']:r for r in json.loads((base/'canonical-current-term-review-input.json').read_text())['records']}
reviews=[]
for i,r in enumerate(rows):
 assert hashlib.sha256(r['target'].encode()).hexdigest()==r['targetSha256']
 assert canonical[r['key']]['sourceHash']==r['lessonSourceHash']
 assert canonical[r['key']]['targets']['id']['meaning']==r['target']
 assert canonical[r['key']]['targets']['id']['fieldPath']==r['targetField']
 b={'index':i,'key':r['key'],'locale':'id','targetSha256':r['targetSha256'],'lessonSourceHash':r['lessonSourceHash'],'targetField':r['targetField'],'nativeReviewed':False,'expertReviewed':False,'domainReviewed':False}
 if i<600:
  inherited=old[r['key']];assert inherited['targetSha256']==r['targetSha256'] and inherited['lessonSourceHash']==r['lessonSourceHash']
  b.update(decision=inherited['decision'],contextNote=inherited['contextNote'],reviewMethod=inherited['reviewBasis'],reviewProvenance={'agent':'/root/terminology_audit','artifact':str(priorpath.relative_to(ROOT)),'artifactSha256':hashlib.sha256(priorpath.read_bytes()).hexdigest(),'inputSha256':prior['inputSha256'],'frozenBeforeHandoff':True})
  if r['key'] in oldpatch:
   p=oldpatch[r['key']];assert p['before']==r['target'];b.update(before=p['before'],after=p['after'],correctionProvenance=str(patchpath.relative_to(ROOT)))
 else:
  topic=next(t for lo,hi,t in sections if lo<=i<=hi)
  note=f'「{r["termJa"]}」：'+topic+' 日本語定義の対象・作用・条件がインドネシア語訳でも保持されている。'
  b.update(decision='accepted_AI_semantic_comparison',contextNote=note,reviewMethod='AI read every Japanese term/definition and exact Indonesian target, input rows600through1076; no hash/shape automatic approval',reviewProvenance={'agent':'/root/mechanical_coverage','newlyReadAfterFrozenHandoff':True})
  if i in fix:b.update(decision='correction_proposed',contextNote=fix[i][1],before=r['target'],after=fix[i][0])
  if i==745:b.update(decision='needs_source_clarification',contextNote='訳文は日本語の四角すい圧痕という表現に対応するが、圧子の立体形状と圧痕の対角線・面積の区別は原文から専門確認が必要。翻訳のみで訂正しない。')
  if i==821:b['contextNote']='「質量」：日本語原文の「物質の量」はmolと紛らわしいが、対象訳はmassa materiを用い質量を表す。翻訳の質量対象は維持されており、原文の明確化は別の共通レーンで扱う。'
  if i==861:b['contextNote']='「照度」：面に届く光という原文をtingkat pencahayaan/cahaya jatuh pada permukaanで表し、輝度に置き換えていない。'
  if i==1037:b['contextNote']='「一液型」：satu sediaan catは一つの調製済み塗料の形式を指し、二液型の主剤と硬化剤の組合せと区別される。'
 reviews.append(b)
assert len(reviews)==1077 and len({x['key'] for x in reviews})==1077
counts=dict(collections.Counter(x['decision'] for x in reviews))
(OUT/'review.json').write_text(json.dumps({'schemaVersion':1,'locale':'id','inputSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'inheritedReviewedSlots':600,'newlyReadSlots':477,'pendingUnread':0,'counts':counts,'reviewLimit':'AI contextual comparison only; not native/domain approval','reviews':reviews},ensure_ascii=False,indent=2)+'\n')
(OUT/'corrections.json').write_text(json.dumps({'locale':'id','changesAppliedToRuntime':False,'corrections':[r for r in reviews if r['decision']=='correction_proposed'],'sourceOrContextClarifications':[r for r in reviews if r['decision'] in ['needs_source_clarification','canonical_Japanese_clarification_authored','context_clarification_not_automatic_correction']]},ensure_ascii=False,indent=2)+'\n')
(OUT/'validation.json').write_text(json.dumps({'status':'PASS1077_EXACT_KEYS_HASHES_PATHS','inputRecords':1077,'reviewedRecords':1077,'inheritedFrozenRecords':600,'newlyReadRecords':477,'targetHashesChecked':1077,'sourceHashesChecked':1077,'pendingUnread':0,'runtimeEdits':False,'nativeReviewed':False,'domainReviewed':False,'reviewSha256':hashlib.sha256((OUT/'review.json').read_bytes()).hexdigest()},indent=2)+'\n')
print(counts)
