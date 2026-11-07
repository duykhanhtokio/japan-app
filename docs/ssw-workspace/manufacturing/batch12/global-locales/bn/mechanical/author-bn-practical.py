import json
from pathlib import Path
OUT=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete/docs/ssw-workspace/manufacturing/batch12/global-locales/bn/mechanical')
def savep(start,rows):
 (OUT/f'bn-practical-memory{start:03d}-{start+len(rows)-1:03d}.json').write_text(json.dumps({'locale':'bn','status':'ai_translated_draft','nativeReviewed':False,'domainReviewed':False,'translationMemory':rows},ensure_ascii=False,indent=2)+'\n')
