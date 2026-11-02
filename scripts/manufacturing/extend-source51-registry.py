#!/usr/bin/env python3
"""Bind three previously authored calculation groups to the canonical source ledger.
No question is generated; every existing item is reread and matched to its actual tested operation.
"""
import gzip,hashlib,json,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/source-coverage-v2';REF='docs/ssw-workspace/source-coverage-v2/manufacturing-source51-review.json'
def main():
 ledger=json.loads((D/'manufacturing.json').read_text());ledger['knowledgeUnits']=[u for u in ledger['knowledgeUnits'] if not u['knowledgeId'].startswith('mfg51-')]
 groups=[('density','mechanical',123,.768,.88,[
 ('均質な紙上材料では、材料のない空洞を外形領域から引いて密度に対応する材料体積を求める。',['材料のない空洞で、他の材料を含まないと明示する。'],['外形領域の体積を、そのまま材料体積としない。']),
 ('密度と材料体積の積から、同じ単位系で紙上質量を計算する。',['密度をg/cm³、材料体積をcm³、質量をgとして対応させる。'],['仮想密度を実在材質の認定値としない。']),
 ('同じ材料体積の紙上モデルで、密度だけを変えた質量を比較する。',['均質材料、外形と空洞が固定されている。'],['強度や温度条件を無視した実部品の材質変更を許可しない。']),
 ('既知の密度と質量から材料体積を求め、外形領域との差として空洞を逆算する。',['均質材料のみで、空洞は材料を含まない。'],['密度以外の材質、欠陥、健全性を認定しない。'])]),
 ('resistivity','electrical',127,.20,.36,[
 ('抵抗計算の面積をmm²からm²へ直すとき、長さ換算係数も二乗する。',['1mm²=(10⁻³m)²=10⁻⁶m²。'],['直径を面積の欄へ代入しない。']),
 ('均一線のR=ρℓ/Sに、抵抗率・長さ・面積のSI単位を合わせて抵抗を求める。',['ρはΩ·m、ℓはm、Sはm²、RはΩ。紙上モデルの指定条件。'],['測定、配線、実機接続を指示する式ではない。']),
 ('材質と温度が同じ均一線では、長さと断面積が同じ比で増えると抵抗は変わらない。',['同じ抵抗率、無視すると指定した接触抵抗以外の影響を加えない。'],['材質、温度、接続条件が変わる実物に比だけを流用しない。']),
 ('同材質・同温度の円形断面線で、抵抗の比を長さ比と直径比の二乗から求める。',['円形断面に限って面積比=(直径比)²を使う。'],['長さだけ、または直径だけの比を抵抗比としない。'])]),
 ('faraday','surface',118,.608,.882,[
 ('指定された紙上電析モデルm=kItηで、分を秒、効率の百分率を割合へ直して質量を求める。',['kの指定単位はmg/C、IはA、tはs、ηは割合。架空の数値。'],['実在元素や実際の浴の操作条件を指定しない。']),
 ('同じ紙上電析モデルで、実際の析出質量と理論量の比から電流効率を逆算する。',['η=m/(kIt)。k・I・tが既知かつモデル内で一定。'],['副反応を無視して効率を常に100%としない。']),
 ('固定したk・I・ηの紙上電析モデルで、目標質量から時間を逆算する。',['t=m/(kIη)、ηは割合でkの単位に合わせる。'],['実工程の電流や時間の勝手な変更を許可しない。']),
 ('k・I・t・ηを固定した紙上モデルでは、面積だけを変えても総析出質量は変わらない。',['総質量のモデルと面積当たり・局所の分布を区別する。'],['局所膜厚、均一性、品質の保証ではない。実工程でηの固定を決めつけない。'])])]
 receipts=[]
 for key,spec,n,y1,y2,rows in groups:
  ap=f'docs/ssw-workspace/source-coverage-v2/manufacturing-{spec}-regions.json.gz';art=json.loads(gzip.decompress((R/ap).read_bytes()));page=next(p for p in art['pages'] if p['pdfPage']==n);sid=art['sourceId'];cp=f'src/data/manufacturing/calculation48/{key}.json';content=json.loads((R/cp).read_text());ids=[]
  def evidence(ptr,note):return {'path':cp,'jsonPointer':ptr,'sha256':'0'*64,'sha256Mode':'json-value','relation':'direct','semanticReviewed':True,'reviewNote':note}
  for i,(statement,conditions,exceptions) in enumerate(rows):
   uid=f'mfg51-{key}-{i+1:02}';ids.append(uid);els=[e['elementId'] for e in page['elements'] if e['kind']=='text' and .11<=(e['bbox'][0]+e['bbox'][2])/2<=.91 and y1<=(e['bbox'][1]+e['bbox'][3])/2<=y2]
   assert els
   unit={'knowledgeId':uid,'sourceRefs':[{'sourceId':sid,'pdfPage':n,'elementIds':els,'sourceLocator':'Visually reread entire page. Bounded base definition/formula is combined with explicitly marked independent mathematical derivation and fictional app inputs; not a copied source exercise.'}],'statementJa':statement,'conditionsJa':conditions,'exceptionsJa':exceptions,'importance':'core','classification':'knowledge','before':{'teaching':'unknown','assessment':'unknown'},'after':{'teaching':'present','assessment':'present'},'teachingEvidence':[evidence('/lessonPatch/wording/ja/after','Actual guarded scheduled Reader paragraph explicitly teaches this operation with fictional numerical inputs and preserved conditions.')],'assessmentEvidence':[evidence(f'/questions/{i}',f'Self-read full stem, all options, keyed answer and all reasons of {content["questions"][i]["id"]}. This item directly requires the stated operation; no broader source-page competence inferred.')],'imageEvidence':[],'assessmentRequirement':'required','assessmentExemptionReason':None,'expressionReview':{'status':'independent_ai_checked','note':'Original conditional paper models and distinct numerical distractors. General formulas/definitions only; source exercise, diagram, page and layout are not reproduced.'},'sourceReview':{'status':'self_checked_ai','conditionsChecked':True,'reviewRef':REF},'status':'covered_ai','unresolved':[],'derivationScope':'Base source knowledge plus explicit elementary mathematical derivation; no claim that the source printed these fictional worked examples.','review':{'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}}
   ledger['knowledgeUnits'].append(unit)
   for e in page['elements']:
    if e['elementId'] in els:e.update(classification='knowledge',knowledgeIds=sorted(set(e.get('knowledgeIds',[])+[uid])),reason=None)
  (R/ap).write_bytes(gzip.compress((json.dumps(art,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0));h=hashlib.sha256((R/ap).read_bytes()).hexdigest()
  for p in ledger['pages']:
   if p['sourceId']==sid:
    p['regionCensus']['sha256']=h
    if p['pdfPage']==n:p['knowledgeIds']=sorted(set(p['knowledgeIds']+ids));p['disposition']='instructional';p['semanticInventory']={'status':'partial','reviewRef':REF};p['regionCensus'].update(status='visually_reviewed',visualReviewRef=REF)
  receipts.append({'group':key,'sourceId':sid,'pdfPage':n,'knowledgeIds':ids,'questionsReread':[q['id'] for q in content['questions']],'teachingRuntime':'Existing guarded scheduled paragraph; Japanese+12 targets retained, exact lesson source hash and before-text checked by calculation48 gates.','allSourcePageIdeasInventoried':False})
 # Full page121 viewed as a boundary check: it concerns local distribution; never equate total mass with uniform local thickness.
 p=next(p for p in ledger['pages'] if p['sourceId']=='mfg1-surface-source' and p['pdfPage']==121);p['regionCensus'].update(status='visually_reviewed',visualReviewRef=REF);p['semanticInventory']={'status':'pending','reviewRef':None}
 ledger['source51']={'groups':3,'preciselyMappedExistingCalculationQuestions':12,'newQuestions':0,'allSourcePagesClosed':False};(D/'manufacturing.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
 subprocess.run(['node','-e',"const f=require('fs'),c=require('crypto'),p=process.argv[1],d=JSON.parse(f.readFileSync(p));for(const u of d.knowledgeUnits)if(u.knowledgeId.startsWith('mfg51-'))for(const e of [...u.teachingEvidence,...u.assessmentEvidence]){let v=JSON.parse(f.readFileSync(e.path));for(const k of e.jsonPointer.slice(1).split('/'))v=v[k];e.sha256=c.createHash('sha256').update(JSON.stringify(v)).digest('hex');}f.writeFileSync(p,JSON.stringify(d,null,2)+'\\n');",str(D/'manufacturing.json')],cwd=R,check=True)
 report={'status':'SELF_CHECKED_AI_BOUNDED_MODEL_MAPPING_NOT_WHOLE_PAGE_ACCEPTANCE','groups':receipts,'additionalBoundaryPageViewed':{'sourceId':'mfg1-surface-source','pdfPage':121,'scope':'Read full caption, geometry, local-deposition-rate box and electric-field box. These remain pending individual source→app inventory; no complete page claim.'},'independentArithmeticChecks':{'densityMaterialVolume':24-4,'densityMass':2.5*(24-4),'densityMassDoubled':5*(24-4),'inverseCavity':24-45/2.5,'areaSI':.5*1e-6,'resistance':3e-8*10/(.5e-6),'resistanceBothDouble':3e-8*20/1e-6,'resistanceDiameterDouble':.6*2/4,'faradayMass':.2*1*300*.75,'inverseEfficiency':36/(.2*1*300),'inverseTime':90/(.2*1*.75),'massWithAreaDouble':.2*1*300*.75},'sourceQualifications':['Electrical127 raster really prints S[m²]; superscript loss in extraction is not a source error.','Mechanical123 contains broad rust/stainless claims outside these density units; they remain unresolved pending qualified source reconciliation, not silently republished.','Surface118 includes electrode half-reactions/anodizing and121 includes local distribution/image labels; these are outside this bounded model closure.'],'translationSemanticReReview':'Existing calculation48 translations retained; no new translation accepted merely from ledger mapping.','whole574Closed':False,'nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False}
 (D/'manufacturing-source51-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'groups':3,'newCanonicalUnits':12,'newQuestions':0,'exactExistingQuestionEvidence':12,'wholeSourcePageClosures':0}))
if __name__=='__main__':main()
