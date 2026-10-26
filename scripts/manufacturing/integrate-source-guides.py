"""Compile exact-source AI reference translations; retain original course identities."""
from pathlib import Path
import argparse,hashlib,json,re
R=Path(__file__).resolve().parents[2];P=R/'docs/ssw-workspace/manufacturing/batch12/source-guides';D=R/'src/data/manufacturing';parser=argparse.ArgumentParser();parser.add_argument('--require-complete',action='store_true');args=parser.parse_args()
def read(p):return json.loads(p.read_text())
def write(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
def sha(d):return hashlib.sha256(json.dumps(d,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
source=read(D/'source-guides.json');freeze=read(P/'source-freeze.json');assert hashlib.sha256((D/'source-guides.json').read_bytes()).hexdigest()==freeze['sha256'];guides={g['id']:g for g in source['guides']};assert len(guides)==5
for id,g in guides.items():assert sha({k:v for k,v in g.items() if k!='sourceHash'})==g['sourceHash']==freeze['objects'][id]
targets=['en','vi','id','zh-CN','zh-TW','hi','bn','ne','my','th','km','tl'];locales={};labels={'ja':source['uiLabelJa']};counts={};fields=0;numeric_equivalents=[]
for locale in targets:
 path=P/'locales'/f'{locale}.json'
 if not path.exists():counts[locale]=0;continue
 data=read(path);assert data['locale']==locale and data.get('nativeReviewed') is False and data.get('domainReviewed') is False and data.get('independentlyReviewed') is False;assert isinstance(data['uiLabel'],str) and data['uiLabel'].strip();labels[locale]=data['uiLabel'];entries=data['lessons'];assert set(entries)<=set(guides)
 for id,t in entries.items():
  s=guides[id];assert t['sourceHash']==s['sourceHash'] and t.get('translatedDirectlyFrom')=='ja' and t.get('nativeReviewed') is False and t.get('domainReviewed') is False
  assert [p['id'] for p in t['paragraphs']]==[p['id'] for p in s['paragraphs']];assert len(t['terms'])==len(s['terms']) and len(t['safety'])==len(s['safetyJa'])
  pairs=[(s[a+'Ja'],t[a]) for a in ['title','objective','activity','summary']]
  for a,b in zip(s['paragraphs'],t['paragraphs']):pairs.extend([(a['titleJa'],b['title']),(a['textJa'],b['text'])])
  for a,b in zip(s['terms'],t['terms']):assert a['ja']==b['ja'] and a['reading']==b['reading'];pairs.append((a['meaningJa'],b['meaning']))
  pairs.extend(zip(s['safetyJa'],t['safety']))
  for ja,text in pairs:
   assert isinstance(text,str) and text.strip(),(locale,id)
   source_numbers=set(re.findall(r'\d+(?:\.\d+)?',ja));target_numbers=set(re.findall(r'\d+(?:\.\d+)?',text))
   month7={'en':'July','id':'Juli','tl':'Hulyo','hi':'जुलाई','bn':'জুলাই','ne':'जुलाई','my':'ဇူလိုင်','th':'กรกฎาคม','km':'កក្កដា','vi':'tháng 7','zh-CN':'七月','zh-TW':'七月'}
   if source_numbers!=target_numbers and '2026年7月' in ja and month7[locale] in text and source_numbers-target_numbers=={'7'}:
    target_numbers.add('7');numeric_equivalents.append({'locale':locale,'id':id,'source':'2026年7月','localizedMonth7':month7[locale]})
   assert source_numbers==target_numbers,(locale,id,ja,text)
  fields+=len(pairs)
 locales[locale]=entries;counts[locale]=len(entries)
if args.require_complete:assert all(counts[l]==5 for l in targets),counts
write(D/'source-guide-translations.json',{'sourceLocale':'ja','status':'source_bound_ai_drafts_not_native_or_domain_certified','nativeReviewed':False,'domainReviewed':False,'uiLabels':labels,'locales':locales})
report={'status':'PASS','guides':len(guides),'translatedGuidePairs':sum(counts.values()),'translatedTextFields':fields,'coverage':counts,'completeDraftLocales':[l for l in targets if counts[l]==5],'numericEquivalentDates':numeric_equivalents,'scope':'Five AI reference supplements close eight specifically audited TOC gaps; not full-source object atomization or native/domain certification. Original262lessons/456weekly/30mocks unchanged.','nativeReviewed':False,'domainReviewed':False}
write(P/'integration-qa.json',report);print(json.dumps(report))
