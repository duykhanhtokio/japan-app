"""Apply individually authored exchanges without synthesizing dialogue from recipes."""
import datetime
import hashlib
import json
import pathlib
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
def read(path):
    return json.loads(path.read_text())

source = ROOT / sys.argv[1]
entries = read(source)
backup = ROOT / '.dialogue-backups' / datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
manifest = []
for sid, entry in entries.items():
    assert len(entry['turns']) == 11 and len(entry['tasks']) == 5, sid
    assert len({x[0] for x in entry['tasks']}) == 5, sid
    path = ROOT / 'src/data/generated/dialogues' / (sid + '.json')
    data = read(path)
    assert len(data['shared']) == 11, sid
    if data.get('authoring', {}).get('editorialSource') == str(source.relative_to(ROOT)) and data['authoring'].get('premise') == entry['premise'] and all((t['player']['recommendedAnswerJa'] if n % 2 else t['npc']['textJa']) == entry['turns'][n] for n, t in enumerate(data['shared'])) and all(t['player'].get('communicativeIntent') == entry['tasks'][i][0] and t['player'].get('requiredSemanticComponents') == {'goal': entry['tasks'][i][1]} for i, t in enumerate(data['shared'][1::2])):
        continue
    backup.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, backup / path.name)
    before = hashlib.sha256(path.read_bytes()).hexdigest()
    for n, (t, text) in enumerate(zip(data['shared'], entry['turns'])):
        assert t['speaker'] == ('PLAYER' if n % 2 else 'NPC'), sid
        assert t['scenarioId'] == sid and t['turnOrder'] == n + 1, sid
        t['status'] = 'Japanese editorial draft'
        t['qualityCheck'] = 'Individually rewritten Japanese exchange; prefecture content QA pending; no translation certification.'
        obj = t['player' if n % 2 else 'npc']
        # Old translations and furigana do not describe a rewritten utterance.
        # Preserve them in the timestamped backup, never serve stale translations.
        obj['translations'] = {}
        if n % 2:
            intent, task = entry['tasks'][n // 2]
            obj.update(communicativeIntent=intent, requiredSemanticComponents={'goal': task}, optionalSemanticComponents={}, recommendedAnswerJa=text, recommendedAnswerFurigana=None, acceptableExamples=[], hint=task + '。日本語で伝えてください。', evaluationNotes=task + '。言い換えは許容する。直前のNPCの問いに応じているかを確認する。', unexpectedIntents=[], targetGrammarIds=[], targetVocabularyIds=[])
        else:
            obj.update(textJa=text, furigana=None, translationVi=None)
    authoring = data.setdefault('authoring', {})
    authoring.pop('recipe', None)
    authoring.update(locale='ja', contentScope='simulated_learning_scenario', editorialSource=str(source.relative_to(ROOT)), premise=entry['premise'], contentReview='individual causal/location rewrite complete; cross-prefecture semantic comparison pending', nativeSpeakerReviewed=False, translationState='deferred_until_all_japanese_complete', contentPass=False)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    manifest.append({'scenarioId': sid, 'path': str(path.relative_to(ROOT)), 'beforeSha256': before, 'afterSha256': hashlib.sha256(path.read_bytes()).hexdigest()})
if manifest:
    (backup / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print('Individually rewritten:', len(manifest), '; preserved originals:', str(backup) if manifest else 'no new edits')
