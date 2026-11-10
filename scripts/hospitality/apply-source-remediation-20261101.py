"""One-time source-backed remediation; refuses duplicate application."""
from pathlib import Path
import json,re,copy,subprocess,hashlib,datetime,sys
import fitz
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/ssw-workspace/hospitality';DATA=ROOT/'src/data/hospitality'
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
planfile=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).with_name('source-remediation-20261101.json')
plan=read(planfile)
atoms=read(DOC/'source-atoms-authoring.json');fragments=read(DOC/'source-fragments-authoring.json')
baseline=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
evidence_path=DOC/(planfile.stem+'-evidence.json')
assert not evidence_path.exists(),'Already applied'
if plan['additions']:assert not any(a['atomId']==plan['additions'][0]['atomId'] for a in atoms['atoms']),'Already applied'
groups={g:read(DATA/(g+'.json')) for g in ['front','planning','service','restaurant','safety']}
lessons={l['id']:l for d in groups.values() for l in d['lessons']};before=copy.deepcopy(lessons)
changed=set();newquestions=[];newatoms=[]
backup=ROOT.parent/(planfile.stem+'-before');backup.mkdir(exist_ok=True)
for g,d in groups.items():
 p=DATA/(g+'.json');(backup/(g+'.json')).write_bytes(p.read_bytes())
write(backup/'hashes.json',{g:hashlib.sha256((DATA/(g+'.json')).read_bytes()).hexdigest() for g in groups})
def question(l,parts,knowledge):
 n=max(int(re.search(r'q(\d+)$',q['id']).group(1)) for q in l['questions'])+1
 q={'id':l['id']+f'-q{n:02d}','prompt':parts[0],'choices':parts[1],'answerIndex':parts[2],'explanation':parts[3],'knowledgeIds':knowledge}
 assert len(set(q['choices']))==4;l['questions'].append(q);newquestions.append(q['id']);return q
def refs(item):
 result=[]
 for n,page in [(item['source'],item['page'])]+([(item['alsoSource'],item['alsoPage'])] if item.get('alsoSource') else []):
  fp=next(p for p in fragments['pages'] if p['sourceId']==f'hotel-{n}' and p['pdfPage']==page)
  pdf=fitz.open(ROOT.parent/'sources'/f'khach_san_{n}_jp.pdf')
  native=[b for b in pdf[page-1].get_text('dict')['blocks'] if b.get('type')==0 and ''.join(s['text'] for l in b.get('lines',[]) for s in l['spans']).strip()]
  anchor=item['anchor'];matches=[]
  for index,b in enumerate(native):
   text=''.join(s['text'] for line in b['lines'] for s in line['spans'])
   if re.sub(r'\s','',anchor) in re.sub(r'\s','',text):matches.append(fp['blocks'][index])
  assert matches,(item['atomId'],n,page,anchor)
  for block in matches:
   block.setdefault('boundAtomIds',[]).append(item['atomId'])
  result.append({'sourceId':f'hotel-{n}','pdfPage':page,'sourceSha256':fp['sourceSha256'],'locator':anchor,'sourceBlockAnchors':[{'fragmentId':b['id'],'blockSha256':b['sha256'],'bbox':b['bbox']} for b in matches]})
 return result
for item in plan['additions']:
 l=lessons[item['lesson']];section=next(s for s in l['sections'] if s['id']==item['section']);changed.add(l['id'])
 if item.get('append'):section['body']+='\n\n'+item['append']
 evidence=item.get('append') or next(i['append'] for i in plan['additions'] if i['atomId']==item['reuseAppend'])
 kid='hotel-source-detail-'+item['atomId'].lower();l['knowledgeIds'].append(kid)
 q=question(l,item['question'],[kid]);sourceRefs=refs(item)
 a={'atomId':item['atomId'],'sourceSummaryJa':item['summary'],'sourceRefs':sourceRefs,'before':{'baselineCommit':baseline,'lessonRevision':before[l['id']]['revision'],'teachingStatus':'partially_taught' if item['atomId'] in ['HF1-012-05','HR2-052-04'] else 'missing_explicit_detail','assessmentStatus':'no_direct_question_for_this_detail'},'after':{'teachingStatus':'taught_ai_checked','evidence':{'lessonId':l['id'],'sectionId':section['id'],'quote':evidence},'assessmentStatus':'direct_ai_checked','questionIds':[q['id']],'assessmentFocus':item['summary'],'questionEvidence':[{'questionId':q['id'],'prompt':q['prompt'],'correctChoice':q['choices'][q['answerIndex']]}],'imageBinding':{'lessonImageId':l['illustration']['id'],'relevanceForThisAtomReviewed':False},'reviewedLessonRevision':'pending_build'},'review':{'sourceSemanticCheckedBy':'AI','nativeReviewed':False,'domainReviewed':False},'currentRuleDisposition':'source2024_scope_retained_not_universal_guarantee' if item['source']==2 and item['page']==52 else 'conditions_explicit_no_new_universal_claim'}
 newatoms.append(a)
 g=l['id'].split('-')[1];p=DOC/(g+'-ledger.json');ledger=read(p);rows=ledger if isinstance(ledger,list) else ledger['units']
 for ref in sourceRefs:
  rows.append({'knowledge_id':kid,'source_id':ref['sourceId'],'source_page':{'pdf':ref['pdfPage'],'printed':ref['pdfPage']},'source_section':ref['locator'],'knowledge_summary':item['summary'],'level':l['level'],'competency':item['summary'],'lesson_id':l['id'],'section_id':section['id'],'question_ids':[q['id']],'image_ids':[l['illustration']['id']],'translation_status':{},'before_status':a['before']['teachingStatus'],'after_status':'authored_ai_unreviewed','evidence':f'src/data/hospitality/{g}.json#{l["id"]}/{section["id"]}','unresolved_issue':'source detail image coverage not independently accepted'})
 write(p,ledger)
for item in plan.get('bodyRepairs',[])+plan['assessmentRepairs']:
 l=lessons[item['lesson']];changed.add(l['id']);targets=[a for a in atoms['atoms'] if a['atomId'] in item['atoms']]
 assert len(targets)==len(item['atoms'])
 if item.get('append'):
  section=next(s for s in l['sections'] if s['id']==item['section']);section['body']+='\n\n'+item['append']
  for a in targets:
   a.setdefault('teachingRepairHistory',[]).append({'baselineCommit':baseline,'previousEvidence':a['after']['evidence'],'reason':item['reason']})
   a['after']['evidence']={'lessonId':l['id'],'sectionId':section['id'],'quote':item['append']}
 ids=sorted(set(k for a in targets for qid in a['after']['questionIds'] for q in l['questions'] if q['id']==qid for k in q['knowledgeIds']))
 q=question(l,item['question'],ids)
 for a in targets:
  a.setdefault('assessmentRepairHistory',[]).append({'baselineCommit':baseline,'previousQuestionEvidence':a['after']['questionEvidence'],'reason':item['reason']})
  a['after']['questionIds']=[q['id']];a['after']['questionEvidence']=[{'questionId':q['id'],'prompt':q['prompt'],'correctChoice':q['choices'][q['answerIndex']]}]
for g,d in groups.items():
 if any(l['id'] in changed for l in d['lessons']):write(DATA/(g+'.json'),d)
subprocess.run(['node','scripts/hospitality/build.cjs'],cwd=ROOT,check=True)
current={l['id']:l for g in groups for l in read(DATA/(g+'.json'))['lessons']}
for a in atoms['atoms']+newatoms:
 lid=a['after']['evidence']['lessonId']
 if lid in changed:
  l=current[lid];section=next(s for s in l['sections'] if s['id']==a['after']['evidence']['sectionId'])
  assert a['after']['evidence']['quote'] in section['body']
  a['after']['reviewedLessonRevision']=l['revision']
  a['review']['revisionCarryForward']={'date':'2026-11-01','reason':'Original body text and question records preserved; source-specific detail/questions appended. Changed assessment bindings have explicit history.'}
atoms['atoms']+=newatoms
url='https://kakarikata.mhlw.go.jp/kakaritsuke/urgency.html'
if any(i['atomId']=='HA2-059-04' for i in plan['additions']):
 atoms.setdefault('supplementalOfficialSources',[]).append({'url':url,'checkedAt':'2026-11-01','use':'Reconfirmed urgent 119 escalation and no waiting for complete information; source2 p59 medical consultation detail restored.'})
write(DOC/'source-atoms-authoring.json',atoms)
(DOC/'source-fragments-authoring.json').write_text(json.dumps(fragments,ensure_ascii=False,separators=(',',':'))+'\n')
for page in atoms['pages']:
 page['atomIds']=[a['atomId'] for a in atoms['atoms'] if any(r['sourceId']==page['sourceId'] and r['pdfPage']==page['pdfPage'] for r in a['sourceRefs'])]
write(DOC/'source-atoms-authoring.json',atoms)
write(evidence_path,{'baselineCommit':baseline,'changedLessons':sorted(changed),'newSourceAtomIds':[a['atomId'] for a in newatoms],'newQuestionIds':newquestions,'sourceBlockAnchorsVerified':True,'sourceTextRedistributed':False,'allSourceKnowledgeCovered':False,'translationAction':'No new translation; changed Japanese revisions invalidate stale translations.','changes':[{'lessonId':lid,'beforeRevision':before[lid]['revision'],'afterRevision':current[lid]['revision']} for lid in sorted(changed)],'assessmentRepairs':plan['assessmentRepairs'],'bodyRepairs':plan.get('bodyRepairs',[])})
subprocess.run(['node','scripts/hospitality/build.cjs'],cwd=ROOT,check=True)
print(json.dumps({'changedLessons':len(changed),'newAtoms':len(newatoms),'newQuestions':len(newquestions)}))
