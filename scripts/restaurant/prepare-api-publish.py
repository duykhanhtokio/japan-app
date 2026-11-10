"""Prepare a narrow, validated Git tree for an authorized GitHub Git Data API publish.
This script never authenticates, sends network requests, moves refs, or changes files.
API calls remain explicit connector operations. Binary/LFS updates require Git LFS transport.
"""
from pathlib import Path
import argparse,subprocess,json,base64,re
ROOT=Path(__file__).resolve().parents[2]
PREFIXES=('src/data/restaurant/','src/components/restaurant/','docs/ssw-workspace/restaurant/','scripts/restaurant/')
EXACT={'src/services/restaurant-study-state.ts','src/app/specified-skills/restaurant.tsx','src/app/specified-skills/index.tsx'}
def git(*args,binary=False):
 return subprocess.check_output(['git',*args],cwd=ROOT,text=not binary).strip() if not binary else subprocess.check_output(['git',*args],cwd=ROOT)
def prepare():
 branch=git('branch','--show-current')
 if branch!='feature/restaurant-20261026':raise SystemExit('Wrong restaurant branch')
 paths=git('diff','--cached','--name-only').splitlines()
 if not paths:raise SystemExit('No staged restaurant changes')
 if git('diff','--name-only'):raise SystemExit('Unstaged changes remain; freeze/review first')
 entries=[]
 for name in paths:
  if not name.startswith(PREFIXES) and name not in EXACT:raise SystemExit('Out-of-scope staged path: '+name)
  line=git('ls-files','--stage','--',name)
  if not line:raise SystemExit('Deletion not authorized by this publisher: '+name)
  mode,sha,stage=line.split('\t',1)[0].split()
  if stage!='0' or mode not in ('100644','100755'):raise SystemExit('Unmerged/nonregular path')
  data=git('cat-file','blob',sha,binary=True)
  if data.startswith(b'version https://git-lfs.github.com/spec/v1\n'):raise SystemExit('Changed LFS pointer needs authenticated Git LFS transport: '+name)
  try:data.decode('utf-8')
  except UnicodeDecodeError:raise SystemExit('Binary update requires explicit binary transport: '+name)
  entries.append({'path':name,'mode':mode,'type':'blob','sha':sha,'size':len(data)})
 return {'schemaVersion':1,'repository':'duykhanhtokio/japan-app','branch':branch,'parent':git('rev-parse','HEAD'),'baseTree':git('rev-parse','HEAD^{tree}'),'tree':git('write-tree'),'files':entries,'policy':'Upload matching blobs; require exact local tree SHA; create child commit; nonforce update with expected parent; fetch and fast-forward only if index matches remote tree.'}
def chunk(manifest,sha,offset,length):
 x=json.loads(Path(manifest).read_text())
 if not re.fullmatch('[a-f0-9]{40}',sha) or sha not in {v['sha'] for v in x['files']}:raise SystemExit('Blob not in reviewed publication manifest')
 if offset<0 or not 0<length<=24576:raise SystemExit('Invalid chunk')
 data=git('cat-file','blob',sha,binary=True)
 print(base64.b64encode(data[offset:offset+length]).decode())
if __name__=='__main__':
 p=argparse.ArgumentParser();sub=p.add_subparsers(dest='command',required=True)
 sub.add_parser('prepare');q=sub.add_parser('chunk');q.add_argument('manifest');q.add_argument('sha');q.add_argument('offset',type=int);q.add_argument('length',type=int);a=p.parse_args()
 if a.command=='prepare':print(json.dumps(prepare(),ensure_ascii=False))
 else:chunk(a.manifest,a.sha,a.offset,a.length)
