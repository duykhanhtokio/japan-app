import lexicon from '@/data/dialogue-content/furigana-lexicon.json';
import { hasAlignedRuby } from '@/components/world/japanese-ruby-data';
import type { RubySegment } from '@/types/japanese-ruby';
import type { LifeDialogueTurn } from '@/types/life-conversation';

export type IndexedFuriganaShard = {
 version: 1;
 scenarios: Record<string, Record<string, { speaker: 'NPC' | 'PLAYER'; tokens: number[] }>>;
};

export function furiganaShardKey(scenarioId: string): string {
 let hash = 0;
 for (let i = 0; i < scenarioId.length; i++) hash = (hash * 31 + scenarioId.charCodeAt(i)) >>> 0;
 return './' + (hash % 32).toString().padStart(2, '0') + '.json';
}

// Offline dictionary readings only. Reconstruct and compare the entire source
// before attaching anything; edited Japanese never inherits stale readings.
export function applyIndexedFurigana(turn: LifeDialogueTurn, shard: IndexedFuriganaShard): LifeDialogueTurn {
 const entry = shard?.version === 1 ? shard.scenarios?.[turn.scenarioId]?.[turn.id] : undefined;
 const source = turn.speaker === 'NPC' ? turn.npc?.textJa : turn.player?.recommendedAnswerJa;
 if (!source || !entry || entry.speaker !== turn.speaker) return turn;
 const ruby: RubySegment[] = [];
 for (const id of entry.tokens) {
  const part = (lexicon as string[][])[id];
  if (!part) return turn;
  ruby.push(part.length === 2 ? { text: part[0], reading: part[1] } : { text: part[0] });
 }
 if (!hasAlignedRuby(source, ruby)) return turn;
 return turn.speaker === 'NPC'
  ? { ...turn, npc: { ...turn.npc!, textRuby: ruby } }
  : { ...turn, player: { ...turn.player!, recommendedAnswerRuby: ruby } };
}
