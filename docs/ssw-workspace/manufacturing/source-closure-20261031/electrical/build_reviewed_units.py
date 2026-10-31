"""Bounded AI semantic/source-to-paragraph comparisons, separate from extraction."""
import importlib.util
import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path
import fitz

HERE = Path(__file__).parent
spec = importlib.util.spec_from_file_location('electrical39', HERE/'build_inventory.py')
lib = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lib)
lessons, questions, _ = lib.load_app()
parser=argparse.ArgumentParser()
parser.add_argument('--pdf',type=Path,required=True)
PDF=parser.parse_args().pdf
assert lib.digest(PDF.read_bytes()) == lib.SOURCE_SHA
pdf = fitz.open(PDF)
rows = []


def add(page, claim, lid, paragraph, *, terms=(), qids=(), scope=None, qualification=None, kind='concept'):
    lid = 'mfg1-electrical-'+lid
    lesson = lessons[lid]
    p = next(p for p in lesson['paragraphs'] if p['id'] == paragraph)
    page_units = sum(r['physicalPage'] == page for r in rows)
    bindings = []
    for qid in qids:
        q = questions[qid]
        bindings.append({'questionId':qid,'path':q['_path'],'sourceHash':q.get('sourceHash'),'bindingStatus':'bounded_claim_to_question_objective_compared','answerAndDistractorCertification':False})
    actual_terms=[]
    for term in terms:
        found=next((t for t in lesson.get('terms',[]) if t['ja']==term),None)
        if found:
            actual_terms.append({'lessonId':lid,'termJa':term,'termDefinitionSha256':lib.digest(json.dumps(found,ensure_ascii=False,sort_keys=True)),'bindingStatus':'japanese_term_definition_compared'})
    entry={
        'id':f'mfg39-electrical-p{page:03d}-u{9001+page_units:04d}',
        'sourceId':lib.SOURCE_ID,'sourceSha256':lib.SOURCE_SHA,'physicalPage':page,'printedPage':page-9,
        'kind':kind,'bbox':[46.0,72.0,550.0,758.0],
        'bboxPrecision':'body_context_region; exact extracted object boxes are in objects.json, not a claim-specific outline',
        'summaryJa':claim,
        'evidence':{'newSourceTextRead':True,'newVisualOverviewViewed':page in [71,73,102,148,151,161,166,181,196], 'reviewMethod':'AI compared source text and this exact authored paragraph; dense symbol/table/diagram overview is not complete visual certification','sourceContextNotCopied':True},
        'status':'bounded_ai_semantic_mapping_reviewed_not_full_page_closed',
        'lessonBindings':[{'lessonId':lid,'paragraphId':paragraph,'path':lesson['_path'],'lessonSourceHash':lesson.get('sourceHash'),'paragraphSha256':lib.digest(p['textJa']),'bindingStatus':'bounded_claim_compared'}],
        'termBindings':actual_terms,'assessmentBindings':bindings,
        'exclusionReason':None,'duplicateOf':None,
        'scopeLimit':scope or 'This claim only. Other sentences, visual labels, table cells and conditions on the page remain individually unresolved.',
        'sourceQualification':qualification,
        'remainingActions':([] if bindings else ['Bind or author a question that specifically assesses this bounded claim; a general page citation does not establish assessment coverage.'])+(['Bind an explicit glossary term where pedagogically required.'] if terms and not actual_terms else []),
        'professionalExpertSignoff':False,'nativeReviewed':False,
    }
    rows.append(entry)


add(71,'基本例のa接点は操作で閉じ、起動後の導通経路を考えるときは初期状態と操作後を分ける。','l028','section-1',terms=['自己保持'],scope='a-contact operation only; source angle/drawing variants remain visual-object review tasks.',kind='contact_state')
add(71,'基本例のb接点は操作で開き、直列の停止接点が開けば保持経路が切れる。','l028','section-2',qids=['mfg1-electrical-weekly-04-q12'],kind='contact_state')
add(73,'抵抗器・可変抵抗器・コンデンサ・コイルの記号は外形写真ではなく、機能との対応で区別する。','l087','section-1',scope='Four named symbol families only. The 22-row source table is not closed by this statement.',kind='symbol_correspondence')
add(73,'押しボタンの自動復帰と、非常停止操作部の保持・解除条件を区別する。','l087','section-2',terms=['自動復帰'],qids=['mfg1-electrical-weekly-13-q03'],qualification='Does not certify a machine safety function or prescribe an emergency-stop circuit.',kind='symbol_function')
add(73,'表示灯・電流計・ヒューズは、表示・計測・保護という別の目的に対応する。','l087','section-3',qids=['mfg1-electrical-weekly-13-q10'],kind='symbol_correspondence')
add(86,'圧着では端子と電線だけでなく、端子に適合する工具の歯形も合わせる。','l001','section-2',terms=['圧着端子'],scope='Source tool-purpose table supports compatibility principle; exact real-tool appearance still needs separate acceptance.',kind='tool_selection')
add(89,'単線の直径表示と、より線の断面積表示は異なる量なので、同じ数字だけで工具位置を選ばない。','l001','section-1',terms=['断面積'],qids=['mfg1-electrical-formative-001'],kind='quantity_and_unit')
add(90,'凝固途中の接合部を動かさず、冷却後の状態で適合を確認する。','l002','section-2',terms=['冷却','接合部'],qids=['mfg1-electrical-formative-003'],kind='solder_quality')
add(90,'はんだ材料やフラックスの条件を特定し、合金の比較表の一例を全製品の品質順位に一般化しない。','l065','section-1',qualification='Source table contains particular alloy examples and broad comparison wording; material/process/customer conditions remain required.',kind='source_qualified_comparison')
add(99,'アナログ指針の読取りは対応するレンジと目盛を組み合わせ、視差を抑える。','l073','section-1',terms=['視差'],qids=['mfg1-electrical-weekly-11-q03'],kind='meter_readout')
add(100,'電流の測定は対象経路への直列接続が基本で、電圧測定の接続と混同しない。','l005','section-1',qualification='Source describes a measurement concept, not authority to connect a meter to a live installation.',kind='measurement_topology')
add(102,'V/divは電圧、一目盛り当たりの時間はs/divであり、軸の設定とdiv数を一組で読む。','l007','section-1',terms=['振幅','波形'],kind='formula_and_axes')
add(102,'同じ向きの周期状態へ戻る間隔から周期を求め、秒への換算後に周波数を計算する。','l007','section-2',terms=['周期','周波数'],qids=['mfg1-electrical-formative-012'],kind='formula_and_units')
add(102,'ピーク間の差を振幅の二倍と扱えるのは、ゼロを中心とした対称条件がある場合である。','l007','section-1',terms=['振幅'],qualification='Original source illustration is symmetric; this is not a universal rule for offset/asymmetric signals.',kind='waveform_condition')
add(104,'LCR計ではL・C・Rを対応する物理量として区別する。','completion37-lcr','section-1',qids=['mfg1-electrical-completion37-lcr-q01'],kind='instrument_function')
add(104,'教材の自動平衡方式は電圧・電流・位相差の測定情報を演算へ用いる。','completion37-lcr','section-2',qids=['mfg1-electrical-completion37-lcr-q02'],scope='The described method only; not a derivation of every bridge circuit or calibration procedure.',kind='measurement_information')
add(105,'熱電対は異種金属の組合せと温度差に関わる熱起電力を利用する。','completion37-thermocouple','section-1',qids=['mfg1-electrical-completion37-thermocouple-q01'],kind='sensor_principle')
add(105,'熱電対の計測側だけでなく基準側の温度と補償条件も測定系として確認する。','completion37-thermocouple','section-2',qids=['mfg1-electrical-completion37-thermocouple-q02'],qualification='Source range wording has a separately recorded errata qualification; a K-type name does not guarantee one universal operating range.',kind='measurement_condition')
add(105,'照度計の受光に使う例としてフォトダイオードを対応させる。','completion37-light','section-1',qids=['mfg1-electrical-completion37-light-q01'],kind='component_function')
add(105,'照度と磁束密度は別の測定量であり、照度計とガウスメーターを同用途と扱わない。','completion37-light','section-2',qids=['mfg1-electrical-completion37-light-q02'],kind='quantity_distinction')
add(105,'ホール効果の電圧方向は、電流方向と磁界方向の両方に直交する。','completion37-hall','section-1',qids=['mfg1-electrical-completion37-hall-q01'],scope='Mutual directions only. Polarity/sign requires the stated carrier/material convention; no unchecked polarity rule is inferred.',kind='direction_geometry')
add(129,'Vを横軸、Iを縦軸にした比例直線では、傾きI/Vは抵抗の逆数に当たる。','l093','section-2',qualification='Constant-condition resistive model; not a claim that every device is linear.',kind='graph_and_formula')
add(130,'節点では流入電流と流出電流の合計を、矢印と符号をそろえて比較する。','l070','section-1',terms=['節点','電流則'],kind='circuit_conservation')
add(131,'閉路では選んだ周回方向と極性に従って、電位差を符号付きで合計する。','l070','section-2',terms=['閉路','電圧則'],kind='circuit_conservation')
add(137,'n型とp型では多数キャリアの種類を分け、材料全体が単純な正負の電荷だとは捉えない。','l071','section-1',terms=['キャリア'],kind='semiconductor_carriers')
add(137,'シリコンへのドナーとアクセプターの例は、価電子数と電子・正孔の違いへ対応させる。','l071','section-2',terms=['価電子'],kind='semiconductor_doping')
add(138,'pn接合の境界には移動できる多数キャリアの少ない領域ができ、物質が消えた隙間とは区別する。','l071','section-3',terms=['空乏層','再結合'],qualification='Source diagram is an introductory model. Fixed ions and minority-carrier behavior prevent an absolute no-charge/no-carrier generalization.',kind='semiconductor_junction')
add(139,'ダイオードはAとKの方向性を持ち、整流の基本を極性と結び付ける。','l018','section-1',terms=['順方向','逆方向'],qids=['mfg1-electrical-weekly-03-q04'],qualification='Source idealized no-reverse-current wording is not a universal real-component specification; leakage and breakdown conditions require datasheets.',kind='component_polarity')
add(148,'負荷の両端電圧を測る概念図では、電圧計を負荷と並列につなぐ。','l005','section-1',scope='Topology concept only; actual rating, leads, isolation and permission are separate.',kind='measurement_topology')
add(151,'抵抗測定の方法名としてブリッジ法と電圧降下法を区別する。','completion37-resistance','section-1',qids=['mfg1-electrical-completion37-resistance-q01'],qualification='The page names bridge measurement but does not derive a full bridge construction/balance circuit; do not claim that extra content is source-supported.',kind='measurement_method')
add(151,'電圧降下法ではR=V/Iを使う際に電流をAへ換算し、導線・接点・計器の抵抗による影響も分ける。','completion37-resistance','section-2',qids=['mfg1-electrical-completion37-resistance-q02'],qualification='The assessment supplies its own voltage/current values as a paper model; no invented source limits or universal acceptance threshold.',kind='formula_and_error')
add(152,'交流電流の可否はテスター全体へ一律に決めず、その機種の機能・端子・定格を確認する。','l073','section-2',qids=['mfg1-electrical-weekly-11-q10'],qualification='New comparison of source99 with152 finds different scope wording. Existing app paragraph already carries the model-specific qualification; source152 is not used as a universal prohibition.',kind='source_scope_conflict')
add(161,'二値論理の分配則はANDをORへ配る形と、ORをANDへ配る双対形を区別して検証する。','l075','section-2',terms=['分配則','真理値表'],qids=['mfg1-boolean-distributivity-check-01'],qualification='Runtime uses source-bound boolean-editorial overlay. Canonical paragraph alone lacks the second form; overlay linkage is recorded below.',kind='logic_formula')
add(166,'基本的なオンディレーは入力オンから設定時間後に出力オンとなり、入力オフで出力オフへ戻る。','l077','section-2',terms=['オンディレー'],scope='This atom covers on-delay only; the next atom covers off-delay. Product power-loss behavior remains conditional.',kind='timing_chart')
add(166,'基本的なオフディレーは入力オンで出力し、入力オフから設定時間後に出力オフとなる。','l077','section-3',terms=['オフディレー'],kind='timing_chart')
add(169,'自己保持の基本回路では、起動接点と並列の自己接点が励磁経路を維持する。','l028','section-1',terms=['自己保持','励磁'],qids=['mfg1-electrical-weekly-04-q07'],qualification='Holding and power-restoration behavior is tied to this basic non-latching example; no general machine-safety certification follows.',kind='circuit_state')
add(181,'寸法合格だけで、別に指定された重量・強度などの構造確認まで合格とはしない。','l096','section-1',terms=['構造検査'],qids=['mfg1-electrical-weekly-14-q05'],kind='inspection_scope')
add(181,'電気安全の各試験は対象・設備・印加条件が異なり、一般的なテスター名だけで全試験に適合するとしない。','l096','section-3',qualification='Source overview table is not a full operational procedure for insulation/withstand/EMS tests.',kind='test_equipment_scope')
add(196,'レジストの保護と、不要銅を取り除くエッチングを別の役割として工程断面へ対応させる。','l026','section-2',terms=['レジスト','エッチング'],qids=['mfg1-electrical-weekly-04-q11'],qualification='Source process is one illustrated method. Photoresist polarity, exposure/development conditions and process recipes are not generalized.',kind='process_figure')

# Correct the Boolean paragraph binding to the exact runtime wording, not the
# shorter frozen historical paragraph.
boolean=json.loads((lib.ROOT/'src/data/manufacturing/boolean-editorial.json').read_text())
for row in rows:
    if row['kind']=='logic_formula':
        row['lessonBindings'][0].update(effectiveTextOverlay='src/data/manufacturing/boolean-editorial.json',effectiveParagraphSha256=lib.digest(boolean['wording']['ja']['after']),originalParagraphSha256=row['lessonBindings'][0]['paragraphSha256'])

lib.save(HERE/'knowledge-units.json',{'schemaVersion':1,'sourceId':lib.SOURCE_ID,'sourceSha256':lib.SOURCE_SHA,'scope':'bounded_new_AI_source_to_authored_paragraph_comparison_not_exhaustive_atoms','reviewedSourceTextPages':[71,73,86,89,90,99,100,101,102,104,105,129,130,131,136,137,138,139,148,149,151,152,161,166,169,181,196,38,97],'visualOverviewPages':[71,73,102,148,151,161,166,181,196],'units':rows,'fullAtomicKnowledgeCoverageConfirmed':False})

pages=json.loads((HERE/'page-index.json').read_text())
objects=json.loads((HERE/'objects.json').read_text())['objects']
by_page=defaultdict(list)
for unit in rows:by_page[unit['physicalPage']].append(unit['id'])
for page in pages['pages']:
    page['reviewedBoundedKnowledgeUnitIds']=by_page[page['physicalPage']]
    page['extractedObjectsSemanticReviewPending']=len(page['objectIds'])
    page['objectCountMeaning']='All machine occurrences remain atom-level review candidates; reviewed bounded units do not close overlapping objects automatically.'
    page['priority']='high' if page['physicalPage'] in range(61,153) or page['physicalPage'] in range(158,183) or page['physicalPage'] in range(193,198) else 'normal'
    page['priorityReason']='symbols/tools/measurements/components/circuits/control/inspection/process knowledge' if page['priority']=='high' else 'safety/quality/materials/packaging/navigation knowledge retained; not omitted'
    if page['physicalPage'] in (38,97):
        page['unusedDisposition']='source_authored_exercise_not_reproduced; capability_mapping_review_needed'
        page['exerciseExclusion']={'exclude':'Original source exercise expression, drawing and exact numerical instance','retain':'Underlying classification/readout capability','reason':'Independent authorship requires a new exercise; no direct source-page citation does not prove the underlying concept is absent.','candidateAppIds':['mfg1-electrical-l004'] if page['physicalPage']==97 else ['mfg1-electrical-l045','mfg1-electrical-l050','mfg1-electrical-l051']}
lib.save(HERE/'page-index.json',pages)
lib.save(HERE/'review-summary.json',{'reviewedBoundedUnits':len(rows),'distinctNewSemanticReviewPages':len({r['physicalPage'] for r in rows}),'unitsWithAssessmentBindings':sum(bool(r['assessmentBindings']) for r in rows),'unitsWithoutAssessmentBindings':sum(not r['assessmentBindings'] for r in rows),'unitsWithGlossaryBindings':sum(bool(r['termBindings']) for r in rows),'unitKinds':dict(Counter(r['kind'] for r in rows)),'unresolvedWholePageClosure':198,'machineObjectsStillUnresolvedAtAtomicLevel':len(objects),'newVisualOverviewPages':9,'nativeOrDomainOrHumanCertification':False})
print('BOUNDED ELECTRICAL MAPPING',len(rows),'units',len({r['physicalPage'] for r in rows}),'pages; full-page/object closure remains false')
