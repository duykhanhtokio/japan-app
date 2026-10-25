"""Restore only verified existing NPC clips from the same public repository."""
import concurrent.futures,hashlib,json,pathlib,subprocess,sys
root=pathlib.Path(__file__).resolve().parents[3];commit=sys.argv[1];folder=root/'assets/dialogue-voice'
def restore(meta):
 d=json.loads(meta.read_text());target=meta.with_suffix('.mp3')
 if target.exists() and hashlib.sha256(target.read_bytes()).hexdigest()==d['sha256']:return
 url=f'https://media.githubusercontent.com/media/duykhanhtokio/japan-app/{commit}/assets/dialogue-voice/{target.name}'
 subprocess.run(['curl','--fail','--silent','--show-error','--location','--max-time','120','--output',str(target)+'.download',url],check=True)
 tmp=pathlib.Path(str(target)+'.download');assert hashlib.sha256(tmp.read_bytes()).hexdigest()==d['sha256'];tmp.replace(target)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:list(pool.map(restore,folder.glob('*.json')))
print('Existing source-bound NPC clips restored with SHA256 verification')
