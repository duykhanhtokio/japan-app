"""Bind each actual scoped study day to a source-versioned instructional asset."""
from pathlib import Path
import argparse,json,hashlib
root=Path(__file__).resolve().parents[2];out=root/'docs/ssw-workspace/kensetsu/daily-fix-20261031'
parser=argparse.ArgumentParser();parser.add_argument('--sessions',required=True);args=parser.parse_args()
rows=json.loads((out/'current-days.json').read_text());figs=json.loads((root/'src/data/kensetsu/daily-technical-figures.json').read_text())['figures'];by={s['id']:s for s in json.loads(Path(args.sessions).read_text())};bindings=[]
for day in rows:
 eligible=day['qualifyingObjectiveImagePaths'];assert eligible,day['id']
 selected=next((f for f in figs if f['assetPath']in eligible and any(b['sessionId']in day['memberIds']for b in f['bindings'])),None)
 if selected:
  binding=next(b for b in selected['bindings']if b['sessionId']in day['memberIds']);asset=selected['assetPath'];source_id=binding['sessionId'];caption=by[source_id]['titleJa'];caption_translations=by[source_id].get('titleTranslations',{});caption_basis='exact_canonical_source_title';reason=binding['reasonJa']
 else:
  asset=eligible[0];source_id=next((sid for sid in day['memberIds']if any(a['path']==asset for a in by[sid].get('illustrations',[]))or any(c.get('illustration',{}).get('assetPath')==asset for c in by[sid]['clusters'])),day['id']);session=by[source_id]
  caption=next((a['altJa']for a in session.get('illustrations',[])if a['path']==asset),None)or next((c['illustration']['captionJa']for c in session['clusters']if c.get('illustration',{}).get('assetPath')==asset),'本文と対応する既存の学習図')
  caption_translations=next((a.get('altTranslations',{})for a in session.get('illustrations',[])if a['path']==asset),None)or next((c['illustration'].get('captionTranslations',{})for c in session['clusters']if c.get('illustration',{}).get('assetPath')==asset),{});caption_basis='exact_existing_caption_and_translations'
  reason='元の対象日に結び付いた固有の学習図を保持する。背景・NPC・文字カードを代用にしない。'
 source=by[source_id]
 bindings.append({'level':day['level'],'field':day['field'],'subject':day['subject'],'weekId':day['weekId'],'day':day['day'],'primarySessionId':day['id'],'keyObjectiveSessionId':source_id,'keyObjectiveJa':source['titleJa'],'sourceRevision':source['revision'],'sourceParagraphIds':[p['id']for c in source['clusters']for p in c['paragraphs']],'sourceParagraphPayloadSha256':hashlib.sha256(json.dumps([c['paragraphs']for c in source['clusters']],ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest(),'assetPath':asset,'assetSha256':hashlib.sha256((root/asset).read_bytes()).hexdigest(),'captionJa':caption,'captionTranslations':caption_translations,'captionBasis':caption_basis,'relevanceReasonJa':reason,'aiAuthorSelected':True,'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False})
(out/'daily-visual-bindings.json').write_text(json.dumps({'status':'all_scoped_study_days_bound_to_objective_illustration_ai_selected','notDomainCertification':True,'bindings':bindings},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'scopedDayBindings':len(bindings),'uniquePrimaryDayIds':len(set(x['primarySessionId']for x in bindings))}))
