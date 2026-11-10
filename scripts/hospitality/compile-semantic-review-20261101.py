"""Compile this session's explicitly scoped AI editorial review.

Assertions below verify evidence identities; they do not perform or certify
semantic review. The visual definitions and remediation plans are authored
judgments, and full-page source decomposition remains open.
"""
from pathlib import Path
import json,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[2];DOC=ROOT/'docs/ssw-workspace/hospitality';DATA=ROOT/'src/data/hospitality'
def read(p):return json.loads(p.read_text())
atoms=read(DOC/'source-atoms-authoring.json')['atoms'];byid={a['atomId']:a for a in atoms}
lessons={l['id']:l for g in ['front','planning','service','restaurant','safety'] for l in read(DATA/(g+'.json'))['lessons']}
questions={q['id']:(l['id'],q) for l in lessons.values() for q in l['questions']}
images={i['lessonId']:i for i in read(DOC/'image-manifest.json')['images']}
plans=['semantic-remediation-20261101','semantic-followup-20261101','semantic-final-assessments-20261101']
repairs=[]
for name in plans:
 p=read(ROOT/'scripts/hospitality'/(name+'.json'))
 repairs+=p.get('bodyRepairs',[])+p['assessmentRepairs']
fixed={atom for r in repairs for atom in r['atoms']}
answerfix=read(DOC/'semantic-answer-refinements-20261101.json')
for a in atoms:
 if any(e['questionId']==c['questionId'] for e in a['after']['questionEvidence'] for c in answerfix):fixed.add(a['atomId'])
rows=[]
for a in atoms:
 l=lessons[a['after']['evidence']['lessonId']];s=next(s for s in l['sections'] if s['id']==a['after']['evidence']['sectionId'])
 assert a['after']['reviewedLessonRevision']==l['revision'] and a['after']['evidence']['quote'] in s['body']
 for ev in a['after']['questionEvidence']:
  q=questions[ev['questionId']][1];assert ev['prompt']==q['prompt'] and ev['correctChoice']==q['choices'][q['answerIndex']]
 rows.append({'atomId':a['atomId'],'lessonId':l['id'],'sourceRevision':l['revision'],'questionIds':a['after']['questionIds'],'claimBindingReview':'repaired_ai_checked' if a['atomId'] in fixed else 'rechecked_ai_no_additional_binding_issue_found','assessmentScope':a['after']['assessmentStatus'],'sourcePageExhaustivenessAccepted':False})
visual=[];pagekeys=set()
for d in read(ROOT/'scripts/hospitality/semantic-visual-definitions.json'):
 linked=[byid[i] for i in d['atoms']];lids=sorted({a['after']['evidence']['lessonId'] for a in linked})
 for n,p in d['sources']:pagekeys.add((f'hotel-{n}',p))
 visual.append({**d,'reviewer':'AI','status':'source_visual_meaning_rechecked_candidate','teachingSections':sorted({a['after']['evidence']['sectionId'] for a in linked}),'questionIds':sorted({q for a in linked for q in a['after']['questionIds']}),'learningFigures':[{'lessonId':lid,'imageId':images[lid]['imageId'],'sha256':images[lid]['sha256']} for lid in lids],'domainReviewed':False,'nativeReviewed':False})
pages=[]
for p in read(DOC/'page-audit.json')['pages']:
 key=(p['sourceId'],p['pdfPage'])
 pages.append({'sourceId':p['sourceId'],'pdfPage':p['pdfPage'],'knowledgeScopeIncluded':p['knowledgeScopeIncluded'],'disposition':'excluded_with_recorded_reason' if not p['knowledgeScopeIncluded'] else 'visual_and_selected_paragraphs_rechecked' if key in pagekeys else 'prior_claim_links_retained_full_page_reconciliation_open','exclusionReason':p.get('exclusionReason'),'allPageIdeasAccepted':False})
old=json.loads(subprocess.check_output(['git','show','HEAD:docs/ssw-workspace/hospitality/image-manifest.json'],cwd=ROOT,text=True))
old={i['lessonId']:i for i in old['images']}
changed=[{'lessonId':lid,'beforeSha256':old[lid]['sha256'],'afterSha256':im['sha256']} for lid,im in images.items() if old[lid]['sha256']!=im['sha256']]
data={'schemaVersion':1,'date':'2026-11-01','timezone':'Asia/Tokyo','baselineCommit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip(),'scope':'AI claim-to-teaching/assessment binding review for all existing 379 claims; fresh visual review of the 20 explicitly listed source pages. Not full semantic reconciliation of every native block and not professional/native/device acceptance.','sourceClaims':rows,'visualMeaningReviews':visual,'sourcePages':pages,'remediations':repairs,'answerRefinements':answerfix,'changedLearningFigures':changed,'summary':{'existingClaimsRechecked':len(rows),'claimBindingsRepaired':len(fixed),'freshSourceVisualPages':len(pagekeys),'newQuestions':sum(len(read(DOC/(p+'-evidence.json'))['newQuestionIds']) for p in plans),'questionsTotal':len(questions),'changedLearningFigures':len(changed),'allSourceKnowledgeCovered':False,'fullPageDecompositionsClosed':0,'domainReviewed':False,'nativeReviewed':False},'remaining':[{'id':'full-page-semantic-reconciliation','scope':'All instructional pages remain open for exhaustive paragraph/bullet/table/figure-to-atom accounting; presence of page links is not acceptance.'},{'id':'dish-photo-identification','scope':'Original Japanese/Western course photos have labels/order reconciled, but realistic dish-identification practice is not certified by text-only sequence questions.'},{'id':'context-versus-direct-assessment','scope':'HA1-047-01 is background context used in an applied preparation question; it is no longer claimed as a direct test of the background definition.'}]}
(DOC/'semantic-review-authoring-20261101.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(data['summary']))
