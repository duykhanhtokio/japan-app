"""Exact corpus screening and unchanged-file evidence, not semantic approval."""
import collections
import hashlib
import json
import pathlib
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
BASELINE = 'c64277a0b96604401302b6f1c06f42384e34b282'
manifest = json.loads((ROOT / 'docs/dialogue-workspace/content-qa/PRF-027_INPUT_MANIFEST.json').read_text())
targets = {sid for group in manifest['groups'] for sid in group['scenarioIds']}
assert len(targets) == 277
players = collections.defaultdict(list)
all_text = collections.defaultdict(list)
outside_files = outside_turns = 0
for path in sorted((ROOT / 'src/data/generated/dialogues').glob('*.json')):
    data = json.loads(path.read_text())
    turns = data.get('shared', []) if isinstance(data, dict) else []
    if path.stem not in targets:
        outside_files += 1
        outside_turns += len(turns)
    for turn in turns:
        obj = turn.get('player' if turn.get('speaker') == 'PLAYER' else 'npc') or {}
        field = 'recommendedAnswerJa' if turn.get('speaker') == 'PLAYER' else 'textJa'
        text = obj.get(field, '')
        if text:
            ref = {'scenarioId': path.stem, 'turnId': turn['id']}
            all_text[text].append(ref)
            if turn.get('speaker') == 'PLAYER':
                players[text].append(ref)

def touching(groups):
    return [{'text': text, 'references': refs} for text, refs in groups.items()
            if len(refs) > 1 and any(ref['scenarioId'] in targets for ref in refs)]

listing = subprocess.check_output(['git', 'ls-tree', '-r', BASELINE, '--', 'src/data/generated/dialogues'], cwd=ROOT, text=True)
unchanged = 0
unexpected = []
for line in listing.splitlines():
    meta, relative = line.split('\t', 1)
    if pathlib.Path(relative).stem in targets:
        continue
    raw = (ROOT / relative).read_bytes()
    oid = hashlib.sha1(b'blob ' + str(len(raw)).encode() + b'\0' + raw).hexdigest()
    if oid != meta.split()[2]:
        unexpected.append(relative)
    else:
        unchanged += 1

report = {
    'status': 'PASS' if not touching(players) and not unexpected else 'FAIL',
    'baseline': BASELINE, 'targetCount': len(targets),
    'outsideFiles': outside_files, 'outsideSharedTurns': outside_turns,
    'exactPlayerCollisionsTouchingScope': touching(players),
    'exactUtteranceCollisionsTouchingScope': touching(all_text),
    'unchangedOutsideRuntimeFiles': unchanged,
    'unexpectedOutsideRuntimeChanges': unexpected,
    'limits': ['Exact screening does not establish semantic originality or native approval.',
               'Short shared NPC acknowledgements are listed for editorial review, not automatically rejected.'],
}
destination = ROOT / 'docs/dialogue-workspace/content-qa/PRF-027_CROSS_CORPUS_SCREEN.json'
destination.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print('OSAKA CORPUS SCREEN:', report['status'], '; Player collisions:', len(touching(players)),
      '; NPC/all utterance groups:', len(touching(all_text)), '; unchanged outside files:', unchanged)
if report['status'] != 'PASS':
    raise SystemExit(1)
