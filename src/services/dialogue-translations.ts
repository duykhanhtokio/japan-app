import type { LifeDialogueTurn } from '../types/life-conversation';

export type DialogueTranslationBundle = {
 scenarioId: string;
 status: 'translated_ai_unreviewed';
 turns: Record<string, { speaker: string; sourceJa: string; translations: Record<string, string> }>;
};

/** A translation belongs to an exact sentence and speaker, never to position alone. */
export function applyDialogueTranslations(turn: LifeDialogueTurn, bundle?: DialogueTranslationBundle): LifeDialogueTurn {
 if (!bundle || bundle.scenarioId !== turn.scenarioId) return turn;
 const entry = bundle.turns[turn.id];
 const source = turn.speaker === 'NPC' ? turn.npc?.textJa : turn.player?.recommendedAnswerJa;
 if (!entry || entry.speaker !== turn.speaker || entry.sourceJa !== source) return turn;
 const translations = Object.fromEntries(Object.entries(entry.translations).filter(([locale, text]) => locale !== 'ja' && text.trim()));
 if (turn.speaker === 'NPC' && turn.npc) return { ...turn, npc: { ...turn.npc,
  translations: { ...turn.npc.translations, ...translations },
  translationVi: translations.vi ?? turn.npc.translationVi } };
 if (turn.speaker === 'PLAYER' && turn.player) return { ...turn, player: { ...turn.player,
  translations: { ...turn.player.translations, ...translations } } };
 return turn;
}
