"""Local-only negative controls for the explicit connector-publication preparer."""
from pathlib import Path
import tempfile,subprocess,importlib.util,json,base64,contextlib,io
ROOT=Path(__file__).resolve().parents[2]
spec=importlib.util.spec_from_file_location('publisher',ROOT/'scripts/restaurant/prepare-api-publish.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
p=Path(tempfile.mkdtemp(prefix='restaurant-api-prepare-'));m.ROOT=p

def git(*a):return subprocess.check_output(['git',*a],cwd=p,stderr=subprocess.STDOUT,text=True).strip()
def reject(action,expected):
 action()
 try:m.prepare()
 except SystemExit as e:assert expected in str(e),(expected,e)
 else:raise AssertionError('unsafe publication accepted')
git('init','-b','feature/restaurant-20261026');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');q=p/'src/data/restaurant/test.json';q.parent.mkdir(parents=True);q.write_text('{}\n');git('add','.');git('commit','-m','Fixture base')
q.write_text('{"v":1}\n');git('add',str(q.relative_to(p)));x=m.prepare();assert len(x['files'])==1 and x['tree']==git('write-tree')
manifest=p/'manifest.json';manifest.write_text(json.dumps(x));buf=io.StringIO()
with contextlib.redirect_stdout(buf):m.chunk(str(manifest),x['files'][0]['sha'],0,24576)
assert base64.b64decode(buf.getvalue())==q.read_bytes()
q.write_text('{"v":2}\n');reject(lambda:None,'Unstaged changes');q.write_text('{"v":1}\n')
other=p/'other.txt';other.write_text('unrelated');git('add','other.txt');reject(lambda:None,'Out-of-scope');git('restore','--staged','other.txt')
# Restore is used only inside the disposable fixture, never the project.
lfs=p/'src/data/restaurant/pointer.txt';lfs.write_text('version https://git-lfs.github.com/spec/v1\noid sha256:'+'a'*64+'\nsize 10\n');git('add',str(lfs.relative_to(p)));reject(lambda:None,'Changed LFS pointer');git('restore','--staged',str(lfs.relative_to(p)))
q.unlink();git('add','-u',str(q.relative_to(p)));reject(lambda:None,'Deletion not authorized')
report={'status':'PASS_LOCAL_FIXTURES','cases':['exact staged tree prepared','whitelisted chunk reconstructs bytes','unstaged edits rejected','unrelated staged path rejected','changed LFS pointer rejected','deletions rejected'],'networkWrites':False,'projectRefsMoved':False}
(ROOT/'docs/ssw-workspace/restaurant/api-publish-prepare-qa.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
