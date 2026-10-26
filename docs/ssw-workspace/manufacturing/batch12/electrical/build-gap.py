import json,hashlib,random
from pathlib import Path
P=Path(__file__).resolve().parent;R=P.parents[4]
def stable(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,separators=(',',':'))
def sha(x):return hashlib.sha256(stable(x).encode()).hexdigest()
rows=json.loads((P/'gap-author-text.json').read_text());matrix=json.loads((R/'docs/ssw-workspace/manufacturing/knowledge-matrix.json').read_text())['knowledge'];matrix=[m for m in matrix if m['sourceId']=='mfg1-electrical-source']
lessons=[]
for row in rows:
 sources=[{'documentId':'mfg1-electrical-source','pdfPage':n,'printedPage':n-9} for n in row['pages']]
 ids=[m['id'] for m in matrix if any(m['pdfPageStart']<=n<=m.get('pdfPageEnd',m['pdfPageStart']) for n in row['pages'])]
 term,reading,meaning=row['term']
 l={'id':f"mfg1-electrical-l{row['n']:03d}",'specialty':'electrical','titleJa':row['title'],'objectiveJa':row['objective'],'paragraphs':[{'id':f'section-{i}','titleJa':t,'textJa':s} for i,(t,s) in enumerate(row['p'],1)],'terms':[{'ja':term,'reading':reading,'meaningJa':meaning}],'activityJa':'30分の学習目安：本文理解10分、事例整理8分、記述9分、振り返り3分。\n'+row['activity'],'safetyJa':['設備の操作、測定、加工や設定変更は、資格・教育・担当範囲と承認された手順を確認する。'],'summaryJa':row['title']+'では、名称だけでなく構造・用途・適用条件を照合する。','sources':sources,'estimatedMinutes':30,'durationBasis':'target_with_activities_not_measured','knowledgeIds':ids,'reviewStatus':'ai_authored_draft_independent_review_pending'}
 l['sourceHash']=sha(l);lessons.append(l)
ls={int(l['id'][-3:]):l for l in lessons};bank=[]
for row in (P/'gap-question-bank.txt').read_text().splitlines():
 fields=row.split('|');assert len(fields)==10,len(fields)
 n=int(fields[0]);stem=fields[1];options=fields[2:6];reasons=fields[6:10];bank.append((n,stem,options,reasons))
assert len(bank)==24
checks=[];weeks=[];mapping=[]
for wn in [13,14]:
 sub=bank[(wn-13)*12:(wn-12)*12];qs=[]
 for i,(n,stem,options,reasons) in enumerate(sub,1):
  l=ls[n];original=(i-1)%4;c=([2,0,3,1,1,3,0,2,3,1,2,0] if wn==13 else [1,3,0,2,0,1,2,3,2,0,3,1])[i-1]
  correctpair=(options[original],reasons[original]);wrongpairs=[(o,r) for j,(o,r) in enumerate(zip(options,reasons)) if j!=original];random.Random(wn*100+i).shuffle(wrongpairs);wrongpairs.insert(c,correctpair);options=[x[0] for x in wrongpairs];reasons=[x[1] for x in wrongpairs]
  q={'id':f'mfg1-electrical-weekly-{wn:02d}-q{i:02d}','lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'knowledgeIds':l['knowledgeIds'],'stemJa':stem,'optionsJa':options,'correctIndex':c,'optionReasonsJa':reasons,'sources':l['sources'],'reviewStatus':'ai_authored_draft_independent_review_pending'};q['sourceHash']=sha(q);qs.append(q)
 e={'id':f'mfg1-electrical-weekly-{wn:02d}','titleJa':f'第{wn}週の確認','kind':'weekly','officialSimulation':False,'timeLimitMinutes':None,'weekId':f'mfg1-electrical-week-{wn:02d}','questions':qs};e['revision']='v1-'+sha(qs)[:16];checks.append(e)
 weeks.append({'id':e['weekId'],'number':wn,'titleJa':'図表と作業条件の補充' if wn==13 else '原理と工程の補充','lessonIds':[l['id'] for l in lessons[(wn-13)*7:(wn-12)*7]],'status':'authored_curriculum_draft'})
for l in lessons:
 for kid in l['knowledgeIds']:mapping.append({'knowledgeId':kid,'lessonId':l['id'],'scope':'supplement_detail_draft_not_exhaustive_atom_certification','questionIds':[q['id'] for e in checks for q in e['questions'] if q['lessonId']==l['id']]})
assert all(any(q['lessonId']==l['id'] for e in checks for q in e['questions']) for l in lessons)
result={'specialty':'electrical','baseline':'d644f639','lessons':lessons,'checks':checks,'weeks':weeks,'knowledgeMappings':mapping,'status':'supplement_draft_independent_review_pending','newLessonCount':14,'newQuestionCount':24,'fullSourceAtomizationCertified':False,'curriculumCoveredAllSourceKnowledge':False,'frozenNewContentSha256':hashlib.sha256((P/'new-content.json').read_bytes()).hexdigest(),'mockCandidateSha256':hashlib.sha256((P/'mocks.json').read_bytes()).hexdigest(),'externalClarifications':[{'lessonId':'mfg1-electrical-l092','scope':'penetration vs NLGI grade direction; distinction avoids applying source159 text to every grade number','primaryManufacturerUrl':'https://www.eneos.co.jp/binran/part02/chapter03/section03.html','verifiedDate':'2026-10-26'}]}
(P/'gap-content.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print({'lessons':len(lessons),'questions':24,'sha256':hashlib.sha256((P/'gap-content.json').read_bytes()).hexdigest()})
