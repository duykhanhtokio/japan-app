"""Serialize the completed JP→Simplified Chinese contextual review, not an approval classifier."""
from pathlib import Path
import collections,hashlib,json
ROOT=Path(__file__).resolve().parents[5]
OUT=Path(__file__).resolve().parent
src=ROOT/'docs/ssw-workspace/manufacturing/implementation40/language/term-review-inputs/zh-CN.json'
raw=json.loads(src.read_text()); groups=collections.defaultdict(list)
for r in raw['records']:
 assert hashlib.sha256(r['target'].encode()).hexdigest()==r['targetSha256']
 groups[(r['termJa'],r['meaningJa'],r['target'])].append(r)
# Index refers to first-occurrence order in the frozen input; all 1073 triples were read,
# including the four exact triples with multiple members. No hash-based semantic approval.
fix={
347:('为便于成形件从模具中脱出而设置的斜度。','「型から抜く」は成形品の脱模を意味する。「取模」は型自体の取外しと混同しやすく、成形品が型から抜ける関係を明示する。'),
703:('涉及圆柱形状规整程度的几何特征。','円筒度は円筒形状の整い方である。「完整程度」は欠損の有無・完全性に読めるため、形状の規整を表す語へ直す。'),
721:('通过加热等引发化学反应而固化的树脂。','原文は加熱等をきっかけとする化学反応による硬化。「通过加热等化学反应」は加熱そのものを化学反応に分類する読みにもなり、因果を明示する。'),
858:('表示照射到表面的光照程度的量。','照度を定義する箇所で「亮度」を使うと、別の測光量である輝度と混同する。表面に届く光の程度を説明し、照度と輝度を区別する。'),
1034:('以单组分涂料形式使用的类型。','一液型は使用する塗料の一液・二液の区分であり、一回分の分量ではない。「一份」は分量に読めるため「单组分」で対比を保つ。')}
source_issues={
34:'訳文は原文に対応するが「整数部分より小さい値」という端数の定義は0.5等で成立せず、整数部と小数部の説明として原文を要修正。翻訳だけで補正しない。',
743:'訳文は原文どおりだが、ビッカースの四角すいは圧子の立体形状であり、測る圧痕の対角線・面積との説明が不明確。専門家が日本語定義を確認してから各言語へ反映する。',
818:'訳文は原文に対応するが、質量を「物質の量」とする表現はSIの物質量molと混同し得る。質量kgとの区別を日本語の定義から明確化する。'}
# Context notes are topic-specific observations from reading each source definition and target.
sections=[(0,26,'電磁気・温度・接続・はんだの物理対象と作用の向きを照合した。'),(27,34,'寸法測定の基準、接触部、力、目盛読取りの役割を照合した。'),(35,46,'回路の接続、残留電荷、定格と時間波形の量の区別を確認した。'),(47,66,'検査・報連相・リスク・統計の対象と判断条件を確認した。'),(67,94,'図面尺度、材料・抵抗網・ダイオード・静電気の方向関係を確認した。'),(95,118,'論理の成立条件、保全、受動部品、演算・記憶・進数の機能を確認した。'),(119,150,'基板製造、摩擦、制御、電動機・変圧器・遮断器と流体系の働きを確認した。'),(151,182,'包装・樹脂・ねじ・測定補助具・手仕上げの対象形状と作業を確認した。'),(183,214,'電磁現象、受験条件、安全衛生、標識・化学ばく露・継続管理の意味を確認した。'),(215,254,'品質活動、規格適用、校正、単位・化学・循環資源の区別を確認した。'),(255,282,'投影・配合・断面・制御、絶縁、圧着・はんだ・受動素子の機能を確認した。'),(283,318,'加工機、電気量・交流状態、半導体・計測器、記録・論理演算の対応を確認した。'),(319,353,'リレーの復帰・遅延、機器損失・信頼性、包装・成形・基板工程の条件を確認した。'),(354,389,'安全操作、部材・絶縁・検査、図面線・寸法・溶接・機械部位の役割を確認した。'),(390,437,'異常と再起動、5S・三定・OJT・リスク・品質管理図の対象を確認した。'),(438,477,'単位換算、ロット検査、材料試験、測定器と寸法許容・保全の意味を確認した。'),(478,517,'材料の変形・熱処理、切削・研削、粗さ・電気・樹脂・塗装・包装の区別を確認した。'),(518,553,'圧延・押出・化学・循環資源・規格・機械試験と比較測定の役割を確認した。'),(554,597,'限界ゲージ、製図用紙・投影・断面・寸法・幾何公差と基準測定の対応を確認した。'),(598,637,'責任体制、教育、ヒヤリハット、揚重、保護具・消火・作業環境・記録管理を確認した。'),(638,681,'電源・保護、電気材料・素子、試験形式・禁止標識・OSHMS・検査データの区別を確認した。'),(682,732,'材料強さ・硬さ・非破壊検査、補助具・幾何公差・工作機械・樹脂・塗装・圧延の対象を確認した。'),(733,764,'5S、測定分解能・寸法公差、硬さ・化学分析、材料・表面仕上げ・環境と皮膜構造を確認した。'),(765,812,'安全、校正、膜厚・腐食、陽極酸化・めっき・研磨、液管理・滴定・濃度・酸化物を確認した。'),(813,847,'溶解・沈殿・分析、合金、前処理、欠陥、熱浸・無電解・乾式めっき、排水排気を確認した。'),(848,895,'電流電圧計の接続、試験・外観・光・導電性、治具・槽・電解質・電流効率・皮膜・設備を確認した。'),(896,939,'研磨材・設備、三定・4M・品質改善、防食、回路計算と安全教育の意味を確認した。'),(940,979,'標識・避難、規格単位・3R・酸塩基・酸化還元・分析・電磁気・材料分類を確認した。'),(980,1019,'皮膜の密着・硬度・濡れ、環境、めっき構成・界面・欠陥・仕上げ・膜厚測定・品質を確認した。'),(1020,1055,'水質指標、液面読取り・分析・塗料の成分形式・酸化膜・研磨材・責任体制・導電率を確認した。'),(1056,1072,'資料の労働災害説明、丁寧な扱い・異常報告、半反応・受験表現・pH入門例・前処理と参照値の限定を確認した。')]
reviews=[];grouprecords=[]
for i,((term,meaning,target),members) in enumerate(groups.items()):
 topic=next(t for lo,hi,t in sections if lo<=i<=hi)
 decision='accepted';note=f'「{term}」：'+topic+' この定義の対象・作用・条件は簡体字訳でも保持されている。'
 if i in fix:decision='correction_proposed';note=fix[i][1]
 if i in source_issues:decision='needs_source_clarification';note=source_issues[i]
 gid=f'mfg40-zh-cn-review-{i:04d}'
 grouprecords.append({'groupId':gid,'termJa':term,'meaningJa':meaning,'target':target,'decision':decision,'contextNoteJa':note,'members':[x['key'] for x in members],'exactTripleGrouping':len(members)>1})
 for r in members:
  entry={'key':r['key'],'locale':'zh-CN','targetSha256':r['targetSha256'],'lessonSourceHash':r['lessonSourceHash'],'targetField':r['targetField'],'decision':decision,'contextNoteJa':note,'reviewGroupId':gid,'reviewMethod':'AI read Japanese term + Japanese definition + exact Simplified Chinese target; contextual semantic comparison','nativeReviewed':False,'expertReviewed':False}
  if i in fix:entry.update(before=r['target'],after=fix[i][0])
  reviews.append(entry)
assert len(reviews)==1077 and len({x['key'] for x in reviews})==1077
stats=collections.Counter(x['decision'] for x in reviews)
(OUT/'review.json').write_text(json.dumps({'schemaVersion':1,'locale':'zh-CN','inputSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'scope':'All 1077 supplied term meaning slots, read in 1073 exact term/definition/target groups; no unread slots','counts':dict(stats),'pendingUnread':0,'nativeReviewed':False,'expertReviewed':False,'reviews':reviews},ensure_ascii=False,indent=2)+'\n')
(OUT/'context-groups.json').write_text(json.dumps({'groups':grouprecords},ensure_ascii=False,indent=2)+'\n')
(OUT/'corrections.json').write_text(json.dumps({'locale':'zh-CN','corrections':[x for x in reviews if x['decision']=='correction_proposed'],'sourceClarifications':[x for x in reviews if x['decision']=='needs_source_clarification'],'changesAppliedToRuntime':False},ensure_ascii=False,indent=2)+'\n')
print(dict(stats))
