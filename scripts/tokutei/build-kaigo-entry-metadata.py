"""Extract exact existing Japanese lesson metadata; never author or alter content."""
import argparse,hashlib,json,pathlib
root=pathlib.Path(__file__).resolve().parents[2]
def build():
 lessons={};sources={}
 for week in range(1,27):
  name=f'src/data/kaigo/japanese-master/week-{week:02}.json';raw=(root/name).read_bytes();sources[name]=hashlib.sha256(raw).hexdigest();lessons.update(json.loads(raw)['lessons'])
 return {'schemaVersion':1,'sources':sources,'lessons':lessons}
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');a=p.parse_args();target=root/'src/data/kaigo/entry-lesson-metadata.json';value=build()
 if a.check:assert json.loads(target.read_text())==value,'Kaigo entry metadata differs from its canonical master batches'
 else:target.write_text(json.dumps(value,ensure_ascii=False,separators=(',',':'))+'\n')
 print('PASS exact Kaigo entry metadata:',len(value['lessons']),'entries')
