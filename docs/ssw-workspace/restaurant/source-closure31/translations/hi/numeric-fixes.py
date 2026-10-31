from pathlib import Path
import json,hashlib
B=Path(__file__).resolve().parents[2]
fixes=[('cooking-service2','rst31-cooking-service2-q021','objective','2023 संस्करण में उद्धृत ','2023 সংস্করণে উদ্ধৃত '),('hygiene2','rst31-hygiene2-q030','objective',None,None),('hygiene2','rst31-hygiene2-q045','objective',None,None)]
records=[]
for shard,id,field,h,b in fixes:
 for loc,prefix in [('hi',h),('bn',b)]:
  p=B/'translations'/loc/f'{shard}.json';j=json.loads(p.read_text());before=j['items'][id][field]
  if id.endswith('q021'):after=before if before.startswith(prefix) else prefix+before
  elif id.endswith('q030'):after=('स्रोत की कमरे के तापमान वाले उत्पादों की15–25℃शर्त ठंडे सलाद पर लागू करने में स्रोत और वास्तविक प्रबंधन का भेद करें।'if loc=='hi'else'উৎসের ঘরের তাপমাত্রার পণ্যের15–25℃শর্ত ঠান্ডা সালাদে প্রয়োগে উৎস ও বাস্তব ব্যবস্থাপনার পার্থক্য করা।')
  else:after=('पुराने राष्ट्रीय आँकड़ों में2021में717घटनाएँ/11080रोगी और2022में962घटनाएँ/6856रोगी होने पर स्रोत की शर्तों और वास्तविक प्रबंधन का भेद करें।'if loc=='hi'else'পুরোনো জাতীয় তথ্যে2021এ717ঘটনা/11080রোগী ও2022এ962ঘটনা/6856রোগীতে উৎসের শর্ত ও বাস্তব ব্যবস্থাপনার পার্থক্য করা।')
  j['items'][id][field]=after;p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n');records.append({'locale':loc,'id':id,'field':field,'before':before,'after':after,'reason':'Restore omitted source provenance/explicit numerical condition; no source/key/order change.'})
for loc in ['hi','bn']:
 p=B/'translations'/loc/'service1.json';j=json.loads(p.read_text());v=j['items']['rst31-service1-a019'];before=v['text'];v['text']=before if ('फूजी के36दृश्यों' in before or 'ফুজির36দৃশ্যের' in before) else before.replace('कानागावा की विशाल लहर का चित्र','फूजी के36दृश्यों की कानागावा की विशाल लहर का चित्र')if loc=='hi'else before.replace('কানাগাওয়ার বিশাল ঢেউ।','ফুজির36দৃশ্যের কানাগাওয়ার বিশাল ঢেউ।');p.write_text(json.dumps(j,ensure_ascii=False,indent=2)+'\n');records.append({'locale':loc,'id':'rst31-service1-a019','field':'text','before':before,'after':v['text'],'reason':'Restore full artwork-series title,36views,explicitly present in source kanji.'})
(B/'translations/hi/numeric-corrections.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
