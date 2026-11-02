#!/usr/bin/env python3
"""Persist reviewed dispositions for exact census rebuild; no semantic decisions here."""
import gzip,json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[2];D=R/'docs/ssw-workspace/source-coverage-v2'
def main():
 p=D/'manufacturing-region-dispositions.json';disp=json.loads(p.read_text());receipt=json.loads((D/'manufacturing-census-validation.json').read_text())
 # Keep the wrapped census disposition schema; no root-level element-ID keys.
 disp={k:v for k,v in disp.items() if k in ['schemaVersion','sector','basis','elements']}
 disp['basis']='Author source49/50/51 manual claim dispositions; three overview pages inventoried, technical pages bounded only.'
 assert isinstance(disp.get('elements'),dict)
 for row in receipt['artifacts']:
  path=R/row['path'];b=path.read_bytes();row.update(sha256=hashlib.sha256(b).hexdigest(),bytes=len(b));a=json.loads(gzip.decompress(b))
  for page in a['pages']:
   for e in page['elements']:
    if e['classification']!='pending':disp['elements'][e['elementId']]={k:e[k] for k in ['classification','knowledgeIds','reason']}
 p.write_text(json.dumps(disp,ensure_ascii=False,indent=2)+'\n');(D/'manufacturing-census-validation.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n')
if __name__=='__main__':main()
