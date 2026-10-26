"""Check QA host fallback glyph coverage; no product-font or native-shaping claim."""
import argparse,hashlib,json
from pathlib import Path
from fontTools.ttLib import TTFont
parser=argparse.ArgumentParser();parser.add_argument('--fonts',type=Path,required=True);parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[2];data=root/'src/data/manufacturing';fonts=sorted([*args.fonts.glob('*.ttf'),*args.fonts.glob('*.otf')]);assert fonts,'No QA fonts supplied'
coverage=set();fontrows=[]
for f in fonts:
 coverage.update(TTFont(f).getBestCmap());fontrows.append({'file':f.name,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()})
def strings(x):
 if isinstance(x,str):yield x
 elif isinstance(x,dict):
  for value in x.values():yield from strings(value)
 elif isinstance(x,list):
  for value in x:yield from strings(value)
paths=[data/'source-guides.json',data/'source-guide-translations.json',data/'mock-translations.json',data/'diagram-translations.json',data/'ui-translations.json',data/'mock-ui-translations.json',*sorted((data/'translations').glob('*.json'))];chars=set();inputs=[]
for p in paths:
 raw=p.read_bytes();inputs.append({'file':str(p.relative_to(root)),'sha256':hashlib.sha256(raw).hexdigest()})
 for s in strings(json.loads(raw)):chars.update(map(ord,s))
missing=[x for x in sorted(chars-coverage) if x>=0x80 and not 0x200B<=x<=0x200F and x not in [0x2028,0x2029,0xFEFF]]
report={'status':'FAIL' if missing else 'PASS','scope':'QA host cmap coverage of current data codepoints with explicit fallback fonts. Does not certify shaping, physical native devices, translation quality, or product font bundles. JLPT and product font settings unchanged.','codepointCount':len(chars),'fontCount':len(fonts),'missing':[{'character':chr(x),'codepoint':hex(x)} for x in missing],'fonts':fontrows,'inputFiles':inputs}
args.output.parent.mkdir(parents=True,exist_ok=True);args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k not in ['fonts','inputFiles']}));assert not missing
