"""Mechanical overlap screen only; not plagiarism, legal or semantic certification.
Reads user PDFs locally; publishes only IDs/hashes, never source sentences/images.
"""
import argparse,hashlib,json,pathlib,re,unicodedata
import fitz
ROOT=pathlib.Path(__file__).resolve().parents[2]
def norm(s):return re.sub(r'\s+','',unicodedata.normalize('NFKC',s))
def main(folder):
 sources=[]
 for level in [1,2]:
  pdf=fitz.open(folder/f'耕種農業全般 特定技能{level}号.pdf');parts=[]
  for page in pdf:
   for b in page.get_text('dict')['blocks']:
    for line in b.get('lines',[]):parts.append(''.join(s['text'] for s in line['spans'] if s['size']>=8))
  sources.append((f'AGR-S{level}',norm(''.join(parts))))
 content=json.loads((ROOT/'src/data/agriculture/lessons.ja.json').read_text());seen={};duplicates=[];matches=[]
 for lesson in content['lessons']:
  for p in lesson['paragraphs']:
   text=norm(p['textJa']);digest=hashlib.sha256(text.encode()).hexdigest()
   if len(text)>=32 and text in seen:duplicates.append({'paragraphId':p['id'],'previousParagraphId':seen[text],'normalizedTextSha256':digest})
   seen[text]=p['id']
   for sourceid,source in sources:
    indices=[i for i in range(max(0,len(text)-47)) if text[i:i+48] in source]
    if indices:matches.append({'paragraphId':p['id'],'sourceId':sourceid,'normalized48CharacterWindowCount':len(indices),'normalizedTextSha256':digest})
 result={'schemaVersion':1,'status':'NEEDS_EDITORIAL_REVIEW' if duplicates or matches else 'NO_EXACT_48_CHARACTER_SOURCE_WINDOWS_FOUND','lessons':len(content['lessons']),'exactParagraphDuplicates':duplicates,'sourceOverlapCandidates':matches,'meaning':'Mechanical source-expression screen only. Common technical names may match; no rights, originality, semantic or native certification.','rawSourcePublished':False}
 out=ROOT/'docs/ssw-workspace/agriculture/source-overlap-screen.json';out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'lessons':len(content['lessons']),'duplicateParagraphs':len(duplicates),'sourceCandidates':len(matches)}))
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('folder',type=pathlib.Path);a=p.parse_args();main(a.folder)
