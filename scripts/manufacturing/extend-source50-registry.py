#!/usr/bin/env python3
"""Apply visually self-reviewed overview dispositions. Geometry locates; it never decides meaning."""
import gzip,hashlib,json,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/source-coverage-v2';REF='docs/ssw-workspace/source-coverage-v2/manufacturing-source50-review.json';AP='docs/ssw-workspace/source-coverage-v2/manufacturing-electrical-regions.json.gz';CONTENT='src/data/manufacturing/source50-overview.json'
def main():
 ledger=json.loads((D/'manufacturing.json').read_text());artifact=json.loads(gzip.decompress((R/AP).read_bytes()));sid=next(s['sourceId'] for s in ledger['sources'] if 'electrical' in s['sourceId']);patch=json.loads((R/CONTENT).read_text());
 # Full pages10/11/12 read visually, including header, ruby, tables, continuation box, footer and icons.
 # These area assignments are authored AFTER source inspection and crosschecking the claim, not an automated semantic classifier.
 bounds={
 'exam-purpose':(10,.197,.279,0),'exam-level':(10,.385,.473,0),'exam-cbt':(10,.473,.507,0),
 'exam-theory-count':(10,.507,.594,0),'exam-practical-count':(10,.507,.594,0),
 'exam-theory-time':(10,.594,.648,0),'exam-practical-time':(10,.594,.648,0),
 'exam-theory-threshold':(10,.648,.705,0),'exam-practical-threshold':(10,.648,.705,0),
 'exam-language':(10,.705,.744,0),'exam-eligibility':(10,.744,.839,0),
 'exam-job-table':(11,.167,.385,1),'exam-no-sharing':(11,.465,.635,2),'exam-monitoring':(11,.653,.751,2),
 'exam-invalidated':(11,.782,.853,2),'exam-disqualification':(12,.118,.145,2),'exam-report':(12,.147,.175,2),
 'study-japanese':(12,.23,.378,2),'study-ask':(12,.398,.518,2),'study-repeat':(12,.54,.656,2),'study-end':(12,.672,.799,2)}
 byid={u['knowledgeId']:u for u in ledger['knowledgeUnits']};pages={p['pdfPage']:p for p in artifact['pages']};reviewed=[]
 def ev(index,note):return {'path':CONTENT,'jsonPointer':f'/paragraphs/{index}/wording/ja/after','sha256':'0'*64,'sha256Mode':'json-value','relation':'direct','semanticReviewed':True,'reviewNote':note}
 for suffix,(n,y1,y2,i) in bounds.items():
  uid='mfg47-electrical-'+suffix;u=byid[uid];els=[e['elementId'] for e in pages[n]['elements'] if e['kind']=='text' and .11<=(e['bbox'][0]+e['bbox'][2])/2<=.91 and y1<=(e['bbox'][1]+e['bbox'][3])/2<=y2]
  assert els,(suffix,n)
  u['sourceRefs']=[{'sourceId':sid,'pdfPage':n,'elementIds':els,'sourceLocator':f'PDF{n}, printed{n-9}; visually read full page, manually matched claim-bearing body/ruby area.'}]
  u.setdefault('beforeSource50',u['after'].copy());u['after']={'teaching':'present','assessment':'unknown'};u['teachingEvidence']=[ev(i,'The guarded current reader retains the original paragraph and adds the specifically reviewed source fact/condition. Historical date is explicit; no current eligibility/sanction claim.')]
  u['assessmentRequirement']='not_required';u['assessmentExemptionReason']='Historical exam administration or study-orientation reference, not an occupational competence claim. Do not turn historical eligibility, sanctions, job-list membership or study advice into a scored vocational proficiency test. Existing lesson043 application activity remains available; no assessment proficiency is inferred.'
  u['assessmentEvidence']=[];u['importance']='reference';u['classification']='knowledge';u['status']='covered_ai';u['unresolved']=[];u['conditionsJa']=['2026年7月のアップロード資料の記載。現在の申込資格や個別処分を断定しない。'];u['exceptionsJa']=['試験区分への掲載だけで実設備の操作許可とはしない。'];u['expressionReview']={'status':'independent_ai_checked','note':'New reference additions structured as learner orientation with historical scope; no source page, original table layout, exam question or icon republished.'};u['sourceReview']={'status':'self_checked_ai','conditionsChecked':True,'reviewRef':REF};reviewed.append(uid)
 # Replace the coarse job-list tracking row with independently auditable membership claims.
 parent=byid['mfg47-electrical-exam-job-table'];parent['classification']='excluded';parent['status']='excluded';parent['dispositionReason']='Superseded coarse tracking container. Its individual work-membership claims are represented below and must not be added to this parent as extra knowledge.'
 jobs=['普通旋盤','フライス盤','数値制御旋盤','マシニングセンタ','治工具仕上げ','金型仕上げ','機械組立仕上げ','機械検査','機械系保全','電子機器組立て','回転電機組立て','変圧器組立て','配電盤・制御盤組立て','開閉制御器具組立て','回転電機巻線製作','プリント配線板設計','プリント配線板製造','圧縮成形','射出成形','インフレーション成形','ブロー成形','工業包装','手積み積層成形','ビーズ法発泡スチロール成形','プラスチック成形材料製造','フィルム加工','ドライラミネート','押出ラミネート','スリット','製袋','フラットヤーン']
 ledger['knowledgeUnits']=[u for u in ledger['knowledgeUnits'] if not u['knowledgeId'].startswith('mfg50-electrical-job-')]
 for j,name in enumerate(jobs):
  u=json.loads(json.dumps(parent));uid=f'mfg50-electrical-job-{j+1:02}';u.update(knowledgeId=uid,statementJa=f'資料の電気電子機器組立て区分の対応業務に{name}が載る。'+('フィルム加工の内訳として読む。' if j>=26 else ''),classification='knowledge',status='covered_ai',legacyRefs=[{'path':'docs/ssw-workspace/manufacturing/session-20261102/atomic47/electrical-atoms.json','locator':'mfg47-electrical-exam-job-table; container superseded, not counted as another competency.'}]);u.pop('dispositionReason',None);u.pop('legacyStatementJa',None);u['before']={'teaching':'unknown','assessment':'unknown'};u['teachingEvidence']=[ev(1,f'Current reader explicitly includes {name} under the historical correspondence table; list membership is not authorization.')];ledger['knowledgeUnits'].append(u);reviewed.append(uid)
 # Assign exact reciprocal element links. Headers/page labels are navigation; icons merely reinforce text.
 for n in [10,11,12]:
  current=[u for u in ledger['knowledgeUnits'] if any(r['sourceId']==sid and r['pdfPage']==n for r in u['sourceRefs'])]
  for e in pages[n]['elements']:
   e['knowledgeIds']=[u['knowledgeId'] for u in current if any(e['elementId'] in r['elementIds'] for r in u['sourceRefs'])]
   if e['knowledgeIds']:e.update(classification='knowledge',reason=None)
   elif e['kind']=='text':e.update(classification='navigation',reason='Visually checked running header/footer, page numeral, chapter/section/table label or spacing-only block. No extra factual row, warning or footnote is excluded here.')
   else:e.update(classification='decorative',reason='Visually checked book/paper/camera/shield/warning icons, page ornament and table/box border vector group. Reinforces the fully recorded adjoining text; no unlabeled technical component, extra data or operational arrow.')
  p=next(p for p in ledger['pages'] if p['sourceId']==sid and p['pdfPage']==n);p.update(disposition='instructional',exclusionReason=None,knowledgeIds=[u['knowledgeId'] for u in current]);p['semanticInventory']={'status':'complete_ai','reviewRef':REF};p['regionCensus'].update(status='visually_reviewed',visualReviewRef=REF)
 (R/AP).write_bytes(gzip.compress((json.dumps(artifact,ensure_ascii=False,separators=(',',':'))+'\n').encode(),mtime=0))
 h=hashlib.sha256((R/AP).read_bytes()).hexdigest()
 for p in ledger['pages']:
  if p['sourceId']==sid:p['regionCensus']['sha256']=h
 ledger['source50']={'groups':3,'fullPageInventories':[10,11,12],'historical33InstructionalPagesClosedAi':True,'coarseParentExcluded':'mfg47-electrical-exam-job-table','newJobMembershipClaims':len(jobs),'assessmentExemptions':'Historical administration and learning orientation only; no practical task competence inferred.'}
 (D/'manufacturing.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
 # Node serialization is authoritative for current app evidence.
 subprocess.run(['node','-e',"const f=require('fs'),c=require('crypto'),p=process.argv[1],d=JSON.parse(f.readFileSync(p));for(const u of d.knowledgeUnits)for(const e of u.teachingEvidence)if(e.path==='src/data/manufacturing/source50-overview.json'){let v=JSON.parse(f.readFileSync(e.path));for(const k of e.jsonPointer.slice(1).split('/'))v=v[k];e.sha256=c.createHash('sha256').update(JSON.stringify(v)).digest('hex');}f.writeFileSync(p,JSON.stringify(d,null,2)+'\\n');",str(D/'manufacturing.json')],cwd=R,check=True)
 review={'status':'SELF_CHECKED_AI_NOT_DOMAIN_NATIVE_OR_DEVICE_ACCEPTANCE','sourceId':sid,'sourcePdfSha256':next(s['sha256'] for s in ledger['sources'] if s['sourceId']==sid),'groups':[{'pdfPage':10,'printedPage':1,'examTable':'All7row labels, both categories for count/time/pass rate, skill level purpose, CBT, Japanese ruby, nationality/age/intention conditions.'},{'pdfPage':11,'printedPage':2,'workTable':'All26 top-level work entries plus5 film subtypes;31 membership claims, coarse parent excluded.','examConduct':'Partial-information restriction, private/public SNS, camera/invigilator, invalidation.'},{'pdfPage':12,'printedPage':3,'continuationBox':'Future examination disqualification and Immigration Services Agency reporting are examples in the historical source, not predictions.','study':'Japanese comprehension, asking supervisor/colleague, repeated reading toward timed judgement, sentence-ending/negation.'}],'visualMethod':'Full original page PNGs compared by author, including ALL ruby/caption/small-font regions; no font-based filtering. Original pages remain private. Region coordinates locate reviewed facts; they never determine meaning.','jobMembershipClaims':jobs,'knowledgeIds':reviewed,'beforeScope':'Reviewed actual Japanese lesson043 and effective12-target paragraphs; existing question/guide corpora searched for overlaps. No whole-bank absence claim.','translationStatus':'Japanese+12directly authored targets, exact effective-before/Japanese revision guards; self-checked, not native reviewed.','sourceExpressionReview':'Learner-oriented regrouping and independent exposition; factual work names retained. No original table layout, page, icons, source examples or questions reproduced.','newQuestions':0,'exemptionScope':'Reference/administrative/study orientation only; no vocational competency, practical skill or current administrative legal advice certified.','whole574SourceClosed':False,'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False,'learnerDurationMeasured':False}
 (D/'manufacturing-source50-review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'groups':3,'pagesSemanticallyInventoried':3,'jobMembershipChildren':len(jobs),'activeRegistryUnits':len(ledger['knowledgeUnits']),'source50CoveredReferenceUnits':len(reviewed)-1,'coarseContainerExcluded':1}))
if __name__=='__main__':main()
