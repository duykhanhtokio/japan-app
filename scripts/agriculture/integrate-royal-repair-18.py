import json,hashlib,re
from pathlib import Path
root=Path('.');mp=root/'docs/ssw-workspace/agriculture/royal-repair-18-20261108/manifest.json';m=json.loads(mp.read_text());rows=m['images']
for r in rows:r['assetSha256']=hashlib.sha256((root/r['assetPath']).read_bytes()).hexdigest()
byhash={r['originalSha256']:r for r in rows};bypath={r['originalPath']:r for r in rows}; byid0={r['id']:r for r in rows}
for current in json.loads((root/'src/data/agriculture/recognition-images.json').read_text())['images']:
 if current['id'] in byid0:
  byhash[current['assetSha256']]=byid0[current['id']];bypath[current['assetPath']]=byid0[current['id']]
def update(o):
 if isinstance(o,dict):
  r=next((byhash[v] for v in o.values() if isinstance(v,str) and v in byhash),None) or next((bypath[v] for v in o.values() if isinstance(v,str) and v in bypath),None)
  if r:
   if 'width' in o:o['width']=r['width']
   if 'height' in o:o['height']=r['height']
  return {k:update(v) for k,v in o.items()}
 if isinstance(o,list):return [update(x) for x in o]
 if isinstance(o,str):return byhash[o]['assetSha256'] if o in byhash else bypath[o]['assetPath'] if o in bypath else o
 return o
changed=[]
for p in (root/'src/data/agriculture').rglob('*.json'):
 raw=p.read_text();o=json.loads(raw);new=update(o)
 if o!=new:p.write_text(json.dumps(new,ensure_ascii=False,indent=2)+'\n');changed.append(str(p))
p=root/'src/components/agriculture/RecognitionImages.tsx';s=p.read_text()
for r in rows:s=s.replace('../../../'+r['originalPath'],'../../../'+r['assetPath'])
p.write_text(s)
# All new text masks derive from the final deterministic typography, never old coordinates.
ep=root/'src/data/agriculture/exam-illustrations.json';ed=json.loads(ep.read_text());byid={r['id']:r for r in rows};revisions={}
letter_text={143:{'草丈':'A','節間':'B','本葉':'C','子葉':'D'},144:{'A 徒長苗':'A','B 健苗':'B','C 老化苗':'C'},145:{'水耕':'A','ロックウール耕':'B','れき耕':'C','水気耕':'D'},161:{'棒状温度計':'A','最高最低温度計':'B','デジタル温度計':'C'},181:{'地床育苗：地面の苗床':'A','箱育苗：共通の床土':'B','ポット育苗：個々のポット':'C','セル成型育苗：区切られた穴':'D'}}
for e in ed['illustrations']:
 if e['figureId'] not in byid:continue
 r=byid[e['figureId']];w,h=r['width'],r['height'];masks=[{'x':0,'y':0,'width':1,'height':r['headerHeight']/h,'backgroundColor':'#fbf3de'}]
 for b in r['annotationBoxes']:
  if b['text']=='12.0 °C':continue
  x=max(0,b['x']-3);y=max(0,b['y']-3);rw=min(w-x,b['width']+6);rh=min(h-y,b['height']+6)
  mask={'x':x/w,'y':y/h,'width':rw/w,'height':rh/h,'backgroundColor':'#fff6e1'}
  letter=letter_text.get(r['index'],{}).get(b['text'])
  if letter:mask['label']=letter
  masks.append(mask)
 masks.append({'x':0,'y':1-r['footerHeight']/h,'width':1,'height':r['footerHeight']/h,'backgroundColor':'#fbf3de'})
 e['masks']=masks;e['revision']='v3-royal18-20261108';revisions[e['id']]=e['revision']
ep.write_text(json.dumps(ed,ensure_ascii=False,indent=2)+'\n')
qp=root/'src/data/agriculture/mock-exams.ja.json';qd=json.loads(qp.read_text());count=0
for e in qd['exams']:
 for q in e['questions']:
  if q.get('illustrationId') in revisions:q['illustrationRevision']=revisions[q['illustrationId']];count+=1
qp.write_text(json.dumps(qd,ensure_ascii=False,indent=2)+'\n')
m['integration']={'quizIllustrationsRebound':len(revisions),'questionAssociationsRebound':count,'metadataFilesRebound':changed,'reviewStatus':'AI_visual_and_structural_review_only','nativeReviewed':False,'domainReviewed':False,'physicalDeviceTested':False};mp.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n');print(json.dumps(m['integration'],ensure_ascii=False,indent=2))
