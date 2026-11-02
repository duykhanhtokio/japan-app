#!/usr/bin/env python3
"""Add source-checked identifiers and concise-sender objectives without changing IDs."""
import pathlib,json,hashlib,copy
R=pathlib.Path(__file__).resolve().parents[2];base=R/'src/data/kaigo/japanese-master';p=base/'week-25.json';x=json.loads(p.read_text());s=x['sections']['kaigo-depth-team-handoff'];oldhash=hashlib.sha256(p.read_bytes()).hexdigest()
texts={
'ja':['送り手は、必要な要点を簡潔に伝えます。','氏名、住所、電話番号、本人の写真は、いずれも個人情報です。'],
'en':['The sender communicates the necessary key points concisely.','Names, addresses, telephone numbers and photographs of the person are all personal information.'],
'vi':['Người truyền đạt cần nêu ngắn gọn những ý chính cần thiết.','Họ tên, địa chỉ, số điện thoại và ảnh của người sử dụng đều là thông tin cá nhân.'],
'id':['Pemberi informasi menyampaikan pokok-pokok yang diperlukan secara ringkas.','Nama, alamat, nomor telepon, dan foto orang tersebut semuanya merupakan informasi pribadi.'],
'zh-CN':['发送信息的人应简明地传达必要的要点。','姓名、地址、电话号码及本人的照片都属于个人信息。'],
'zh-TW':['傳達資訊的人應簡潔地說明必要的重點。','姓名、地址、電話號碼及本人的照片都屬於個人資訊。'],
'hi':['जानकारी देने वाला व्यक्ति ज़रूरी मुख्य बातें संक्षेप में बताता है।','नाम, पता, टेलीफ़ोन नंबर और संबंधित व्यक्ति की तस्वीरें सभी व्यक्तिगत जानकारी हैं।'],
'bn':['তথ্যদাতা প্রয়োজনীয় মূল কথাগুলো সংক্ষেপে জানান।','নাম, ঠিকানা, টেলিফোন নম্বর এবং সংশ্লিষ্ট ব্যক্তির ছবি—সবই ব্যক্তিগত তথ্য।'],
'ne':['जानकारी दिने व्यक्तिले आवश्यक मुख्य कुरा संक्षेपमा बताउँछन्।','नाम, ठेगाना, टेलिफोन नम्बर र सम्बन्धित व्यक्तिको तस्बिर सबै व्यक्तिगत जानकारी हुन्।'],
'my':['သတင်းပေးပို့သူသည် လိုအပ်သော အဓိကအချက်များကို တိုတိုရှင်းရှင်း ပြောပြသည်။','အမည်၊ လိပ်စာ၊ ဖုန်းနံပါတ်နှင့် ကာယကံရှင်၏ ဓာတ်ပုံတို့သည် ကိုယ်ရေးအချက်အလက်များ ဖြစ်သည်။'],
'th':['ผู้ส่งข้อมูลสื่อสารประเด็นสำคัญที่จำเป็นอย่างกระชับ','ชื่อ ที่อยู่ หมายเลขโทรศัพท์ และภาพถ่ายของเจ้าตัวล้วนเป็นข้อมูลส่วนบุคคล'],
'km':['អ្នកផ្តល់ព័ត៌មានត្រូវប្រាប់ចំណុចសំខាន់ៗដែលចាំបាច់ឱ្យបានខ្លី និងច្បាស់លាស់។','ឈ្មោះ អាសយដ្ឋាន លេខទូរសព្ទ និងរូបថតរបស់បុគ្គលនោះ សុទ្ធតែជាព័ត៌មានផ្ទាល់ខ្លួន។'],
'tl':['Maikling ipinapahayag ng nagpapadala ang mahahalagang impormasyong kailangan.','Ang pangalan, tirahan, numero ng telepono at mga larawan ng tao ay pawang personal na impormasyon.']}
rubies=[ [('送り手','おくりて'),('は、',None),('必要','ひつよう'),('な',None),('要点','ようてん'),('を',None),('簡潔','かんけつ'),('に',None),('伝え','つたえ'),('ます。\n',None)], [('氏名','しめい'),('、',None),('住所','じゅうしょ'),('、',None),('電話番号','でんわばんごう'),('、',None),('本人','ほんにん'),('の',None),('写真','しゃしん'),('は、いずれも',None),('個人情報','こじんじょうほう'),('です。\n',None)] ]
records=[]
for j,i in enumerate([6,7]):
 prefix=texts['ja'][j]+'\n'
 if s['paragraphsJa'][i].startswith(prefix):continue
 old=s['paragraphsJa'][i];before=copy.deepcopy(s['paragraphsRuby'][i]);s['paragraphsJa'][i]=prefix+old;s['paragraphsRuby'][i]=[dict(text=t,**({'readingKana':r} if r else {})) for t,r in rubies[j]]+before
 assert ''.join(t['text'] for t in s['paragraphsRuby'][i])==s['paragraphsJa'][i]
 records.append({'paragraphIndex':i,'before':old,'after':s['paragraphsJa'][i]})
if not records:print('Already applied');raise SystemExit
p.write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n');newhash=hashlib.sha256(p.read_bytes()).hexdigest()
for loc,v in texts.items():
 if loc=='ja':continue
 t=base/'translations'/f'week-25.{loc}.json';d=json.loads(t.read_text());ps=d['sections']['kaigo-depth-team-handoff']['paragraphs']
 for j,i in enumerate([6,7]):ps[i]=v[j]+'\n'+ps[i]
 t.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
# Questions unchanged: additions explicitly teach two previously implicit objectives;
# all existing questions remain supported by the unchanged paragraphs and options.
for path in [base/'questions/week-25.json']:
 d=json.loads(path.read_text());assert d['sourceJapaneseSha256']==oldhash;questions=copy.deepcopy(d['questions']);d['sourceJapaneseSha256']=newhash;assert d['questions']==questions;path.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
receipt={'schemaVersion':1,'sector':'kaigo','sourcePdfPages':[119,120],'week':25,'sectionId':'kaigo-depth-team-handoff','beforeSourceSha256':oldhash,'afterSourceSha256':newhash,'changes':records,'translationsDirectFromJa':list(texts)[1:],'rubyManuallyChecked':True,'questionPayloadChanged':False,'assessmentForNewObjectives':'pending separate direct acceptance','review':'self_checked_ai; additions are factual and nonprocedural; existing questions/options/answers unchanged','domainReviewed':False,'nativeReviewed':False}
(R/'docs/ssw-workspace/source-coverage-v2/kaigo-communication-teaching-patch.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n');print('Added 2 source objectives, 12 locales, manually checked ruby')
