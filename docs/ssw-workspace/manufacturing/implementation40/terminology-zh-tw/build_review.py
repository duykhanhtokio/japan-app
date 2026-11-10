"""Record the AI's explicit 1072-group semantic reading decisions.

The ranges below identify batches actually read in this session. They are not
an automatic approval rule based on hashes, non-empty strings or word matching.
All target mutations remain the root integrator's responsibility.
"""
import hashlib,json
from pathlib import Path
from collections import defaultdict,Counter

ROOT=Path(__file__).resolve().parents[5]
HERE=Path(__file__).parent
INPUT=ROOT/'docs/ssw-workspace/manufacturing/implementation40/language/term-review-inputs/zh-TW.json'
raw=INPUT.read_bytes();data=json.loads(raw);records=data['records']
groups={}
for record in records:
    groups.setdefault((record['termJa'],record['meaningJa'],record['target']),[]).append(record)
assert len(records)==1077 and len(groups)==1072

# Each batch was displayed with term, complete Japanese definition and complete
# effective Traditional-Chinese target. Identical triples share a judgement,
# retaining every separate record key and source/target hash below.
READ_BATCHES=[(0,139),(140,279),(280,419),(420,559),(560,699),(700,839),(840,979),(980,1071)]
CONTEXTS=[
 (0,18,'測定量・計器・基準側・標本化の定義を対比した。同時性、位相、温度差、測定系の役割を追加又は脱落させていない。'),
 (19,42,'電線、接合、目盛、端子と電気量の範囲を対比した。断面積と長さ、直列と並列、測定力と電圧を混同していない。'),
 (43,58,'周期・周波数・振幅と、連絡・報告・相談、危険と対策を対比した。量又は行動の主体を保っている。'),
 (59,86,'品質の割合・分布、図面尺度・材料・抵抗回路の語義を比較した。仕様と管理、値と許容差、分圧と分流を区別している。'),
 (87,118,'部品極性、静電気、論理、保全、IC・二進数の機能を比較した。オン・オフ、順逆、最大限度や入力の条件を逆転していない。'),
 (119,158,'配線板・潤滑・自己保持・変換・油圧・包装・樹脂の語義を比較した。材料、工程、量と機能の区別を保持している。'),
 (159,186,'ねじ、切削工具、比較測定、センサーと電磁気の定義を対比した。内外ねじ、直径・断面、温度・磁束の対象が一致している。'),
 (187,218,'試験方式、職場役割、安全表示と品質段階を比較した。必要条件、責任、禁止・注意・退避の意味を保っている。'),
 (219,245,'QC、校正、規格・SI、酸化還元と3Rを比較した。比率の母数、電子の授受、校正と調整の区別を保っている。'),
 (246,279,'法令と規格の対象、製図、材料と軟銲・受動部品の定義を比較した。根拠の版と機能の範囲を勝手に拡張していない。'),
 (280,306,'受動素子、切削、電気量と半導体の定義を比較した。Wと時間積分、過渡・定常、キャリアと固定電荷の区別に反する訳ではない。'),
 (307,338,'測定誤差、引継ぎ、論理・リレー・タイマーと回転機の語義を比較した。遅れてオンと遅れてオフ、回転磁界と軸出力を保持している。'),
 (339,373,'保全、包装、成形、配線板、漏電・接地と測定方法の範囲を比較した。一般的な方法説明を具体的な作業許可に変えていない。'),
 (374,419,'表示、比較測定、製図と職場の安全行動を比較した。測定基準、図線、異常時の担当や危険の意味を維持している。'),
 (420,449,'品質、QC、SI、材料試験を比較した。数と連続量、応力とひずみ、試験対象を逆転又は省略していない。'),
 (450,477,'探傷、官能、計測器、目盛、公差と保全の定義を比較した。非破壊、表面開口、固定側・可動側、許容差と公差を維持している。'),
 (478,509,'材料性質、熱処理、切削・塑性加工・樹脂成形を比較した。弾性と塑性、淬火後の再加熱、工具側と工作物側の動きを混同していない。'),
 (510,537,'塗装、包装、圧延・押出、酸化還元と資源循環の範囲を比較した。膜の形成、素材、前後処理の主体と方向が対応している。'),
 (538,569,'規格、機械試験、比較測定・ゲージと投影図を比較した。通る側・止まる側、内径、図面の方向と形状を逆転していない。'),
 (570,597,'寸法・幾何・表面図線と計測器を比較した。上限下限、基準、切断面、同体積、測定の基点の関係が一致している。'),
 (598,637,'担当、教育、災害防止、情報・品質記録を比較した。資格や担当範囲、承認、退路、旧版・訂正の限定を保っている。'),
 (638,669,'電流方向、定格、接地・漏電、機器と試験語彙を比較した。導体・絶縁体、蓄積と放出、試験の正誤判断を保っている。'),
 (670,699,'安全表示、QCデータ、硬さ・探傷・測定器と製図を比較した。標識の危険対象と測定量、データの種類、図線の範囲を一致させている。'),
 (700,737,'幾何特性、機械各部、材料加工・表面処理の定義を比較した。機能と部位、熱と化学反応、圧延や押出の対象を保っている。'),
 (738,763,'計測、化学分析、材料、QC・環境と膜構造の定義を比較した。比較条件、当量の指定反応、管理限界と仕様限界の違いを保っている。'),
 (764,793,'安全・電解・腐食・膜・前処理と研磨の定義を比較した。陽極の酸化と陰極の還元、単位面積電流、皮膜と基材の役割を維持している。'),
 (794,823,'研磨、滴定、濃度・量、酸化物と合金の定義を比較した。終点と当量点、溶質と溶媒、体積と質量の定義範囲を対比した。'),
 (824,853,'前後処理、付着欠陥、めっきの方法、環境負荷と測定器を比較した。外部通電の有無や処理剤の役割、処理順の語義を保っている。'),
 (854,886,'検査見本・照度・伝導、治具・浴・反応・電流効率と皮膜機能を比較した。物理量と機能の別、目的反応や指定条件を確認した。'),
 (887,915,'整流、循環・ろ過、塗膜処理、保持、報連相とQC記録を比較した。動作方向、担当者へ求める行動、開始・変更後の条件を保っている。'),
 (916,945,'比率・相関、電気量、教育とリスク・規格の定義を比較した。母数、単位、許される範囲、現象と対策の区別が対応している。'),
 (946,979,'資源循環、酸塩基、半反応・当量、pH電極と電磁気・材料の定義を比較した。反応依存性、授受方向、電荷収支と慣用電流を維持している。'),
 (980,1009,'表面機能、規制名、皮膜工程と欠陥・仕上げを比較した。例・区分という限定、皮膜と基材、ピットと貫通孔の区別を保っている。'),
 (1010,1042,'端面欠陥、膜厚測定、水質・濃度、分析、塗料型と研磨材を比較した。方法の対象と単位、層・成分の区別に反する訳ではない。'),
 (1043,1071,'役割・安全体制・材料参照値・単位・学習条件を比較した。保証値ではないこと、担当規定、入門例という範囲を脱落させていない。'),
]

# Explicitly authored replacements after reading the complete before/JA/context.
CORRECTIONS={
193:('進行指示與報告時，各職責之間的指揮與通報關係。','role_relation','指揮系統は単なる角色聯絡ではなく、指示・報告を担う役割の連鎖である。関係を明示し、勝手な指示権限は加えない。'),
227:('按已定義的項目收集資料的表格。','wrong_word','項目が專案（project）へ変わっていた。チェックシートで定義するのは収集欄・項目であり、事業計画ではない。'),
230:('兩個量之間可觀察到的關聯。','scope_narrowing','原文の二つの量を兩個物理量に限定していた。品質の件数等も対象なので物理という限定を外す。'),
255:('將投影圖配置在與觀察方向相對應一側的正投影法。','drawing_term_precision','製図の図を投影檢視とするとソフトの表示操作と紛れやすい。投影圖として第三角法の配置関係を維持する。'),
258:('主要用來表示形狀或功能的投影圖。','drawing_term_precision','ここでの正面図は主要な投影図であり、投影檢視という操作名ではない。視点や機能を新たに追加しない。'),
275:('軟銲時幫助處理氧化膜並促進潤濕的材料。','process_scope','はんだ付けを一般の焊接とだけ訳すと溶融溶接のフラックスへ広がる。電子組立の軟銲という工程範囲を明示する。'),
330:('從停機狀態開始運轉。','machine_context','始動は回転機等の運転開始であり、程式を執行する意味ではない。停機から運轉の状態変化を保持する。'),
365:('按要求核對產品的構成、重量、強度等的檢驗。','incomplete_phrase','按要求核構成は核對の對が落ちて文の関係が不明瞭だった。製品構成・重量・強度の要求照合を明示する。'),
703:('與圓柱形狀規整程度有關的幾何特性。','geometric_meaning','円筒度は円筒形状の整い方であり、材料が完全か壊れていないかという完整程度ではない。幾何的な形の規整に戻す。'),
747:('因與器壁相互作用而彎曲的液面。','wrong_character','メニスカスの液面が液麪と誤表記されていた。麪はこの液体表面の語ではなく、面へ訂正する。'),
857:('表示照射到表面之光照程度的量。','photometric_quantity','照度の説明を亮度とすると別の測光量luminanceと混同する。面に届く光照程度という対象を保つ。'),
886:('容易透過軟銲等方式接合的性質。','process_scope','はんだ付けの例を一般の焊接だけで表すと工程範囲が広すぎる。軟銲を明示し、等の例示範囲は保つ。'),
903:('結合報告、聯絡與諮詢的資訊共享方式。','wrong_action','相談が商談（商業交渉）になっていた。報連相では判断や対応の相談・助言を求めるので諮詢とする。'),
1033:('作為單一塗料使用的形式。','formulation_vs_quantity','一液型の一つを一份という分量へ寄せていた。二液型との対比で単一塗料の形式と読み、混合量や配合条件を追加しない。'),
}
SOURCE_HOLDS={
34:'原日本語の端数=整数部分より小さい値は、整数部分が0の場合や丸めの余り等への範囲が曖昧。訳だけを変更せず日本語定義の精密化へ送る。',
150:'圧力の原定義は面に加わる力の程度という入門的な記述。力と単位面積当たりの量の区別は原文側の精密化として確認し、訳だけで別の定義を追加しない。',
817:'質量の原定義に物質の量という表現があり、molの物質量との混同余地がある。対象訳は原文に追随しているため、まず日本語の量と単位を確認する。',
}
SPECIAL_NOTES={
7:'電信息は臺灣向けとして電気的な訊號／資訊が自然だが、光を電気情報へ変えるという技術意味は保存されている。地域語感を技術誤りと数えない。',
301:'結はこの半導体文脈でjunctionを指す。臺灣では接面の表現も自然だが、多数載子の減少という意味は維持しており、ここでは別途の用語統一候補とする。',
304:'柵はgateの用語であり、臺灣の閘と地域差がある。絶縁ゲート・双極型・電力素子の関係は維持されている。',
659:'二極管と二極體には地域・慣用差があるが、LEDの発光するダイオードという意味は同じ。語形差だけで誤訳とはしない。',
275:CORRECTIONS[275][2],886:CORRECTIONS[886][2],
834:'このフラックスは溶融めっきの前処理文脈。軟銲のフラックスと同じ一律定義へ統合せず、表面と溶融金属の範囲を保持する。',
1065:'入門例という限定を原文・訳の両方で保っている。全温度・条件で中性が必ずpH7と新たに保証していない。',
1066:'入門例という限定を保っている。温度条件を捨ててすべての液の中性値をpH7に固定する新しい規則は加えない。',
}

judgements=[];decisions=[];corrections=[];holds=[]
for gi,((term,meaning,target),members) in enumerate(groups.items()):
    assert any(lo<=gi<=hi for lo,hi in READ_BATCHES)
    note=next(note for lo,hi,note in CONTEXTS if lo<=gi<=hi)
    decision='retain_after_ai_semantic_comparison'
    detail=f'「{term}」：'+SPECIAL_NOTES.get(gi,note)
    if gi in CORRECTIONS:
        after,kind,why=CORRECTIONS[gi]
        decision='replace_after_ai_semantic_comparison';detail=why
    elif gi in SOURCE_HOLDS:
        decision='retain_target_pending_japanese_definition_precision';detail=SOURCE_HOLDS[gi]
    judgements.append({'groupId':f'zh-tw40-g{gi:04d}','readBatch':next(i+1 for i,(lo,hi) in enumerate(READ_BATCHES) if lo<=gi<=hi),'termJa':term,'meaningJa':meaning,'target':target,'decision':decision,'contextNoteJa':detail,'memberKeys':[r['key'] for r in members],'semanticReviewedByAI':True,'nativeReviewed':False,'domainReviewed':False})
    for record in members:
        assert hashlib.sha256(target.encode()).hexdigest()==record['targetSha256']
        row={**record,'locale':'zh-TW','groupId':f'zh-tw40-g{gi:04d}','decision':decision,'contextNoteJa':detail,'semanticReviewedByAI':True,'nativeReviewed':False,'domainReviewed':False}
        if gi in CORRECTIONS:
            after,kind,why=CORRECTIONS[gi]
            row.update(before=target,after=after,changeKind=kind)
            corrections.append({k:row[k] for k in ['key','locale','termJa','meaningJa','lessonSourceHash','targetField','targetSha256','before','after','changeKind','contextNoteJa']})
        elif gi in SOURCE_HOLDS:
            holds.append({k:row[k] for k in ['key','locale','termJa','meaningJa','lessonSourceHash','targetField','targetSha256','decision','contextNoteJa']})
        decisions.append(row)
HERE.mkdir(parents=True,exist_ok=True)
def save(name,value):(HERE/name).write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
save('review-groups.json',{'schemaVersion':1,'locale':'zh-TW','groups':judgements,'method':'Complete JP-definition and effective target meaning read in eight bounded batches; exact identical triples share one judgement only.'})
save('decisions.json',{'schemaVersion':1,'locale':'zh-TW','inputSha256':hashlib.sha256(raw).hexdigest(),'records':decisions})
save('corrections.json',{'schemaVersion':1,'locale':'zh-TW','inputSha256':hashlib.sha256(raw).hexdigest(),'corrections':corrections,'runtimeMutationPerformedByThisLane':False})
save('japanese-definition-holds.json',{'schemaVersion':1,'locale':'zh-TW','items':holds,'targetTranslationErrorClaimed':False,'requiresCanonicalAuthorDecision':True})
summary={'schemaVersion':1,'locale':'zh-TW','inputRecords':1077,'distinctTriples':1072,'actuallyReadGroups':len(judgements),'reviewedRecordSlots':len(decisions),'unreadRecordSlots':0,'replacementGroups':len(CORRECTIONS),'replacementRecordSlots':len(corrections),'japaneseDefinitionPrecisionGroups':len(SOURCE_HOLDS),'japaneseDefinitionPrecisionRecordSlots':len(holds),'decisionCounts':dict(Counter(r['decision'] for r in decisions)),'inputSha256':hashlib.sha256(raw).hexdigest(),'hashesAreEvidenceNotSemanticApproval':True,'translatedNameFieldsNotInThisInput':'Not reviewed by this definition-only input','fullProseOrAllQuestionTranslationsReviewed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceVerified':False,'runtimeMutationPerformedByThisLane':False}
save('summary.json',summary)
assert len({r['key'] for r in decisions})==1077
assert len(decisions)==1077 and len(judgements)==1072
assert all(r['semanticReviewedByAI'] and r['contextNoteJa'] for r in decisions)
assert {r['key'] for r in decisions}=={r['key'] for r in records}
assert all(c['before']!=c['after'] for c in corrections)
save('validation.json',{'status':'PASS_exact1077inputslot_coverage_hashes_groupmembership_and_explicit_decisions','summary':summary,'nativeOrProfessionalCertification':False})
print(json.dumps(summary,ensure_ascii=False))
