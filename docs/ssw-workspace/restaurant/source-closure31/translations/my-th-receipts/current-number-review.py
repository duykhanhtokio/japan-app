from pathlib import Path
import json,re,hashlib
B=Path(__file__).resolve().parents[2];R=B/'translations/my-th-receipts';screen=json.loads((B/'translation-number-screen.json').read_text());rows=[]
for f in screen['flags']:
 l,id,field=f['locale'],f['id'],f['field']
 if not (l in ['my','th'] and not id.startswith('rst31-cooking1') and not(l=='my' and id.startswith('rst31-service1')) or l in ['ne','km'] and id.startswith('rst31-service1')):continue
 p=next(p for p in (B/f'translations/{l}').glob('*.json') if id in json.loads(p.read_text()).get('items',{}));v=json.loads(p.read_text())['items'][id];m=re.fullmatch(r'(\w+)\[(\d+)\]',field);s=v[m[1]][int(m[2])] if m else v[field]
 if id.endswith('q005') and field.startswith('reasons'):decision='fixed_omission';note='Restored exact approximately1m gaze distance for敬礼; previously default correct explanation omitted that distance.'
 elif id.endswith('q024') and field=='objective':decision='fixed_omission';note='October2026 restored explicitly; named month အောက်တိုဘာ/ตุลาคม equals10月. Year and only2023table scope retained.'
 elif id.endswith('q045') and field=='objective':decision='fixed_omission';note='Restored all historical2021:717events11080people and2022:962events6856people in objective.'
 elif 'noro-source-scope' in id or id.endswith('q049'):decision='valid_equivalent';note='8割 is eight in ten written asဆယ်ပုံရှစ်ပုံ orแปดในสิบ; November11 is named နိုဝင်ဘာ/พฤศจิกายน. Historical date and causal-scope distinctions retained.'
 elif 'mop-window' in id or id.endswith('q030'):decision='valid_equivalent';note='Thaiเลขแปด expresses numeral8 for figure-eight mopping movement.'
 elif 'reference-form-exercise' in id:decision='valid_equivalent';note='Burmeseသုံးချက် means3items; denominator-exclusion and achieved score retained.'
 elif 'mof-1000-r' in id:decision='valid_equivalent';note='Japanese title富嶽三十六景 already contains36 as word numeral; target36 is same artwork series, not an added count. Denomination/year retained.'
 elif id.endswith('a019'):decision='valid_equivalent';note='All denomination values1,5,10,50,100,500 plus banknotes and repeated500 context are present; Japanese word numerals converted to Arabic.36 is三十六 in artwork title; slash-separated coin list avoids comma-token merging.'
 elif id.endswith('q007'):decision='valid_equivalent';note='Rightangle is equivalent90degrees; current Khmer usesមុំកែង without added digit. Palm-center support and fingers spread retained.'
 else:decision='valid_equivalent';note='Japanese month digits are written as named months:April=अप्रिल/មេសា/เมษายน/ဧပြီ,March=मार्च/មីនា/มีนาคม/မတ်,October=अक्टोबर/តុលា/ตุลาคม/အောက်တိုဘာ. Exact year,day or end-of-month is retained; no numeric omission.'
 rows.append(dict(locale=l,id=id,field=field,targetFieldSha256=hashlib.sha256(s.encode()).hexdigest(),decision=decision,contextNote=note))
(R/'current-numeric-dispositions.json').write_text(json.dumps(dict(schemaVersion=1,reviewedFields=len(rows),dispositions=rows,humanReviewed=False,nativeReviewed=False,domainReviewed=False),ensure_ascii=False,indent=2)+'\n');print('Exact current field reviews:',len(rows))
