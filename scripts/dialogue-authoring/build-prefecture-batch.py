import json
import pathlib
import sys
import hashlib
import collections
import os

ROOT = pathlib.Path(os.environ.get('JAPAN_APP_ROOT', os.getcwd())).resolve()
STAGE = pathlib.Path(os.environ.get('JAPAN_DIALOGUE_STAGE', str(ROOT))).resolve()
BASE = pathlib.Path(__file__).resolve().parent

def read(root, relative):
    return json.loads((root / relative).read_text())

def recipes():
    result = {}
    for name in ['dialogue-stories.txt', 'special-stories.txt', 'additional-stories.txt']:
        path = BASE / name
        if not path.exists():
            continue
        for block in path.read_text().split('@')[1:]:
            lines = block.strip().splitlines()
            key, title, goal = lines[0].split('|')
            assert len(lines[1:]) == 11, (key, len(lines[1:]))
            assert key not in result, key
            result[key] = (title, goal, lines[1:])
    return result

def choose(scenario, loc, n, book):
    label = loc['nameJa']
    special = [
        ('眼科', 'hospital-eye'), ('皮膚科', 'hospital-skin'), ('夜間救急', 'hospital-night'),
        ('焼肉', 'restaurant-allergy'), ('天ぷら', 'restaurant-allergy'),
        ('漁港仕分け', 'fish-sort'), ('酒蔵', 'work-brew'), ('醸造', 'work-brew'),
        ('食品工場', 'work-food'), ('酪農', 'work-dairy'), ('牧場', 'work-dairy'),
        ('畑作', 'work-farm'), ('田んぼ', 'work-farm'), ('果樹園', 'work-orchard'),
        ('客室清掃', 'work-clean'), ('物流倉庫', 'work-warehouse'),
        ('木工所', 'work-machine'), ('製紙工場', 'work-machine'), ('部品工場', 'work-machine'),
        ('消防署', 'fire-info'), ('税務署', 'tax-info'), ('処方薬局', 'pharmacy'),
        ('郵便局', ['post-parcel', 'post-redelivery', 'post-address', 'post-letter'][n % 4]),
        ('銀行窓口', ['bank-open', 'bank-transfer', 'bank-card', 'bank-update'][n % 4]),
        ('ATM', 'bank-transfer'), ('鮮魚売場', 'fish-shop'), ('果物売場', 'fruit-shop'),
        ('携帯ショップ', 'phone-shop'), ('ICカード', 'ic-card'), ('動物園', 'zoo'),
        ('展望台', 'viewpoint'), ('書道教室', 'calligraphy'), ('工芸体験', 'craft'),
        ('科学館', 'museum'), ('博物館', 'museum'), ('古民家園', 'museum'), ('城跡', 'museum'),
        ('遊覧船', 'boat'), ('フェリー', 'boat'), ('スキーレンタル', 'rental-ski'),
        ('ボウリング', 'bowling'), ('遊園地', 'amusement'), ('ゲームセンター', 'amusement'),
        ('化粧品', 'cosmetics'), ('リサイクル', 'recycle'), ('スポーツ用品', 'sports-shop'),
        ('道の駅', 'shop-compare'), ('みやげ', 'shop-compare'),
    ]
    for needle, key in special:
        if needle in label and key in book:
            return key
    types = {
        'Station': ['station-route', 'station-delay', 'station-ticket', 'station-access'],
        'Government Office': ['gov-move', 'gov-certificate', 'gov-appointment', 'gov-notice'],
        'Hospital': ['hospital-first', 'hospital-change', 'hospital-language', 'hospital-document'],
        'Police Station': ['police-lost', 'police-found', 'police-bicycle', 'police-safety'],
        'Post Office': ['post-parcel', 'post-redelivery', 'post-address', 'post-letter'],
        'Bank': ['bank-open', 'bank-transfer', 'bank-card', 'bank-update'],
        'Supermarket': ['supermarket-label', 'supermarket-price', 'supermarket-checkout', 'supermarket-return'],
        'Park': ['park-walk', 'park-rules', 'park-weather', 'park-lost'],
        'Shop': ['shop-compare', 'shop-size'],
        'Restaurant': ['restaurant-order', 'restaurant-allergy', 'restaurant-bill'],
    }
    for needle, key in EXTRA_MATCHES:
        if needle in label and key in book:
            return key
    if scenario['locationType'] not in types:
        raise ValueError('No situation-specific recipe: ' + scenario['id'] + ' ' + label)
    return types[scenario['locationType']][n % len(types[scenario['locationType']])]

EXTRA_MATCHES = [
    ('御朱印', 'shrine'), ('料理教室', 'cooking'), ('キャンプ', 'camp'),
    ('美術', 'art'), ('ギャラリー', 'art'), ('スタジアム売店', 'shop-compare'),
    ('ライブハウス', 'live'), ('美容院', 'salon'), ('温泉', 'onsen'),
    ('家具店', 'furniture'), ('観光案内', 'tourist'), ('米屋', 'rice-shop'),
    ('公民館', 'community'), ('花火', 'fireworks'), ('リハビリ', 'rehab'),
    ('不動産', 'property'), ('映画館', 'cinema'), ('免許', 'license'),
    ('海の家', 'beach'), ('生花店', 'florist'), ('駐輪場', 'bicycle-parking'),
    ('介護施設', 'care-work'), ('祭り準備', 'festival-work'), ('登山口', 'mountain'),
    ('ドラッグストア日用品', 'shop-compare'),
]

def build(prefectures, cluster):
    book = recipes()
    cities = {x['id']: x for x in read(ROOT, 'src/data/generated/cities.json')}
    locations = {x['id']: x for x in read(ROOT, 'src/data/generated/locations.json')}
    scenarios = {x['id']: x for x in read(ROOT, 'src/data/generated/scenarios.json')}
    old_overrides = read(ROOT, 'src/data/dialogue-content/scenario-overrides.json')
    overrides = {x['id']: x for x in old_overrides}
    scenarios.update(overrides)
    idx = read(ROOT, 'src/data/dialogue-content/scenario-index-overrides.json')
    targets = [x for x in scenarios.values() if cities[x['cityId']]['prefectureId'] in prefectures]
    targets.sort(key=lambda x: (cities[x['cityId']]['order'], x['cityId'], locations[x['locationId']]['order'], x['order'], x['id']))
    existing = set()
    signatures = set()
    for file in (ROOT / 'src/data/generated/dialogues').glob('*.json'):
        obj = json.loads(file.read_text())
        if isinstance(obj, dict) and 'shared' in obj:
            existing.add(file.stem)
            signatures.add('\n'.join(t['npc']['textJa'] if t['speaker'] == 'NPC' else t['player']['recommendedAnswerJa'] for t in obj['shared']))
    changed = []
    manifest = []
    used = collections.Counter()
    for s in targets:
        if s['id'] in existing:
            continue
        loc = locations[s['locationId']]
        city = cities[s['cityId']]['nameJa']
        number = cities[s['cityId']]['order'] + s['order'] + loc['order']
        key = choose(s, loc, number, book)
        title, goal, lines = book[key]
        words = [line.replace('{city}', city) for line in lines]
        # Multiple distinct locations in a city can legitimately teach the same skill.
        # Identify the second visit naturally rather than adding numeric IDs to speech.
        signature = '\n'.join(words)
        if signature in signatures:
            words[1] = words[1] + '別の場所でも相談しましたが、こちらでの方法も確認したいです。'
            signature = '\n'.join(words)
        if signature in signatures:
            words[1] = words[1] + '今回は、同行者の分もあわせて相談したいです。'
            signature = '\n'.join(words)
        assert signature not in signatures, s['id']
        signatures.add(signature)
        # A geographic anchor alone is not a verified real business or service claim.
        current = dict(s)
        current.update(name=title, situation=f'{city}の学習用場面で、{goal}。', learningObjective='用件と状況を具体的に伝え、聞き返しと確認を行い、次の行動を決める。', playerGoal=goal, npcGoal='確認できる内容と未確認の条件を区別し、相談に応じて次の行動を案内する。', difficulty=None, status='Review', version=2)
        overrides[s['id']] = current
        turns = []
        for i, word in enumerate(words):
            turn_id = f'DLG-{s["id"]}-SHARED-{i+1:02d}'
            npc = None
            player = None
            if i % 2 == 0:
                npc = dict(textJa=word, furigana=None, translationVi=None, translations={})
            else:
                player = dict(communicativeIntent=f'{key}_response_{(i+1)//2}', requiredSemanticComponents={'goal':goal}, optionalSemanticComponents={}, recommendedAnswerJa=word, recommendedAnswerFurigana=None, acceptableExamples=[], hint='相手の質問に答え、必要な条件を具体的に伝えましょう。わからない点は聞き返してください。', translations={}, evaluationNotes='直前の発話に応じ、用件・条件・確認事項を適切に伝えられているか確認する。', unexpectedIntents=[], allowMinorGrammarErrors=True, targetGrammarIds=[], targetVocabularyIds=[])
            turns.append(dict(id=turn_id, scenarioId=s['id'], turnOrder=i+1, speaker='NPC' if i%2==0 else 'PLAYER', npc=npc, player=player, nextDialogueId=f'DLG-{s["id"]}-SHARED-{i+2:02d}' if i<10 else None, status='Japanese draft', qualityCheck='Scenario-specific Japanese exchange; alternating 11 turns; translation deferred; simulated setting, not verified local service information.', mappingConfidence=None))
        obj = {'shared':turns, 'authoring':{'locale':'ja', 'recipe':key, 'cluster':cluster, 'contentScope':'simulated_learning_scenario', 'nativeSpeakerReviewed':False, 'translationState':'deferred_until_all_japanese_complete'}}
        path = f'src/data/generated/dialogues/{s["id"]}.json'
        dest = STAGE / path
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(obj, ensure_ascii=False, indent=2)+'\n')
        changed.append(path)
        idx[s['id']] = dict(scenarioId=s['id'], locationId=s['locationId'], cityId=s['cityId'], difficulty=None, dialogueCount=11, firstDialogueId=turns[0]['id'])
        manifest.append({'scenarioId':s['id'],'city':city,'prefectureId':cities[s['cityId']]['prefectureId'],'location':loc['nameJa'],'title':title,'recipe':key,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest()})
        used[key] += 1
    for path, value in [('src/data/dialogue-content/scenario-overrides.json', list(overrides.values())), ('src/data/dialogue-content/scenario-index-overrides.json', idx)]:
        (STAGE/path).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')
        changed.append(path)
    sources = ['dialogue-stories.txt', 'special-stories.txt', 'build-prefecture-batch.py']
    if (BASE/'additional-stories.txt').exists():
        sources.append('additional-stories.txt')
    for filename in sources:
        path = 'scripts/dialogue-authoring/' + filename
        name = {'build-prefecture-batch.py':'build_batch.py'}.get(pathlib.Path(path).name,pathlib.Path(path).name)
        (STAGE/path).parent.mkdir(parents=True,exist_ok=True)
        shutil_source = pathlib.Path(__file__) if path.endswith('.py') else BASE/name
        (STAGE/path).write_text(shutil_source.read_text())
        changed.append(path)
    report = {'cluster':cluster, 'prefectureIds':prefectures, 'totalCanonicalScenarios':len(targets), 'previousSharedScenarios':len(targets)-len(manifest), 'newJapaneseScenarios':len(manifest), 'newJapaneseTurns':len(manifest)*11, 'clusterCoverage':len(targets), 'globalSharedCount':len(existing)+len(manifest), 'canonicalScenarioCount':len(scenarios), 'translationAdded':0, 'status':'Japanese drafts with structural validation; human linguistic review pending', 'recipeReuse':'Original situation scripts are adapted to city contexts. Repeated everyday skills across cities are intentional; these are not claimed as independently hand-written unique plots.', 'recipesUsed':dict(used),'scenarios':manifest}
    rp=f'docs/dialogue-workspace/{cluster}.json'
    (STAGE/rp).parent.mkdir(parents=True,exist_ok=True)
    (STAGE/rp).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    changed.append(rp)
    (BASE/'changed.json').write_text(json.dumps(changed))
    print(json.dumps({k:v for k,v in report.items() if k not in ['scenarios','recipesUsed']},ensure_ascii=False))

if __name__ == '__main__':
    build(sys.argv[2:], sys.argv[1])
