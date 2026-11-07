"""Read-only device inventory and lexical dependency asset preflight.

This does not run a native app, validate images visually, or certify hardware.
Only this script's output file is written; source/assets remain unchanged.
"""
from pathlib import Path
import argparse,datetime,hashlib,json,os,platform,re,shutil,subprocess
REPO=Path(__file__).resolve().parents[5]
# device -> batch33 -> manufacturing -> ssw-workspace -> docs -> repository
assert (REPO/'package.json').is_file(),REPO
EXTENSIONS=['','.ts','.tsx','.js','.jsx','.json','/index.ts','/index.tsx','/index.js']
SOURCE_EXT={'.ts','.tsx','.js','.jsx'}
ASSET_EXT={'.png','.jpg','.jpeg','.webp','.gif','.svg','.ttf','.otf','.woff','.woff2','.mp3','.wav','.m4a','.mp4'}
PATTERN=re.compile(r'''(?:\bfrom\s*|\brequire\s*\(\s*|\bimport\s*\(\s*|\bimport\s*)["']([^"']+)["']''')
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def command(args):
    if not shutil.which(args[0]):return {'available':False,'executed':False,'output':None}
    try:
        p=subprocess.run(args,text=True,capture_output=True,timeout=15)
        return {'available':True,'executed':True,'returncode':p.returncode,'output':(p.stdout+p.stderr)[:12000]}
    except subprocess.TimeoutExpired:return {'available':True,'executed':True,'timedOut':True}
def classify(p):
    if not p.is_file():return 'missing'
    with p.open('rb') as f:head=f.read(256)
    if head.startswith(b'version https://git-lfs.github.com/spec/v1\n'):return 'unresolved_git_lfs_pointer'
    if p.suffix.lower()=='.png' and not head.startswith(b'\x89PNG\r\n\x1a\n'):return 'invalid_png_header'
    if p.suffix.lower()=='.webp' and not(head.startswith(b'RIFF') and head[8:12]==b'WEBP'):return 'invalid_webp_header'
    return 'bytes_present_not_visually_certified'
def dependency_closure():
    pending=[REPO/'src/components/manufacturing/ManufacturingCourse.tsx',REPO/'src/components/ui/AppBackdrop.tsx']
    seen=set();assets={};missing=[];external=set()
    while pending:
        file=pending.pop()
        if file in seen:continue
        seen.add(file)
        if file.suffix not in SOURCE_EXT:continue
        for spec in PATTERN.findall(file.read_text()):
            if spec.startswith('@/'):candidate=REPO/'src'/spec[2:]
            elif spec.startswith('.'):candidate=(file.parent/spec).resolve()
            else:external.add(spec);continue
            if candidate.suffix.lower() in ASSET_EXT:
                key=str(candidate.relative_to(REPO));assets[key]=classify(candidate);continue
            resolved=next((Path(str(candidate)+e) for e in EXTENSIONS if Path(str(candidate)+e).is_file()),None)
            if resolved:pending.append(resolved)
            else:missing.append({'importer':str(file.relative_to(REPO)),'specifier':spec})
    return {'method':'Lexical local import/require over-approximation, including dynamic/conditional imports; not a Metro resolver or proof that every candidate is exercised.',
            'sourceModulesVisited':len(seen),'assetCandidates':len(assets),'assetStatusCounts':{s:list(assets.values()).count(s) for s in sorted(set(assets.values()))},
            'assets':[{'path':p,'status':s} for p,s in sorted(assets.items())], 'unresolvedLocalModules':missing,'externalPackages':sorted(external)}
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);args=parser.parse_args()
    names=['adb','xcrun','xcodebuild','emulator','idevice_id','ideviceinfo','lsusb','flutter','eas','node','npm']
    known=['assets/game/farm/background/farm_map_master.png','assets/game/farm/background/farm_map_tablet_landscape_v1.png','assets/app/ui/royal-af/button-wide-v2.png','assets/app/fonts/NotoSansJP-Medium.ttf','assets/kensetsu/ui/calendar-leaf-v1.webp']
    value={'schemaVersion':1,'observedAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'userFacingDateAsiaTokyo':'2026-10-29',
           'platform':platform.platform(),'commands':{n:shutil.which(n) for n in names},'usbBusExposed':Path('/dev/bus/usb').exists(),
           'androidHomeConfigured':bool(os.environ.get('ANDROID_HOME')),'androidSdkRootConfigured':bool(os.environ.get('ANDROID_SDK_ROOT')),
           'physicalDeviceInventory':{'android':command(['adb','devices','-l']),'apple':command(['xcrun','xctrace','list','devices'])},
           'knownAssetChecks':[{'path':f,'status':classify(REPO/f),'sha256':sha(REPO/f) if (REPO/f).is_file() else None} for f in known],
           'dependencyPreflight':dependency_closure(),'physicalDeviceVerified':False,'nativeApplicationLaunched':False,'simulatorVerified':False,
           'interpretation':'Missing bridges and USB exposure mean no connected physical device was accessible in this execution environment. Inventory is not a physical-device test. Desktop browser/RNWeb results must remain separate.'}
    p=Path(args.output);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'physicalDeviceVerified':False,'nativeApplicationLaunched':False,'sourceModulesVisited':value['dependencyPreflight']['sourceModulesVisited'],'assetCandidates':value['dependencyPreflight']['assetCandidates'],'assetStatusCounts':value['dependencyPreflight']['assetStatusCounts']}))
if __name__=='__main__':main()
