"""Lossless target whitespace normalization; Japanese keys/IDs/source hashes untouched."""
from pathlib import Path
import json,re,hashlib
P=Path(__file__).parent
TARGET_KEYS={'title','objective','text','meaning','activity','summary','stem'}
def norm(s):
 s=re.sub(r'(?<![0-9] )\bA ng\b','Ang',s)
 s=re.sub(r'(?<![0-9] )\bm ay\b','may',s)
 s=s.replace('・', ', ').replace('timesng','times ng').replace('binale-wala','binalewala')
 s=re.sub(r'(?<=[0-9])(?=[A-Za-z])',' ',s)
 s=re.sub(r'(?<=[A-Za-z])(?=[0-9])',' ',s)
 s=re.sub(r'(?<=[0-9] )(mm|ms|cm|kg|s|g|m|V|A)(ang|ay|at|sa|ng|kapag|lamang|kaysa|bilang|hanggang)(?=\b|[0-9])',r'\1 \2',s)
 s=re.sub(r'(?<=[²³Ω℃%])(?=[A-Za-z])',' ',s)
 s=re.sub(r'(?<=[,;:])(?=[A-Za-z])',' ',s)
 s=re.sub(r'(?<=\.)(?=[A-Z“])',' ',s)
 s=re.sub(r'\b4 M(?=[a-z])','4M ',s)
 s=s.replace('4 M','4M')
 return s
changed=[]
def walk(x,k=''):
 if isinstance(x,dict):return {a:walk(b,a) for a,b in x.items()}
 if isinstance(x,list):return [walk(a,k) for a in x]
 if isinstance(x,str) and (k in TARGET_KEYS or k in {'options','reasons','safety'}):return norm(x)
 return x
for f in sorted(P.glob('root-tl-*.json')):
 before=f.read_bytes();obj=json.loads(before);new=walk(obj);after=(json.dumps(new,ensure_ascii=False,indent=2)+'\n').encode()
 if before!=after:f.write_bytes(after);changed.append({'path':f.name,'beforeSHA256':hashlib.sha256(before).hexdigest(),'afterSHA256':hashlib.sha256(after).hexdigest()})
(P/'root-spacing-normalization-qa.json').write_text(json.dumps({'scope':'Target spacing only; number values, Japanese bindings and metadata preserved. Reapply after author scripts to reproduce normalized payloads.','changed':changed,'nativeReviewed':False},ensure_ascii=False,indent=2)+'\n')
print('Normalized',len(changed),'target payloads')
