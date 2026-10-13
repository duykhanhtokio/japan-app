import json, sys, hashlib
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
work = root / 'docs/ssw-workspace/kensetsu'
items = json.loads(Path(sys.argv[1]).read_text())
manifest_path = work / 'weekly-image-production.json'
manifest = json.loads(manifest_path.read_text())
weeks = {x['week'] for x in items}
assert len(weeks) == 1 and len(items) in (2, 3)
week = next(iter(weeks))
assert not any(x['week'] == week for x in manifest['images'])
for item in items:
    source = Path(item['sourcePath'])
    image = Image.open(source)
    path = 'assets/kensetsu/weekly/' + item['id'] + '.webp'
    target = root / path
    assert not target.exists()
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, 'WEBP', quality=88, method=6)
    lesson_path = work / f"shared-session-{item['session']:03}.json"
    lesson = json.loads(lesson_path.read_text())
    cluster_id = lesson['id'] + f"-cluster-{item['cluster']}"
    assert any(x['id'] == cluster_id for x in lesson['clusters'])
    lesson.setdefault('illustrations', []).append({'path':path,'clusterId':cluster_id,'altJa':item['caption']})
    lesson['illustrationStatus'] = 'weekly_selected_image_AI_visual_check;human_review_pending'
    lesson['contentRevision'] += 1
    lesson_path.write_text(json.dumps(lesson, ensure_ascii=False, indent=2)+'\n')
    manifest['images'].append({'id':item['id'],'week':week,'sessionId':lesson['id'],'clusterId':cluster_id,'assetPath':path,'width':image.width,'height':image.height,'captionJa':item['caption'],'prompt':item['prompt'],'visualQA':item['visualQA'],'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'humanReview':False})
manifest['completedWeeks'] = sorted(set(manifest['completedWeeks'] + [week]))
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
registry = root / 'src/data/kensetsu/weekly-illustrations.ts'
registry.write_text("import type {ImageSourcePropType} from 'react-native';\nexport const weeklyIllustrations:Record<string,ImageSourcePropType>={\n"+''.join(" '"+x['assetPath']+"':require('../../../"+x['assetPath']+"'),\n" for x in manifest['images'])+"};\nexport const weeklyIllustrationAspectRatios:Record<string,number>={\n"+''.join(" '"+x['assetPath']+"':"+str(x['width']/x['height'])+",\n" for x in manifest['images'])+"};\n")
print(f'Attached week{week}: {len(items)} images; progress revisions preserved; {len(manifest["images"])} generated assets in registry')
