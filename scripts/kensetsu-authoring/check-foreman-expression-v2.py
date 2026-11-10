"""Narrow exact-span editorial screen, never a copyright/semantic clearance."""
import json,re,sys,unicodedata
from pathlib import Path
import fitz
R=Path(__file__).resolve().parents[2];B=R/'docs/ssw-workspace/kensetsu/foreman';pdf=fitz.open(sys.argv[1]);norm=lambda x:re.sub(r'\W','',unicodedata.normalize('NFKC',x))
source={p.number+1:norm(''.join(s['text'] for b in p.get_text('dict')['blocks'] if b['type']==0 for l in b['lines'] for s in l['spans'] if s['size']>=10)) for p in pdf if p.number>=6};indices={n:{s[i:i+22] for i in range(max(0,len(s)-21))} for n,s in source.items()};texts=[]
for n in range(1,29):
 d=json.loads((B/f'session-{n:03}.json').read_text());texts.append((d['id']+':title',d['titleJa']))
 for c in d['clusters']:
  texts.append((c['id']+':title',c['titleJa']));texts.extend((p['id'],p['ja']) for p in c['paragraphs'])
  if c.get('applicationPromptJa'):texts.append((c['id']+':prompt',c['applicationPromptJa']))
  if c.get('learningActivity'):texts.append((c['id']+':activity',c['learningActivity']['ja']))
  if c.get('illustration'):texts.append((c['id']+':caption',c['illustration']['captionJa']))
found=[]
for kid,text in texts:
 for variant in [text,re.sub(r'（[ぁ-ゖー]+）','',text)]:
  s=norm(variant);windows={s[i:i+22] for i in range(max(0,len(s)-21))}
  for n,idx in indices.items():
   common=windows&idx
   if common:found.append({'appTextId':kid,'sourcePdfPage':n,'normalizedWindowSha256Only':__import__('hashlib').sha256(sorted(common)[0].encode()).hexdigest()})
report={'status':'editorial_exact_span_screen_only','date':'2026-11-02','normalization':'NFKC, remove non-word characters; also remove inlinekana; within source page','thresholdNormalizedCharacters':22,'sourcePdfPages':list(source),'paragraphs':112,'allJapaneseStringsScreened':len(texts),'includes':['lesson/cluster titles','all112Japanese paragraphs','all50original prompts','all10depth activities including3expanded continuations','all7caption placements'],'candidates':found,'rightsCertification':False,'semanticCoverageCertification':False,'minimumSourceFontPoints':10,'limitations':['Exact windows do not detect paraphrase similarity or establish rights.','PDF raster/table labels and extracted small fonts are not covered by this separate editorial screen; retained in source census.']};(B/'expression-screen.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'strings':len(texts),'candidates':len(found),'rightsCertification':False}));assert not found
