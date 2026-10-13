"""Bind existing Shiga identities to five independently authored Japanese sources."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def read(relative):
    return json.loads((ROOT / relative).read_text())


entries = {}
for number in range(1, 6):
    entries.update(read(f"scripts/dialogue-authoring/prf-025-group-{number:02}.json"))
assert len(entries) == 117
manifest = read("docs/dialogue-workspace/content-qa/PRF-025_INPUT_MANIFEST.json")
assert set(entries) == {sid for group in manifest["groups"] for sid in group["scenarioIds"]}
overrides = read("src/data/dialogue-content/scenario-overrides.json")
positions = {row["id"]: index for index, row in enumerate(overrides)}
scenarios = {row["id"]: row for row in read("src/data/generated/scenarios.json") + overrides}
locations = {row["id"]: row for row in read("src/data/generated/locations.json")}
corrections = read("src/data/location-role-corrections.json")
for sid, entry in entries.items():
    assert len(entry["turns"]) == 11 and len(entry["tasks"]) == 5, sid
    row = dict(scenarios[sid])
    for field, expected in manifest["canonicalLinks"][sid].items():
        assert row[field] == expected, (sid, field)
    location = locations[row["locationId"]]
    row.update(
        name=entry["title"], situation=entry["premise"], playerGoal=entry["tasks"][0][1],
        locationType=corrections.get(location["id"], {}).get("category", location["category"]),
        difficulty=None,
        learningObjective="用件と状況を具体的に伝え、聞き返しと確認を行い、次の行動を決める。",
        npcGoal="確認できる内容と未確認の条件を区別し、相談に応じて次の行動を案内する。",
        requiredGrammarIds=[], requiredVocabularyIds=[],
        description=None, evaluationCriteria=None, outcome=None, startingExpression=None,
    )
    if sid in positions:
        overrides[positions[sid]] = row
    else:
        positions[sid] = len(overrides)
        overrides.append(row)
(ROOT / "src/data/dialogue-content/scenario-overrides.json").write_text(
    json.dumps(overrides, ensure_ascii=False, indent=2) + "\n"
)
print("Shiga metadata source binding PASS: 117 existing identities; no dialogue synthesis")
