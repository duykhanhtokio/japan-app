from pathlib import Path
import json
OUT=Path(__file__).parent
# Reapply the four source-bound numeric/torque corrections after author regeneration.
for patch in json.loads((OUT/'reviewed-mock-patches-qa.json').read_text()):
 p=OUT/patch['file'];d=json.loads(p.read_text());q=d['questions'][patch['id']]
 assert q['sourceHash']==patch['sourceHash']
 q['reasons']=patch['reasons']
 p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
