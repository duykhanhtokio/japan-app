import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const directory = 'src/data/generated/dialogues';
const scenarios = new Map([
  ...read('src/data/generated/scenarios.json'),
  ...read('src/data/dialogue-content/scenario-overrides.json'),
].map(item => [item.id, item]));
const index = {
  ...read('src/data/generated/scenario-index.json'),
  ...read('src/data/dialogue-content/scenario-index-overrides.json'),
};
const vocabulary = new Set(read('src/data/generated/vocabulary.json').map(item => item.id));
const grammar = new Set(read('src/data/generated/grammar.json').map(item => item.id));
const scripts = new Set();
let authored = 0;
const translatedTurns = new Map();

for (const name of readdirSync(directory)) {
  if (!name.endsWith('.json')) continue;
  const id = name.slice(0, -5);
  const value = read(`${directory}/${name}`);
  if (!value.shared) continue;
  authored++;
  assert(scenarios.has(id), `Missing scenario: ${id}`);
  assert.equal(value.shared.length, 11, `${id}: expected 11 turns`);
  assert.equal(index[id]?.dialogueCount, 11, `${id}: index count`);
  assert.equal(index[id]?.firstDialogueId, value.shared[0].id, `${id}: first turn`);
  const fullScript = [];
  for (let i = 0; i < 11; i++) {
    const turn = value.shared[i];
    const expectedSpeaker = i % 2 ? 'PLAYER' : 'NPC';
    assert.equal(turn.speaker, expectedSpeaker, `${id}: turn ${i + 1} speaker`);
    assert.equal(turn.turnOrder, i + 1, `${id}: turn order`);
    assert.equal(turn.scenarioId, id, `${id}: scenario reference`);
    assert.equal(turn.nextDialogueId, value.shared[i + 1]?.id ?? null, `${id}: broken chain`);
    const text = expectedSpeaker === 'NPC' ? turn.npc?.textJa : turn.player?.recommendedAnswerJa;
    assert(text?.trim(), `${id}: missing Japanese at turn ${i + 1}`);
    fullScript.push(text.trim());
    const translations = (expectedSpeaker === 'NPC' ? turn.npc : turn.player)?.translations ?? {};
    for (const [locale, translated] of Object.entries(translations)) {
      assert(translated?.trim(), `${id}: empty ${locale} translation at turn ${i + 1}`);
      translatedTurns.set(locale, (translatedTurns.get(locale) ?? 0) + 1);
    }
    if (expectedSpeaker === 'NPC' && translations.vi) assert.equal(turn.npc.translationVi, translations.vi);
    for (const word of turn.player?.targetVocabularyIds ?? []) assert(vocabulary.has(word), `${id}: unknown ${word}`);
    for (const rule of turn.player?.targetGrammarIds ?? []) assert(grammar.has(rule), `${id}: unknown ${rule}`);
  }
  const signature = fullScript.join('\n');
  assert(!scripts.has(signature), `${id}: repeated complete conversation`);
  scripts.add(signature);
}

const generic = [...scenarios.keys()].filter(id =>
  !existsSync(`${directory}/${id}.json`) && /^SC-LOC-JP-\d{5}-\d{2}-001$/.test(id)
).length;
console.log(`Shared Japanese drafts: ${authored}; translated turns: ${JSON.stringify(Object.fromEntries(translatedTurns))}; generic city fallbacks remaining: ${generic}.`);
