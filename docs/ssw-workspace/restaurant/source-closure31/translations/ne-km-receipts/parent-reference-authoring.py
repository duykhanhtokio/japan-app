from pathlib import Path
import json,hashlib
D=Path(__file__).resolve().parents[2];source=D/'canonical-ja.json';raw=source.read_bytes();items=json.loads(raw)['items'];rows={}
marks={'assistance':('सहयोगी कुकुर चिह्न','សញ្ញាឆ្កែជំនួយ'),'ear':('कानको चिह्न','សញ្ញាត្រចៀក'),'ostomate':('ओस्टोमेट चिह्न','សញ្ញាអូស្តូម៉េត'),'heart':('हार्ट प्लस चिह्न','សញ្ញា Heart Plus'),'help':('हेल्प मार्क','សញ្ញា Help Mark'),'maternity':('मातृत्व चिह्न','សញ្ញាមាតុភាព')}
for tag,(ne,km) in marks.items():
 rows['rst31-service1-link-'+tag]=[(f'{ne} आधिकारिक वेबसाइटमा जाँच्नुहोस्',f'{ne}को आधिकारिक आकार र विवरण अधिकारधारक वा सरकारी निकायको आधिकारिक वेबसाइटमा जाँच्नुहोस्।'),(f'ពិនិត្យ{km}នៅលើគេហទំព័រផ្លូវការ',f'ពិនិត្យរូបរាង និងការពន្យល់ផ្លូវការរបស់{km}នៅលើគេហទំព័រផ្លូវការរបស់ម្ចាស់សិទ្ធិ ឬស្ថាប័នរដ្ឋ។')]
common_ne='अग्नि तथा विपद् व्यवस्थापन निकायको आधिकारिक भिडियो सामग्रीमा लक्षित व्यक्ति, शरीरको स्थिति र क्रम जाँच्नुहोस्। व्यावहारिक सीप जीवनरक्षा तालिममा अभ्यास गर्नुहोस्।'
common_km='ពិនិត្យអ្នកដែលវិធីនេះអនុវត្តចំពោះ ឥរិយាបថ និងលំដាប់ជំហានក្នុងវីដេអូផ្លូវការរបស់ទីភ្នាក់ងារគ្រប់គ្រងអគ្គិភ័យ និងគ្រោះមហន្តរាយជប៉ុន។ ត្រូវហាត់ជំនាញអនុវត្តក្នុងវគ្គសង្គ្រោះជីវិត។'
rows['rst31-service1-link-choking-conscious']=[('प्रतिक्रिया दिइरहेको व्यक्तिको श्वासनलीबाट अड्किएको वस्तु हटाउने आधिकारिक सामग्री',common_ne),('ឯកសារផ្លូវការអំពីការយកវត្ថុស្ទះផ្លូវដង្ហើមចេញពេលអ្នកជំងឺនៅឆ្លើយតប',common_km)]
rows['rst31-service1-link-choking-unresponsive']=[('प्रतिक्रिया नदिने व्यक्तिको श्वासनलीबाट अड्किएको वस्तु हटाउने आधिकारिक सामग्री',common_ne),('ឯកសារផ្លូវការអំពីការយកវត្ថុស្ទះផ្លូវដង្ហើមចេញពេលអ្នកជំងឺមិនឆ្លើយតប',common_km)]
rows['rst31-service1-link-recovery']=[('रिकभरी पोजिसनबारे आधिकारिक सामग्री',common_ne),('ឯកសារផ្លូវការអំពីឥរិយាបថសម្រាកសុវត្ថិភាព',common_km)]
rows['rst31-service1-link-infant-current']=[('शिशुको विधि नवीनतम आधिकारिक सामग्रीमा जाँच्नुहोस्','शिशुको विधि वयस्कको भन्दा फरक हुन्छ। JRC2025 मा आधारित बालबालिका तथा परिवार एजेन्सीका नवीनतम चित्र र आधिकारिक भिडियोको मार्गदर्शन हेर्नुहोस्।'),('ពិនិត្យវិធីសម្រាប់ទារកក្នុងឯកសារផ្លូវការថ្មីបំផុត','វិធីសម្រាប់ទារកខុសពីមនុស្សពេញវ័យ។ សូមពិនិត្យរូបណែនាំថ្មីបំផុត និងតំណទៅវីដេអូផ្លូវការរបស់ទីភ្នាក់ងារកុមារ និងគ្រួសារជប៉ុន ដែលផ្អែកលើ JRC2025។')]
rows['rst31-hygiene2-link-noro-2017']=[('2017 को सूचना आधिकारिक वेबसाइटमा जाँच्नुहोस्','विषय र समय नबदली व्याख्या गर्न स्वास्थ्य, श्रम तथा कल्याण मन्त्रालयको त्यस समयको सूचना जाँच्नुहोस्।'),('ពិនិត្យសេចក្ដីជូនដំណឹងឆ្នាំ 2017 នៅលើគេហទំព័រផ្លូវការ','ពិនិត្យសេចក្ដីជូនដំណឹងរបស់ក្រសួងសុខាភិបាល ការងារ និងសុខុមាលភាពជប៉ុននៅសម័យនោះ ដើម្បីពន្យល់ដោយរក្សាវិសាលភាព និងពេលវេលារបស់ប្រភព។')]
for index,locale in enumerate(['ne','km']):
 file=D/'translations'/locale/'integration.json';d=json.loads(file.read_text())if file.exists()else dict(schemaVersion=1,locale=locale,shard='integration',canonicalFile='canonical-ja.json',canonicalSha256=hashlib.sha256(raw).hexdigest(),nativeReviewed=False,domainReviewed=False,items={});count=0
 known={}
 for f in (D/'translations'/locale).glob('*.json'):
  other=json.loads(f.read_text())
  if isinstance(other,dict):known.update(other.get('items',{}))
 for id,pair in rows.items():
  s=items[id];assert s['kind']=='reference'
  if id in known:continue
  title,text=pair[index];d['items'][id]=dict(sourceHash=s['sourceHash'],title=title,text=text);count+=1
 file.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');print(locale,'new official reference translations',count)
