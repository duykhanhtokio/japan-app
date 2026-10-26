"""Read-only target-prose script audit; detects contamination, not native-language quality."""
import collections, hashlib, json, re, unicodedata
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'src/data/manufacturing'
REPORT=ROOT/'docs/ssw-workspace/manufacturing/batch12/global-translation-script-audit.json'
RANGES={
 'Bengali':r'[\u0980-\u09ff]', 'Devanagari':r'[\u0900-\u097f]',
 'Myanmar':r'[\u1000-\u109f\uaa60-\uaa7f\ua9e0-\ua9ff]',
 'Thai':r'[\u0e00-\u0e7f]', 'Khmer':r'[\u1780-\u17ff\u19e0-\u19ff]',
 'CJK':r'[\u3400-\u4dbf\u4e00-\u9fff]',
 'Kana':r'[\u3041-\u309f\u30a1-\u30fa\u30fc-\u30ff]',
 'Hangul':r'[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]',
 'Arabic':r'[\u0600-\u06ff]', 'Cyrillic':r'[\u0400-\u052f]'}
ALLOWED={'bn':{'Bengali'},'ne':{'Devanagari'},'hi':{'Devanagari'},'my':{'Myanmar'},'th':{'Thai'},'km':{'Khmer'},'zh':{'CJK'},'ko':{'Hangul','CJK'},'ja':{'CJK','Kana'}}
PROSE={'title','objective','activity','summary','text','meaning','safety','stem','options','reasons','caption','alt','description','label'}
def targets(value,path=''):
 if isinstance(value,dict):
  for key,v in value.items():
   if key in PROSE:
    if isinstance(v,str):yield path+'.'+key,v
    elif isinstance(v,list):
     for i,item in enumerate(v):
      if isinstance(item,str):yield f'{path}.{key}[{i}]',item
      elif isinstance(item,dict):yield from targets(item,f'{path}.{key}[{i}]')
   elif key in {'paragraphs','terms'}:yield from targets(v,path+'.'+key)
 elif isinstance(value,list):
  for i,item in enumerate(value):yield from targets(item,f'{path}[{i}]')
def classify(script,text):
 if script not in {'CJK','Kana'}:return 'foreign_script_contamination'
 # Only short Japanese labels fully inside explicit parentheses get an intentional-term candidate label.
 stripped=re.sub(r'[（(][^()（）]{1,90}[）)]','',text)
 if not re.search(RANGES[script],stripped):return 'parenthetical_japanese_term_candidate'
 if re.search(r'[。！？]|[\u3041-\u309f].{12,}',text):return 'untranslated_japanese_prose_candidate'
 return 'japanese_term_or_untranslated_text_needs_review'
def main():
 findings=[];counts=collections.Counter();inputs=[]
 def inspect(locale,identity,field,text,file):
  counts[locale]+=1
  for script,pat in RANGES.items():
   if script in ALLOWED.get(locale.split('-')[0],set()):continue
   chars=''.join(sorted({c for c in re.findall(pat,text) if unicodedata.category(c)[0] in {'L','M','N'}}))
   if chars:findings.append({'locale':locale,'id':identity,'field':field,'script':script,'classification':classify(script,text),'characters':chars,'text':text,'file':str(file.relative_to(ROOT))})
 def record(file):inputs.append({'path':str(file.relative_to(ROOT)),'sha256':hashlib.sha256(file.read_bytes()).hexdigest()})
 for file in sorted((DATA/'translations').glob('*.json')):
  d=json.loads(file.read_text());locale=d.get('locale')
  if not locale:continue
  record(file)
  for kind in ['lessons','questions']:
   for identity,row in d.get(kind,{}).items():
    for field,text in targets(row):inspect(locale,identity,field.lstrip('.'),text,file)
 file=DATA/'mock-translations.json'
 if file.exists():
  record(file);d=json.loads(file.read_text())
  for locale,rows in d.get('locales',{}).items():
   for identity,row in rows.items():
    for field,text in targets(row):inspect(locale,identity,field.lstrip('.'),text,file)
 file=DATA/'diagram-translations.json'
 if file.exists():
  record(file);d=json.loads(file.read_text())
  for locale,rows in d.get('locales',{}).items():
   for identity,row in rows.items():
    if isinstance(row,str):inspect(locale,identity,'caption',row,file)
    else:
     for field,text in targets(row):inspect(locale,identity,field.lstrip('.'),text,file)
 file=DATA/'source-guide-translations.json'
 if file.exists():
  record(file);d=json.loads(file.read_text())
  for locale,label in d.get('uiLabels',{}).items():
   if locale!='ja':inspect(locale,'source-guide-ui-label','uiLabel',label,file)
  for locale,rows in d.get('locales',{}).items():
   if locale=='ja':continue
   for identity,row in rows.items():
    for field,text in targets(row):inspect(locale,identity,field.lstrip('.'),text,file)
 for finding in findings:
  identity=finding['id']
  if finding['script']=='Hangul' and finding['locale']=='bn':
   finding['reviewDisposition']='confirmed_foreign_script_typo'
   finding['reviewNote']='Hangul syllable 닝 embedded in Bengali lining word; proposed Bengali spelling লাইনিং; no source mutation made by this audit.'
  elif identity=='mfg1-mechanical-weekly-10-q12':
   finding['reviewDisposition']='intentional_japanese_quoted_learning_example'
   finding['reviewNote']='The question explicitly compares Japanese prohibition and permission phrases; quotes are instructional content.'
  elif finding['locale']=='th':
   finding['reviewDisposition']='intentional_japanese_term_or_drawing_symbol'
   finding['reviewNote']='Thai prose explains the Japanese three-fix terms or bevel drawing symbol; not untranslated prose.'
  elif identity=='mfg1-surface-lesson-070':
   finding['reviewDisposition']='intentional_japanese_product_common_names'
   finding['reviewNote']='Japanese abrasive common names are the subject being explained in Chinese surrounding prose.'
 report={'scope':'Independent automated script contamination audit of compiled lesson/weekly/mock/diagram/source-guide target prose and source-guide UI labels; excludes Japanese glossary keys/readings and all metadata. Candidate classification requires human context review; not semantic, native, domain or release certification. Hash/count completeness verified separately by root.','targetFieldCounts':dict(sorted(counts.items())),'findingCounts':dict(collections.Counter(x['classification'] for x in findings)),'reviewDispositionCounts':dict(collections.Counter(x.get('reviewDisposition','unreviewed') for x in findings)),'findings':findings,'inputs':inputs,'nativeCertified':False,'domainCertified':False,'resolvedPriorFindings':[{'locale':'bn','id':'mfg1-surface-lesson-026','field':'paragraphs[2].text','previousTextFragment':'লাই닝','resolution':'Current compiled target now uses Bengali লাইনিং; no Hangul remains in this field. Product fix performed by root before final audit.'}]} 
 REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items()if k not in {'findings','inputs'}},ensure_ascii=False));print('findings',len(findings))
if __name__=='__main__':main()
