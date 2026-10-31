"""Curated key-objective figure assignment for each stable scheduled lesson."""
from pathlib import Path
import json,hashlib,re
from PIL import Image
ROOT=Path(__file__).resolve().parents[2];P=ROOT/'src/data/manufacturing';read=lambda p:json.loads(p.read_text())
assets=read(P/'daily-figure-assets.json')['assets'];existing={}
for l in ['ManufacturingDiagram.tsx']:
 source=(ROOT/'src/components/manufacturing'/l).read_text()
 for asset,caption in re.findall(r"source:require\('([^']+)'\),altJa:'([^']*)'",source):
  path=(ROOT/'src/components/manufacturing'/asset).resolve();existing[path.stem]=(path,caption)
for item in read(P/'completion37/diagrams.json')['items']+read(P/'supplemental-diagrams.json')['items']:
 path=ROOT/'assets/manufacturing/diagrams'/item['assetFile'];existing[path.stem]=(path,item['captionJa'])
# Existing reference plates already have independently authored exact captions.
for f in (P/'recognition38/core').glob('*.json'):
 for pack in read(f)['packs']:
  for asset in pack['assets']:
   if asset.get('role') in ['quiz','quiz_only']:continue
   path=ROOT/asset['file'];existing[path.stem]=(path,pack['captionJa'])
existing['batch20-electrical-meter-connections']=(ROOT/'assets/manufacturing/diagrams/batch20-electrical-meter-connections.png','理想的な紙上回路で電流計と電圧計の位置関係を比較する。実機への接続・レンジ変更を指示する図ではない。')
for key,(path,caption) in existing.items():
 if not path.exists() or path.read_bytes().startswith(b'version https://git-lfs'):continue
 width,height=Image.open(path).size
 assets[key]={'assetFile':path.name,'assetPath':str(path.relative_to(ROOT)),'width':width,'height':height,'titleJa':key,'captionJa':caption,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'rights':'existing_original_project_teaching_asset','domainReviewed':False,'nativeReviewed':False}
M='''stop-report tool-tray tool-tray training risk ppe risk signs quality-chain four-m qc-control-plan graphs units sampling tensile ndt batch37-mechanical-metrology batch36-caliper-parts batch37-mechanical-metrology batch37-mechanical-drawing batch12-mechanical-dimension-symbols maintenance material heat-cycle machines grinding rolling-extrusion batch37-mechanical-features ohms-law mold paint packaging rolling-extrusion rolling-extrusion rolling-extrusion ph-electrode recycling standards fatigue batch37-mechanical-metrology batch37-mechanical-metrology batch37-mechanical-metrology batch37-mechanical-drawing batch07-mechanical-third-angle batch37-mechanical-features batch12-mechanical-dimension-symbols batch12-mechanical-dimension-symbols batch12-mechanical-geometric-symbols batch37-mechanical-features density ruler-angle height-depth training training stop-report suspended ppe fire stop-report standards quality-chain sampling ac-dc ground-fault motor-transformer material passive semiconductor exam exam signs chemical-signs graphs sampling batch36-indentation ndt batch37-mechanical-metrology batch37-mechanical-features block-gauge batch37-mechanical-drawing batch12-mechanical-dimension-symbols batch12-mechanical-geometric-symbols material heat machines machines grinding mold paint rolling-extrusion rolling-extrusion'''.split()
E='''wire-tools solder batch36-caliper-parts batch37-mechanical-metrology batch20-electrical-meter-connections ohms-law oscilloscope sampling standards risk graphs graphs batch37-mechanical-drawing pcb material passive series-parallel semiconductor ground-fault logic maintenance passive semiconductor computer computer pcb maintenance logic motor-transformer transformer-ratio ground-fault solar hydraulic packaging mold screw cutting batch37-mechanical-metrology batch36-thermocouple cutting cutting batch36-hall exam stop-report tool-tray ppe signs chemical-signs risk four-m graphs qc-control-plan graphs standards units ph-electrode recycling standards standards batch07-mechanical-third-angle batch12-mechanical-dimension-symbols logic material wire-tools solder passive machines ohms-law ac-dc series-parallel batch12-electrical-pn-junction semiconductor batch20-electrical-meter-connections tool-tray logic logic batch12-electrical-time-delays motor-transformer transformer-ratio sampling maintenance packaging mold pcb stop-report batch37-mechanical-drawing batch12-electrical-symbol-bank material screw cutting batch37-mechanical-metrology passive ohms-law logic motor-transformer sampling mold pcb'''.split()
S='''ppe ph-electrode thickness batch37-surface-corrosion plating area-model oxide buff density titration concentration-units precipitation precipitation density material pretreatment batch12-surface-coating-defects hot-dip coating-types wastewater environment batch20-electrical-meter-connections batch37-surface-corrosion color-reference material jig ions charge-efficiency coating-types paint coating-types plating oxide buff buff tool-tray four-m qc-control-plan graphs batch37-surface-corrosion ohms-law series-parallel training risk signs units recycling ph-electrode plating concentration-units ph-electrode ac-dc batch12-surface-right-grip material solder environment coating-types pretreatment hot-dip batch12-surface-coating-defects buff buff thickness quality-chain environment titration precipitation paint oxide buff training density material'''.split()
rows={};used=set()
for specialty,keys in [('mechanical',M),('electrical',E),('surface',S)]:
 ls=read(P/(specialty+'.json'))['lessons'];assert len(keys)==len(ls),(specialty,len(keys),len(ls))
 for l,key in zip(ls,keys):
  assert key in assets,(l['id'],key);used.add(key)
  rows[l['id']]={'lessonId':l['id'],'lessonSourceHash':l['sourceHash'],'keyObjectiveId':l['id']+'::objective','keyObjectiveJa':l['objectiveJa'],'assetId':key,'assetSha256':assets[key]['sha256'],'reuseReasonJa':'本文の「'+l['titleJa']+'」で扱う対象・関係を観察する。図はこの目標の一部を示すもので、本文の適用条件を置き換えない。','captionBinding':'canonical_lesson_summary_plus_asset_scope_limit','sourceRefs':l['sources'],'domainReviewed':False,'nativeReviewed':False,'physicalDeviceTested':False}
(P/'daily-figures.json').write_text(json.dumps({'schemaVersion':1,'rights':'Original project artwork only; no source-page images.','assets':{k:assets[k] for k in sorted(used)},'lessons':rows},ensure_ascii=False,indent=2)+'\n')
lines=["// Static Metro asset declarations. Image bytes load when the reader requests a source.","export const manufacturingDailyFigureSources:Record<string,ReturnType<typeof require>>={"]
for key in sorted(used):lines.append(" "+json.dumps(key)+":require("+json.dumps('../../../'+assets[key]['assetPath'])+"),")
lines.append('};');(ROOT/'src/components/manufacturing/manufacturing-daily-figure-sources.ts').write_text('\n'.join(lines)+'\n')
print({'scheduledDaysBound':len(rows),'uniqueSchematics':len(used),'newSchematicsUsed':len(used&set(read(P/'daily-figure-assets.json')['assets']))})
