"""Screen exact forty-character source runs. Not a semantic originality certification."""
from pathlib import Path
import re,json,os
ROOT=Path(__file__).resolve().parents[2];DATA=ROOT/'src/data/restaurant'
SRC=Path(os.environ.get('RESTAURANT_SOURCE_TEXT','/workspace/scratch/f88f367d2ad0/restaurant-source-text'))
def norm(s):return re.sub(r'\s+','',s)
N=40;windows=set();sources=list(SRC.glob('rst-*.txt'))
if len(sources)!=7:raise SystemExit('Seven source extracts required outside repository')
for p in sources:
 s=norm(p.read_text());windows.update(s[i:i+N] for i in range(len(s)-N+1))
flags=[];fields=0
for p in DATA.glob('*.ja.json'):
 x=json.loads(p.read_text())
 for l in x.get('lessons',[]):
  for para in l['paragraphs']:
   s=norm(para['textJa']);fields+=1
   if any(s[i:i+N] in windows for i in range(len(s)-N+1)):flags.append({'id':l['id'],'field':para['id']})
 for e in x.get('exams',[]):
  for q in e['questions']:
   for k in ('stemJa','explanationJa'):
    s=norm(q[k]);fields+=1
    if any(s[i:i+N] in windows for i in range(len(s)-N+1)):flags.append({'id':q['id'],'field':k})
report={'status':'FLAGS_NEED_REVIEW' if flags else 'NO_EXACT_RUN_FLAG','windowCharacters':N,'fieldsChecked':fields,'sourceFiles':len(sources),'flags':flags,'semanticOriginalityCertified':False,'limitations':['Ruby layout can interrupt matching. Exact technical facts may be legitimate overlap. Absence of an exact run is not proof of independent expression.']}
(ROOT/'docs/ssw-workspace/restaurant/source-overlap-screen.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
