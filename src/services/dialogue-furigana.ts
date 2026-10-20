import { hasAlignedRuby } from '@/components/world/japanese-ruby-data';
import type { RubySegment } from '@/types/japanese-ruby';
import type { LifeDialogueTurn } from '@/types/life-conversation';

export type DialogueFuriganaBundle = {
 scenarioId: string;
 status: 'authored_ai_unreviewed';
 nativeReviewed: false;
 turns: Record<string, { speaker: 'NPC' | 'PLAYER'; sourceJa: string; ruby: RubySegment[] }>;
};

export function applyDialogueFurigana(turn: LifeDialogueTurn, bundle: DialogueFuriganaBundle): LifeDialogueTurn {
 const entry = bundle?.scenarioId === turn.scenarioId ? bundle.turns?.[turn.id] : undefined;
 const source = turn.speaker === 'NPC' ? turn.npc?.textJa : turn.player?.recommendedAnswerJa;
 if (!entry || entry.speaker !== turn.speaker || !source || entry.sourceJa !== source || !hasAlignedRuby(source, entry.ruby)) return turn;
 return turn.speaker === 'NPC'
  ? { ...turn, npc: { ...turn.npc!, textRuby: entry.ruby } }
  : { ...turn, player: { ...turn.player!, recommendedAnswerRuby: entry.ruby } };
}
