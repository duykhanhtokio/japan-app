#!/usr/bin/env python3
"""Canonical source-first acceptance view. Topic/TOC links never close facts.
Manual source selections are concise independently phrased facts, not PDF prose.
"""
from pathlib import Path
import json,gzip,hashlib
R=Path(__file__).resolve().parents[2];O=R/'docs/ssw-workspace/source-coverage-v2';D=R/'src/data/food-manufacturing'
BASE='5ff65af0fe2ec63eb0b47c250212fd5dcc7c3c6a'
RECEIPT='docs/ssw-workspace/food-manufacturing/source-v2-20261102/source-review.json'
def read(p):return json.loads(p.read_text())
def sha(b):return hashlib.sha256(b).hexdigest()
def value_hash(v):return sha(json.dumps(v,ensure_ascii=False,separators=(',',':')).encode())
regions={key:json.loads(gzip.decompress((O/f'food-{key}-regions.json.gz').read_bytes())) for key in ['ssw1','ssw2']}
# Reset only classification/link fields; the extraction objects/hashes stay fixed.
for a in regions.values():
 for page in a['pages']:
  for e in page['elements']:e.update(classification='pending',knowledgeIds=[],reason=None)
lessons=read(D/'lessons.2.ja.json')['lessons'];li={l['id']:i for i,l in enumerate(lessons)}
exams=read(D/'exams.ja.json')['exams'];questions={q['id']:(ei,qi,q) for ei,e in enumerate(exams) for qi,q in enumerate(e['questions'])}
units=[]
def evidence(path,pointer,value,note):return {'path':str(path),'jsonPointer':pointer,'sha256':value_hash(value),'sha256Mode':'json-value','relation':'direct','semanticReviewed':True,'reviewNote':note}
def teach(lesson,paragraph,note):
 i=li[lesson];j=next(j for j,p in enumerate(lessons[i]['paragraphs']) if p['id']==paragraph)
 return evidence('src/data/food-manufacturing/lessons.2.ja.json',f'/lessons/{i}/paragraphs/{j}/textJa',lessons[i]['paragraphs'][j]['textJa'],note)
def question(qid,note):
 ei,qi,q=questions[qid];return evidence('src/data/food-manufacturing/exams.ja.json',f'/exams/{ei}/questions/{qi}',q,note)
def exact_elements(page,box):
 x0,y0,x1,y1=box;out=[]
 for e in regions['ssw2']['pages'][page-1]['elements']:
  a,b,c,d=e['bbox'];cx=(a+c)/2;cy=(b+d)/2
  if x0<=cx<=x1 and y0<=cy<=y1:out.append(e)
 assert out,(page,box)
 return out

def manual(slug,page,box,statement,lesson=None,paragraph=None,qids=(),conditions=(),gap=None,supplement=False,check=False):
 kid='food-v2-'+slug;els=exact_elements(page,box)
 for e in els:
  e['classification']='knowledge';e['knowledgeIds'].append(kid)
 teaching=[];assess=[]
 if lesson:teaching=[teach(lesson,paragraph,'Source claim/conditions were read in the selected source region and compared directly to this paragraph; only the stated scope is accepted.')]
 if supplement:
  n=50 if supplement==50 else 49;pack=read(D/f'source-closure{n}.json');s=pack['sections'][0]
  teaching=[evidence(f'src/data/food-manufacturing/source-closure{n}.json','/sections/0/textJa',s['textJa'],'New independent explanation explicitly includes this source condition; it identifies textbook examples separately from workplace decision criteria.')]
 if qids:assess=[question(qid,'Self-read question, choices, answer and all rationales: directly tests this unit within the conditions stated here.') for qid in qids]
 if check:
  n=50 if supplement==50 else 49;pack=read(D/f'source-closure{n}.json');c=pack['checks'][0]
  assess=[evidence(f'src/data/food-manufacturing/source-closure{n}.json','/checks/0',c,'Independent C/D ratio comparison and all four source improvement cases were checked with exact arithmetic.' if n==50 else 'The new fictional sequences require the 9-point one-side and 6-point trend observations, then separate observed sequence from cause/action; expected points were self-checked.')]
 unresolved=[]
 if not teaching:unresolved.append('A direct teaching leaf for this exact source claim has not been established; broad topic links are not accepted.')
 if not assess:unresolved.append('No individually justified assessment evidence accepted yet; assessment search across the full app scope is incomplete, so absence is unknown, not an established missing item. No automatic same-topic question assignment.')
 if gap:
  unresolved.append(gap)
  for e in teaching+assess:
   e['relation']='candidate';e['semanticReviewed']=False;e['reviewNote']='Candidate only: '+gap

 covered=bool(teaching and assess and not gap)
 u={'knowledgeId':kid,'sourceRefs':[{'sourceId':'food-2','pdfPage':page,'elementIds':[e['elementId'] for e in els]}],
 'statementJa':statement,'conditionsJa':list(conditions),'exceptionsJa':[], 'importance':'core','classification':'knowledge',
 'before':{'teaching':'partial' if supplement else ('present' if teaching else 'unknown'),'assessment':'missing' if supplement else ('present' if assess else 'unknown')},
 'after':{'teaching':'present' if teaching and not gap else ('partial' if teaching else 'unknown'),'assessment':'present' if assess else 'unknown'},
 'teachingEvidence':teaching,'assessmentEvidence':assess,'imageEvidence':[], 'assessmentRequirement':'required','assessmentExemptionReason':None,
 'expressionReview':{'status':'independent_ai_checked','note':'Concise fact objective and app text checked independently; exact source example numbers/diagram arrangements are not reproduced. Professional terms and factual conditions are retained.'},
 'sourceReview':{'status':'self_checked_ai','conditionsChecked':True,'reviewRef':RECEIPT},'status':'covered_ai' if covered else 'partial','unresolved':unresolved,
 'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}}
 units.append(u)

# Source-first visual reading of the column and all eight diagram captions.
# The numbers are source examples, not a statement of current JIS/workplace rules.
patterns=[
 ('single-limit',93,[84,165,280,266],'管理線を越える点を判定例として識別する。',False),
 ('same-side-nine',93,[315,165,530,266],'中心線の同じ側に続く9点を教材例として識別する。',True),
 ('monotone-six',93,[84,285,280,388],'増加または減少が続く6点を教材例として識別する。',True),
 ('alternating-fourteen',93,[315,285,530,388],'増減を交互に繰り返す14点を教材例として識別する。',False),
 ('two-of-three',93,[84,402,280,506],'3点中2点が限界側に寄る教材例を区別する。',False),
 ('four-of-five',93,[315,402,530,506],'5点中4点が限界側に寄る教材例を区別する。',False),
 ('central-fifteen',93,[84,522,280,627],'中心付近に15点が続く教材例を識別する。',False),
 ('noncentral-eight',93,[315,522,530,627],'中心付近を避ける8点が続く教材例を識別する。',False)]
for slug,p,b,s,c in patterns:manual(slug,p,b,s,conditions=['教材の判定例。「近い」範囲と運用基準は職場で確認する。','数値を持つ並びや区間は連続した記録として読む。'],supplement=True,check=c)
manual('chart-workplace-criteria',92,[80,683,515,779],'製品特性に応じた職場の管理図判定基準を確認する。',conditions=['教材はJISの例を参考としている。全工場に同一条件を適用しない。'],supplement=True,check=True)
manual('chart-setting-authority',92,[80,82,515,151],'管理線の設定は製品特性を基に管理部門が行うという役割を説明する。',gap='New supplement prevents unilateral setting changes, but does not yet teach the source management-department assignment explicitly.',supplement=True)
manual('chart-cause-hypothesis',92,[80,467,515,659],'偏りや散らばりの観察と原因仮説を分け、調査で確かめる。',supplement=True,check=True)
manual('chart-limit-action',92,[80,466,510,489],'限界外を検知した際は定めた是正処置に結び付ける。',lesson='food-2-021',paragraph='p3',qids=['food-2-q259'],gap='Base paragraph teaches observing limits but does not itself explain the prescribed corrective-action linkage.')
manual('chart-central-variance',92,[80,587,515,632],'中心付近への集中はばらつき低下の可能性として調べる。',gap='The concentration pattern is now taught; its possible variance interpretation and improvement check still need a direct teaching/assessment leaf.')
manual('chart-mixed-populations',92,[80,611,515,659],'中心付近を避ける分布では集団の混在を仮説とし層別を検討する。',gap='Eight-point pattern taught; mixing/stratification explanation is not yet explicitly tied to this chart pattern.')

# Chapter4 opening: independently decomposed claims, preserving source scope.
manual('qcd-cost-delivery',95,[72,78,530,364],'生産管理とQCDの原価・納期の関係を説明する。','food-2-022','p1',qids=['food-2-q302'])
manual('production-environment',95,[72,285,530,366],'この章の生産管理には環境対策も含めて考える。',gap='Environment is taught elsewhere, but this source linkage has not been directly anchored; no whole-chapter closure.')
manual('labor-cost',95,[72,399,530,485],'人を投入することで発生する労務費を識別する。','food-2-022','p1',qids=['food-2-q301'])
manual('material-cost',95,[72,399,530,485],'使う原材料と原材料費を対応させる。','food-2-022','p1',qids=['food-2-q301'])
manual('energy-cost',95,[72,423,530,510],'設備に使う動力資源と動燃費を対応させる。','food-2-022','p1',qids=['food-2-q301'])
manual('cost-planned-range',95,[72,490,530,582],'原価管理では費用を計画範囲と比較して改善する。','food-2-022','p1',qids=['food-2-q381'],gap='Paragraph names cost resources but not explicitly comparison with a planned cost range; retain partial.')
manual('progress-delivery',95,[72,650,530,782],'各現場の進捗管理が会社の納期管理を支えることを説明する。','food-2-022','p1',qids=['food-2-q032'])
manual('company-factory-line',96,[72,105,530,390],'会社から工場、ラインへ生産計画を具体化する。','food-2-022','p2')
manual('company-plan-components',96,[72,176,530,271],'計画で生産量・時期・改善目標・要員・設備・材料調達を整理する。','food-2-022','p2',qids=['food-2-q305'],gap='Existing paragraph summarizes deployment but does not enumerate every company-level planning component.')
manual('leader-plan-implementation',96,[72,297,530,390],'職長は担当現場の作業・進捗計画を作り実施する。','food-2-022','p2',qids=['food-2-q275'])
manual('productivity-output-input',96,[72,444,530,749],'生産性を産出量と投入量の比として単位付きで計算する。','food-2-023','p1',qids=['food-2-q029'])
manual('output-alternative-measures',96,[72,444,530,652],'産出成果の量・金額など指標の違いを明示する。',gap='Current lesson fixes target/period/units but has no direct money-output comparison task; do not copy source currency example.')
manual('productivity-relative-change',97,[72,130,530,246],'投入と産出の両方が変わるときは変化率の関係で生産性を比べる。',supplement=50,check=True,conditions=['同じ製品・品質・単位と比較条件を確認する。産出だけで改善・悪化を判定しない。'])
manual('unit-input-per-product',97,[72,299,530,555],'原単位は製品量当たりの投入資源として計算する。','food-2-023','p1',qids=['food-2-q030'])
manual('reciprocal-scope',97,[72,324,530,555],'同じ投入資源と製品量で定義した生産性と原単位の逆数関係を説明する。','food-2-023','p1',gap='Both expressions are present as examples, but explicit reciprocal condition and comparison task remain missing.')
manual('cost-unit-reduction',97,[72,555,530,750],'製品当たりの資源投入を下げることと原価低減を関係付ける。','food-2-023','p1',qids=['food-2-q383'])
manual('standard-time-sum',98,[72,37,530,173],'標準時間は一定製品に必要な工程時間を合わせた基準である。','food-2-023','p3',qids=['food-2-q262'],gap='The current paragraph explains a set time but not the sum across constituent processes.')
manual('progress-adjustment',98,[72,105,530,198],'進捗を把握して日々の作業を調整する役割を説明する。','food-2-024','p2',qids=['food-2-q385'])
manual('standard-throughput',98,[72,175,530,270],'標準の製品量を標準時間で割り進捗の基準速度を作る。','food-2-023','p3',qids=['food-2-q388'])
manual('progress-chart-axes',98,[72,634,530,778],'進捗図の時間軸と累積出来高軸、標準線、許容範囲、実績線を区別する。',gap='Current lesson teaches cumulative/recent comparison but exact chart-label identification still needs direct evidence.')
manual('above-below-plan',99,[72,57,530,367],'進捗図の実績を標準線の上・下で比較する。','food-2-024','p2',qids=['food-2-q385'])
manual('line-standard-ratio',99,[72,396,530,614],'ラインの実績量を同期間の標準量で割り相対評価する。','food-2-023','p3',qids=['food-2-q388'])
manual('person-hours-definition',99,[72,620,530,750],'人数と作業時間から工数を人時で算出する。','food-2-023','p2',qids=['food-2-q031'])
manual('person-day-month',99,[72,620,530,750],'工数は時間基準に応じ人日・人月にもなると区別する。',gap='The app presently illustrates person-hours; day/month units are not directly explained here.')
manual('labor-output-per-mh',100,[72,57,530,240],'人時生産性を出来高と工数から計算する。','food-2-023','p2',qids=['food-2-q031'])
manual('line-labor-opposition',100,[72,250,530,444],'ラインの出来高増加と労働生産性低下が両立することを分析する。','food-2-023','p2',qids=['food-2-q264'])
manual('management-tradeoff-role',100,[72,250,530,444],'投入人員と生産量の選択を会社の状況に照らした判断へ報告する。','food-2-023','p2',qids=['food-2-q264'],gap='Both facts are reported, but source assignment of the final business trade-off to management is not explicit in this paragraph.')
manual('pre-run-resources',100,[72,535,530,748],'開始前に材料・要員・設備の準備状態を確認する。','food-2-024','p1',qids=['food-2-q305'])
manual('late-material-plan-review',100,[72,579,530,700],'材料手配が間に合わない場合に担当部門へ計画見直しを依頼する。','food-2-022','p3')
manual('pre-run-equipment',100,[72,682,530,748],'開始前の設備異常を確認し必要な調整・修理につなげる。','food-2-024','p1',qids=['food-2-q197'])
manual('recent-versus-cumulative',101,[72,60,530,245],'累積が計画内でも直近の速度低下を別に調べる。','food-2-024','p2',qids=['food-2-week-04-q03'])
manual('chart-versus-checklist',101,[72,175,530,320],'小さい遅延の拡大を見るため進捗図とチェックリストを使い分ける。','food-2-024','p2',gap='Cumulative/recent comparison exists; explicit checklist-versus-chart capability still lacks a direct teaching leaf.')
manual('delay-upstream',101,[72,348,530,420],'前工程からの仕掛品供給不足を遅延の一仮説として確認する。','food-2-024','p2')
manual('delay-material-lot',101,[72,416,530,444],'原料ロット変更で作業負担が変わる可能性を調べる。','food-2-024','p2')
manual('delay-equipment',101,[72,440,530,470],'自工程設備の異常を遅延要因として確認する。','food-2-024','p2',qids=['food-2-q197'])
manual('delay-worker-condition',101,[72,466,530,515],'作業者の体調や負担を遅延要因として確認する。','food-2-024','p2',qids=['food-2-q197'])
manual('wip-quality-coordination',101,[72,540,530,684],'仕掛品滞留の品質影響を踏まえ前後工程と対応を調整する。','food-2-024','p2',qids=['food-2-q071'])
manual('end-run-records',101,[72,708,530,780],'終業時に稼働・原料受払・在庫を記録し報告する。','food-2-024','p3',qids=['food-2-q363'])

# Self-review rejected broad topic-based assessment assignments. Preserve these
# candidates for follow-up; never count them as individually tested facts.
weak={
 'qcd-cost-delivery':'q302 tests delivery scheduling, not the full QCD cost/delivery relationship.',
 'labor-cost':'q301 supplies the cost labels and asks addition; it does not test the definition of labour cost.',
 'material-cost':'q301 supplies the cost labels and asks addition; it does not test category identification.',
 'energy-cost':'q301 supplies the cost labels and asks addition; it does not test energy-resource classification.',
 'leader-plan-implementation':'q275 tests policy deployment, not production/progress-plan implementation as a complete competence.',
 'cost-unit-reduction':'q383 calculates resource-use reduction; the linked paragraph lacks an explicit cost-reduction relationship.',
 'standard-throughput':'q388 uses a given standard rate; it does not derive a standard rate from quantity and standard time.',
 'above-below-plan':'q385 supplies the falling-progress observation; it does not independently assess graph-position reading.',
 'pre-run-equipment':'q197 tests patrol observations; pre-run adjustment/repair is a different condition.',
 'delay-equipment':'q197 tests broad patrol coverage, not diagnosis of equipment as a progress-delay hypothesis.',
 'delay-worker-condition':'q197 tests broad patrol coverage, not the worker-condition delay hypothesis.',
 'end-run-records':'q363 tests precise wording/units, not completeness of end-run production/material/inventory reporting.'}
for u in units:
 slug=u['knowledgeId'].removeprefix('food-v2-')
 if slug in weak:
  u['status']='partial';u['after']['assessment']='partial'
  u['unresolved'].append(weak[slug])
  for e in u['assessmentEvidence']:e.update(relation='candidate',semanticReviewed=False,reviewNote='Self-review rejected direct closure: '+weak[slug])
  if slug in ['cost-unit-reduction','above-below-plan','labor-cost','material-cost','energy-cost']:
   u['after']['teaching']='partial'
   for e in u['teachingEvidence']:e.update(relation='candidate',semanticReviewed=False,reviewNote='Self-review rejected direct closure: '+weak[slug])
  definitions={'labor-cost':'作業者へ賃金として支払う費用。','material-cost':'原材料を購入する費用。','energy-cost':'水・電気・石油・ガスなど設備に使う動力資源の費用。'}
  if slug in definitions:u['conditionsJa'].append(definitions[slug])

LEGACY_JA={
'qc1':[
'図を使って関係者に状況を伝える。','棒グラフの項目軸・値軸・棒の長さを対応させる。','棒の項目順はパレート図と同じ制約ではない。','棒の値から項目間の大小を比較する。','時系列の横軸と値の縦軸から変化を読む。','時系列の順番と軸の単位を確認する。','円全体に対する構成比と角度を対応させる。','構成比と角度の単位を区別して計算する。','円の各部分の比率・角度を独立した例で読む。','同じ長さの帯で構成の違いを比べる。','全体量が違うとき比率と数量を混同しない。','レーダーの各軸に特性を対応させる。','同じ尺度の軸別比較と面積だけの順位を区別する。','パレートの件数と累積比の異なる軸を読む。','頻度・影響を踏まえて改善の優先順位を考える。','共通の分母で累積比を計算する。','同じ対象の二変数を対にして関係を調べる。','直線以外の関係と因果の未確定を区別する。','同方向の散布傾向を識別する。','逆方向の散布傾向を識別する。','明確な規則が見えない散布を識別する。','曲線関係を無相関と決め付けない。','階級と度数で分布を調べる。','平方根による階級数の目安を固定規則にしない。','狭すぎる階級が山の把握を妨げる場合を考える。','広すぎる階級が差を隠す場合を考える。','分布の中心・広がりと原因の断定を区別する。','一般的な分布形状だけで工程安定を保証しない。','平均の違う集団の混在を層別で調べる。','多集団の混在による平らな形状を検討する。','歯抜け状では階級や測定処理も調べる。','片側に偏る管理が分布へ与える影響を調べる。','選別後データの切断を元の集団と区別する。','離れた集団の混在を分けて調べる。','離れた分布では測定方法の誤りも確認する。'],
'qc2':['測定の刻みと階級幅を対応させる。','境界の桁と測定値の所属を確認する。','図に付いた五つの線名を区別する。','管理図のUCL・CL・LCLを区別する。','規格線と管理線の役割を分ける。','図の配置を職場共通の数値基準にしない。','結果と要因の枝関係を読む。','同じ要因名でも工程の違いを確認する。','工程ごとの仮説を現物と記録で確かめる。']}

# Historical 44 atomic rows are provenance candidates until exact regions are read.
for rel,key in [('food-manufacturing/atomic-qc-20261102/matrix.json','atoms'),('food-manufacturing/atomic-qc-next-20261102/matrix46-48.json','records')]:
 path=R/'docs/ssw-workspace'/rel;d=read(path)
 rows=d.get(key,d.get('records',d.get('units',[])))
 for i,row in enumerate(rows):
  kid='food-v2-legacy-'+('qc1-' if key=='atoms' else 'qc2-')+str(i+1).zfill(3)
  refs=row.get('sourceRefs',[])
  if not refs:refs=row.get('source',{}).get('refs',[])
  norm=[]
  for ref in refs:
   doc=ref.get('document',ref.get('documentId',ref.get('sourceId','ssw2')));page=ref.get('pdfPage')
   if page:norm.append({'sourceId':'food-1' if doc=='ssw1' else 'food-2','pdfPage':page,'elementIds':[]})
  if not norm:
   # Per-row page metadata is explicit in the historical ledger; no range guessing.
   page=row.get('pdfPage',row.get('sourcePdfPage'))
   if page:norm=[{'sourceId':'food-2','pdfPage':page,'elementIds':[]}]
  if not norm:raise ValueError(('No historical exact page',rel,i,list(row)))
  units.append({'knowledgeId':kid,'sourceRefs':norm,'statementJa':LEGACY_JA['qc1' if key=='atoms' else 'qc2'][i],'statementVi':row.get('knowledgeVi'),'conditionsJa':[],'exceptionsJa':[],'importance':'supporting','classification':'knowledge',
    'before':{'teaching':'unknown','assessment':'unknown'},'after':{'teaching':'partial','assessment':'unknown'},'teachingEvidence':[],'assessmentEvidence':[],'imageEvidence':[],
    'assessmentRequirement':'required','assessmentExemptionReason':None,'expressionReview':{'status':'pending','note':'Inherited facts must be checked in their exact source regions, not upgraded from a previous count.'},
    'status':'candidate','legacyRefs':[{'path':'docs/ssw-workspace/'+rel,'rowId':row.get('id',row.get('atomId')),'index':i}],
    'unresolved':['Historical page-level row is preserved as provenance; exact element assignment and direct evidence are not yet re-established.'],
    'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}})

# Current independently checked remediation; no shared validator mutation.
exec(compile((R/'scripts/food-manufacturing/apply-source51-54-ledger.py').read_text(),'apply-source51-54-ledger.py','exec'))

# Only the visually read chapter divider is excluded; all its extracted objects
# are individually assigned a reason, not discarded by short-text heuristics.
for e in regions['ssw2']['pages'][93]['elements']:
 e['classification']='decorative' if e['kind']=='vector' else 'navigation'
 e['reason']='Self-read PDF94 contains only the chapter4 divider/title and publication footer; no additional instructional claim.'

sources=[];pages=[]
for key,doc in regions.items():
 path=O/f'food-{key}-regions.json.gz';path.write_bytes(gzip.compress((json.dumps(doc,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0));filehash=sha(path.read_bytes());sid=doc['sourceId']
 sources.append({'sourceId':sid,'sha256':doc['sourceSha256'],'pdfPages':doc['pdfPages'],'aliases':[key], 'byteVerified':True,'verificationRef':RECEIPT})
 for p in doc['pages']:
  n=p['pdfPage'];reviewed=key=='ssw2' and 92<=n<=102
  ids=[u['knowledgeId'] for u in units if any(r['sourceId']==sid and r['pdfPage']==n for r in u['sourceRefs'])]
  pages.append({'sourceId':sid,'pdfPage':n,'disposition':'navigation' if key=='ssw2' and n==94 else ('instructional' if reviewed else 'unclassified'),
    'exclusionReason':'Chapter divider/title and publication footer only; checked as text and page image.' if key=='ssw2' and n==94 else None,
    'regionCensus':{'artifactPath':str(path.relative_to(R)),'sha256':filehash,'elementCount':len(p['elements']),'status':'visually_reviewed' if reviewed else 'extracted','visualReviewRef':BATCH_RECEIPT if reviewed and n in [93,99,101,102] else (RECEIPT if reviewed else None)},
    'semanticInventory':{'status':'excluded' if key=='ssw2' and n==94 else ('complete_ai' if key=='ssw2' and n in [93,99,101] else ('partial' if ids else 'pending')),'reviewRef':BATCH_RECEIPT if reviewed and n in [93,99,101,102] else (RECEIPT if reviewed else None)},'knowledgeIds':ids})
ledger={'schemaVersion':2,'sector':'food','baselineCommit':BASE,'sources':sources,'pages':pages,'knowledgeUnits':units,
 'denominator':{'status':'open','reviewNote':'251 pages and every extracted PDF object are inventoried, but semantic enumeration remains partial. Geometric elements and imported historical rows are not unique knowledge or an acceptance denominator.'},
 'wholeSourceKnowledgeCovered':False,'review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False},
 'unresolved':['All pages outside the explicitly self-read scope still need source-first semantic inventory.','Exact original cell/table/formula/caption roles are pending unless explicitly assigned; vector paths and glyph blocks are not knowledge.','Imported historical44 rows require exact source-region assignment and current direct evidence.','Reverse audit of every app claim, terminology/audio/native/device and measured-duration work remains open.']}
(O/'food.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'status':'BUILT_OPEN_CANONICAL_LEDGER','pages':len(pages),'regions':sum(p['regionCensus']['elementCount'] for p in pages),'units':len(units),'covered':sum(u['status']=='covered_ai' for u in units),'wholeSourceKnowledgeCovered':False}))
