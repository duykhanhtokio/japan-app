import json,hashlib
from pathlib import Path
B=Path(__file__).resolve().parents[2];R=B/'translations/my-th-receipts'
fixes={('my','rst31-hygiene2-q024'):'2023ဇယားတစ်ခုတည်းဖြင့်2026အောက်တိုဘာအညွှန်းစစ်မည့်အယူကို စာတမ်းအခြေအနေနှင့်လက်တွေ့ထိန်းချုပ်မှုခွဲ၍ဆုံးဖြတ်ရန်။',('th','rst31-hygiene2-q024'):'พิจารณาการใช้ตารางปี2023อย่างเดียวตรวจฉลากเดือนตุลาคม2026 โดยแยกเงื่อนไขในเอกสารกับการควบคุมหน้างาน',('my','rst31-hygiene2-q045'):'အတိတ်နိုင်ငံလုံးစာရင်းတွင်2021၌717ဖြစ်ရပ်နှင့်11080ဦး၊2022၌962ဖြစ်ရပ်နှင့်6856ဦးရှိခဲ့ခြင်းကို စာတမ်းအခြေအနေနှင့်လက်တွေ့ထိန်းချုပ်မှုခွဲ၍ဆုံးဖြတ်ရန်။',('th','rst31-hygiene2-q045'):'พิจารณาสถิติทั่วประเทศในอดีตที่ปี2021มี717เหตุการณ์กับ11080คน และปี2022มี962เหตุการณ์กับ6856คน โดยแยกเงื่อนไขในเอกสารกับการควบคุมหน้างาน'}
for (l,id),v in fixes.items():
 p=B/f'translations/{l}/hygiene2.json';d=json.loads(p.read_text());d['items'][id]['objective']=v;p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 for rp in R.glob(f'{l}-hygiene2-q*.json'):
  rd=json.loads(rp.read_text())
  if id in rd:rd[id]['objective']=v;rp.write_text(json.dumps(rd,ensure_ascii=False,indent=2)+'\n')
p=B/'translations/th/service1.json';d=json.loads(p.read_text());d['items']['rst31-service1-a019']['text']=d['items']['rst31-service1-a019']['text'].replace('เหรียญอ่าน1,5,10,50,100,500เยน','เหรียญอ่านมูลค่า 1 / 5 / 10 / 50 / 100 / 500 เยน');p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
p=R/'th-service1-sections2.json';s=p.read_text().replace('เหรียญอ่าน1,5,10,50,100,500เยน','เหรียญอ่านมูลค่า 1 / 5 / 10 / 50 / 100 / 500 เยน');p.write_text(s)
flags=[r for r in json.loads((B/'translation-number-screen.json').read_text())['flags'] if r['locale'] in ['my','th'] and not r['id'].startswith('rst31-cooking1')]
out=[]
for r in flags:
 l,id,f=r['locale'],r['id'],r['field'];decision='valid_equivalent';note=''
 if (l,id) in fixes and f=='objective':decision='fixed_omission';note='Restored October2026 or exact historical717/11080 and962/6856 counts omitted from objective; sourceHash unchanged.'
 elif 'noro-source-scope' in id or id=='rst31-hygiene2-q049':note='8割 is written naturally as eight in ten (ဆယ်ပုံရှစ်ပုံ / แปดในสิบ); November11 is named နိုဝင်ဘာ / พฤศจิกายน. Both numeric scope and date retained.'
 elif 'mop-window' in id or id.endswith('q030'):note='Figure-eight movement retained as Thai เลขแปด, not a missing eight.'
 elif id=='rst31-hygiene2-figure-reference-form-exercise':note='3項目 retained as Burmese သုံးချက် (three items).'
 elif id=='rst31-service1-a019':decision='readability_fix';note='Coin values all present; replaced comma-adjacent list with spaced slashes to avoid digit-token merging. 富嶽三十六景 translated with36; not a new numerical claim.'
 elif id=='rst31-service1-mof-1000-r':note='36 is explicitly present as Japanese word numeral 三十六 in artwork-series title; target uses Arabic36. Denomination and source-year retained.'
 else:note='Named months preserve numeric Japanese dates: April4=ဧပြီ/เมษายน; March3=မတ်/มีนาคม; October10=အောက်တိုဘာ/ตุลาคม. Year/day/end-of-month retained.'
 out.append({'locale':l,'id':id,'field':f,'decision':decision,'contextNote':note,'screenTargetSha256':hashlib.sha256(r['target'].encode()).hexdigest()})
(R/'number-dispositions.json').write_text(json.dumps({'schemaVersion':1,'reviewedFlags':len(out),'dispositions':out,'nativeReviewed':False,'humanReviewed':False,'domainReviewed':False},ensure_ascii=False,indent=2)+'\n')
print('Reviewed',len(out),'flags;',sum(x['decision']=='fixed_omission' for x in out),'actual omissions fixed')
