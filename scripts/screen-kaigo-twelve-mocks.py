"""Private source input stays outside repository; output contains counts only."""
import argparse,json,re,unicodedata,hashlib
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--source-text',required=True);args=p.parse_args();R=Path(__file__).resolve().parents[1]
def norm(s):return re.sub(r'\s+',' ',unicodedata.normalize('NFKC',s)).casefold().strip()
source=norm(Path(args.source_text).read_text());runtime=json.loads((R/'src/data/kaigo/content.json').read_text())
fields=[]
for form in runtime['mocks']:
 if not re.search(r'-0[456]$',form['id']):continue
 for q in form['questions']:
  for key in ['promptJa','promptVi','passageJa','passageVi','optionsJa','optionsVi','rationalesVi']:
   value=q.get(key,[])
   if isinstance(value,str):value=[value]
   fields.extend((q['id']+'-'+key+'-'+str(i),v) for i,v in enumerate(value) if v)
windows={source[i:i+60] for i in range(max(0,len(source)-59))};hits=[]
for id,text in fields:
 text=norm(text);matched=sum(text[i:i+60] in windows for i in range(max(0,len(text)-59)))
 if matched:hits.append(dict(fieldId=id,matchingWindows=matched))
report=dict(date='2026-10-10',method='NFKC, whitespace collapse, casefold; exact 60-character windows against private extraction',sourceSha256='997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54',runtimeSha256=hashlib.sha256((R/'src/data/kaigo/content.json').read_bytes()).hexdigest(),fields=len(fields),hits=hits,sourceTextPublished=False,semanticHumanReview=False,imageSimilarityReviewed=False,rightsCertified=False,releaseReady=False)
(R/'docs/ssw-workspace/kaigo/reviews/twelve-mocks-originality-screen.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
