from pathlib import Path
import json
R=Path('/workspace/scratch/de85e7c60a94/manufacturing-complete');P=Path(__file__).parent;S=json.load(open(R/'src/data/manufacturing/electrical.json'));SOURCE={int(l['id'][-3:]):l for l in S['lessons']}
def write(D,name):
 out={}
 for n,t in D.items():
  s=SOURCE[n];title,obj,paras,meaning,action=t;assert len(paras)==len(s['paragraphs'])
  out[s['id']]={'sourceHash':s['sourceHash'],'translatedDirectlyFrom':'ja','nativeReviewed':False,'domainReviewed':False,'status':'ai_translated_draft','title':title,'objective':obj,'paragraphs':[{'id':x['id'],'title':a,'text':b}for x,(a,b)in zip(s['paragraphs'],paras)],'terms':[{'ja':x['ja'],'reading':x['reading'],'meaning':meaning}for x in s['terms']],'activity':'30 মিনিটের শিক্ষালক্ষ্য: মূল পাঠ বোঝা10মিনিট,উদাহরণ সাজানো8মিনিট,লিখিত কাজ9মিনিট,ফিরে দেখা3মিনিট।\n'+action,'safety':['সরঞ্জাম চালনা,পরিমাপ,প্রক্রিয়াকরণ ও সেটিংবদলের আগে যোগ্যতা,শিক্ষা,দায়িত্বের সীমা ও অনুমোদিত পদ্ধতি নিশ্চিত করবেন।'],'summary':title+' বিষয়ে শুধু নাম নয়,গঠন,ব্যবহার ও প্রয়োগশর্ত মেলাতে হয়।'}
 # Update original payloads in place, avoiding conflicting additional lesson entries.
 for f in P.glob('bn-electrical-lessons-*.json'):
  d=json.loads(f.read_text());changes=set(d.get('lessons',{}))&set(out)
  if changes:
   for k in changes:d['lessons'][k]=out[k]
   f.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
 print('Expanded supplements',sorted(D))
