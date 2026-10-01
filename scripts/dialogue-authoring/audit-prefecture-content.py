"""Inventory and duplicate evidence; recognize only a separate hash-bound editorial decision."""
import collections
import difflib
import hashlib
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
def read(path):
    return json.loads((ROOT / path).read_text())

def editorial_decision_matches(report, review):
    """Screening alone never passes content; every reviewed runtime hash must match."""
    decision = review.get('finalDecision', {})
    inventory = report['inventory']
    count = report['canonicalCount']
    current = {item['scenarioId']: item['sha256'] for item in inventory}
    reviewed = {sid for group in review.get('wholeCorpusComparisonGroups', [])
                for sid in group.get('scenarioIds', [])}
    screening = ('exactDuplicateGroups', 'placeQuantityNormalizedDuplicateGroups',
                 'nearDuplicateCandidates', 'exactPlayerTaskDuplicateGroups',
                 'exactPlayerAnswerDuplicateGroups', 'canonicalTitleDuplicateGroups',
                 'recipeReuseGroups')
    return (count > 0 and report['coverageCount'] == count
            and report['structuralErrorCount'] == 0
            and all(not report[field] for field in screening)
            and review.get('contentPass') is True
            and decision.get('contentPass') is True
            and decision.get('reviewer') in ('AI', 'Human')
            and decision.get('canonicalCount') == count
            and decision.get('reviewedScenarioCount') == count
            and decision.get('openEditorialBlockers') == 0
            and not review.get('pendingGroups')
            and reviewed == set(current)
            and decision.get('scenarioSha256') == current)

def audit(prefecture):
    cities = {x['id']: x for x in read('src/data/generated/cities.json')}
    locations = {x['id']: x for x in read('src/data/generated/locations.json')}
    scenarios = {x['id']: x for x in read('src/data/generated/scenarios.json')}
    scenarios.update({x['id']: x for x in read('src/data/dialogue-content/scenario-overrides.json')})
    index = read('src/data/generated/scenario-index.json')
    index.update(read('src/data/dialogue-content/scenario-index-overrides.json'))
    targets = sorted((s for s in scenarios.values() if cities[s['cityId']]['prefectureId'] == prefecture), key=lambda s: (cities[s['cityId']]['order'], locations[s['locationId']]['order'], s['order'], s['id']))
    names = sorted({x['nameJa'] for x in cities.values()} | {x['nameJa'] for x in locations.values()}, key=len, reverse=True)
    normalized = []
    exact = collections.defaultdict(list)
    normalized_groups = collections.defaultdict(list)
    intents = collections.defaultdict(list)
    recipe_groups = collections.defaultdict(list)
    inventory = []
    editorial_sources = {}
    player_task_groups = collections.defaultdict(list)
    player_answer_groups = collections.defaultdict(list)
    title_groups = collections.defaultdict(list)
    for s in targets:
        path = 'src/data/generated/dialogues/' + s['id'] + '.json'
        raw = (ROOT / path).read_bytes()
        data = json.loads(raw)
        turns = data.get('shared', [])
        errors = []
        if len(turns) != 11:
            errors.append('turn_count')
        texts = []
        purposes = []
        for n, t in enumerate(turns):
            speaker = 'PLAYER' if n % 2 else 'NPC'
            if t.get('speaker') != speaker or t.get('turnOrder') != n + 1 or t.get('scenarioId') != s['id']:
                errors.append('turn_reference:' + str(n + 1))
            if t.get('nextDialogueId') != (turns[n+1]['id'] if n+1 < len(turns) else None):
                errors.append('chain:' + str(n + 1))
            obj = t.get('player' if n % 2 else 'npc') or {}
            text = obj.get('recommendedAnswerJa' if n % 2 else 'textJa', '')
            if not text.strip():
                errors.append('missing_japanese:' + str(n + 1))
            texts.append(text)
            if n % 2:
                purposes.append(obj.get('communicativeIntent'))
        source_path = data.get('authoring', {}).get('editorialSource')
        if source_path:
            if source_path not in editorial_sources:
                editorial_sources[source_path] = read(source_path)
            entry = editorial_sources[source_path].get(s['id'])
            if not entry:
                errors.append('missing_editorial_entry')
            else:
                if texts != entry.get('turns'):
                    errors.append('editorial_utterance_mismatch')
                tasks = entry.get('tasks', [])
                for i, task in enumerate(tasks):
                    player_task_groups[task[1]].append({'scenarioId': s['id'], 'playerTask': i + 1})
                for i, text in enumerate(texts[1::2]):
                    player_answer_groups[text].append({'scenarioId': s['id'], 'playerAnswer': i + 1})
                title_groups[s.get('name', '')].append(s['id'])
                if tasks and s.get('playerGoal') != tasks[0][1]:
                    errors.append('canonical_initial_goal_mismatch')
                if s.get('situation') != entry.get('premise'):
                    errors.append('canonical_situation_mismatch')
                if s.get('difficulty') is not None:
                    errors.append('unexpected_level_cap')
                if len(tasks) != 5:
                    errors.append('editorial_task_count')
                else:
                    for i, turn in enumerate(turns[1::2]):
                        player = turn.get('player') or {}
                        intent, goal = tasks[i]
                        if player.get('communicativeIntent') != intent or player.get('requiredSemanticComponents') != {'goal': goal}:
                            errors.append('editorial_goal_mismatch:' + str(i + 1))
                        if player.get('hint') != goal + '。日本語で伝えてください。':
                            errors.append('editorial_hint_mismatch:' + str(i + 1))
                        if player.get('evaluationNotes') != goal + '。言い換えは許容する。直前のNPCの問いに応じているかを確認する。':
                            errors.append('editorial_evaluation_mismatch:' + str(i + 1))
                if data['authoring'].get('premise') != entry.get('premise'):
                    errors.append('editorial_premise_mismatch')
        if turns and (index.get(s['id'], {}).get('firstDialogueId') != turns[0]['id'] or index[s['id']].get('dialogueCount') != 11):
            errors.append('index')
        script = '\n'.join(texts)
        norm = script
        for name in names:
            norm = norm.replace(name, '<PLACE>')
        norm = re.sub(r'[一二三四五六七八九十百千万\d]+(?:円|分|時|枚|人|個)', '<QUANTITY>', norm)
        exact[script].append(s['id'])
        normalized_groups[norm].append(s['id'])
        intents[tuple(re.sub(r'_response_\d+$', '', str(x)) for x in purposes)].append(s['id'])
        recipe = data.get('authoring', {}).get('recipe')
        if recipe:
            recipe_groups[recipe].append(s['id'])
        normalized.append((s['id'], norm, set(norm[i:i+4] for i in range(max(0, len(norm)-3)))))
        inventory.append({'scenarioId': s['id'], 'locationId': s['locationId'], 'locationNameJa': locations[s['locationId']]['nameJa'], 'cityId': s['cityId'], 'path': path, 'sha256': hashlib.sha256(raw).hexdigest(), 'turnCount': len(turns), 'playerIntents': purposes, 'recipe': recipe, 'structuralErrors': errors, 'editorialReview': data.get('authoring', {}).get('contentReview', 'pending')})
    near = []
    for i, (a, ta, sa) in enumerate(normalized):
        for b, tb, sb in normalized[i+1:]:
            overlap = len(sa & sb) / max(1, len(sa | sb))
            if overlap >= .48:
                ratio = difflib.SequenceMatcher(None, ta, tb, autojunk=False).ratio()
                if ratio >= .72:
                    near.append({'a': a, 'b': b, 'normalizedSimilarity': round(ratio, 4), 'fourGramJaccard': round(overlap, 4), 'review': 'pending'})
    groups = lambda d: [v for v in d.values() if len(v) > 1]
    result = {'prefectureId': prefecture, 'status': 'FAIL CONTENT QA / rewrite in progress', 'canonicalCount': len(targets), 'coverageCount': sum(x['turnCount'] > 0 for x in inventory), 'structuralErrorCount': sum(bool(x['structuralErrors']) for x in inventory), 'exactDuplicateGroups': groups(exact), 'placeQuantityNormalizedDuplicateGroups': groups(normalized_groups), 'nearDuplicateCandidates': near, 'exactPlayerTaskDuplicateGroups': groups(player_task_groups), 'exactPlayerAnswerDuplicateGroups': groups(player_answer_groups), 'canonicalTitleDuplicateGroups': groups(title_groups), 'intentStructureCandidates': groups(intents), 'recipeReuseGroups': dict(recipe_groups), 'semanticReview': 'Manual causal-development and location-role review required; similarity scores are candidate evidence only.', 'contentPass': False, 'inventory': inventory}


    review_path = ROOT / 'docs/dialogue-workspace/content-qa' / (prefecture + '_SEMANTIC_REVIEW.json')
    if review_path.exists():
        try:
            review = json.loads(review_path.read_text())
            if editorial_decision_matches(result, review):
                result['contentPass'] = True
                result['status'] = 'CONTENT PASS — ' + review['finalDecision']['reviewer'] + ' JAPANESE EDITORIAL REVIEW'
                result['semanticReview'] = 'Separate editorial decision verified against all current runtime SHA-256 hashes; no native-speaker, translation or real-policy approval implied.'
        except (ValueError, KeyError, TypeError):
            # Malformed or obsolete decisions never upgrade an inventory scan.
            pass
    return result

if __name__ == '__main__':
    prefecture = sys.argv[1]
    result = audit(prefecture)
    destination = ROOT / 'docs/dialogue-workspace/content-qa' / (prefecture + '.json')
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({k: result[k] for k in ['prefectureId', 'canonicalCount', 'coverageCount', 'structuralErrorCount', 'contentPass']}))
    print('exact groups:', len(result['exactDuplicateGroups']), 'normalized groups:', len(result['placeQuantityNormalizedDuplicateGroups']), 'near candidates:', len(result['nearDuplicateCandidates']))

    if result['structuralErrorCount']:
        sys.exit(1)
