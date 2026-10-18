import type { LifeDialogueTurn } from '../types/life-conversation';

export type DialogueLocaleBatch = {
 language: string;
 status: 'translated_ai_unreviewed';
 nativeReviewed: false;
 scenarios: Record<string, {turns:Record<string, {
  speaker:string; sourceJa:string; translation:string; hintJa?:string; hintTranslation?:string;
 }>}>
};

/** Each locale is independently bound to the stable turn, speaker and exact source. */
export function applyDialogueLocaleBatch(turn:LifeDialogueTurn, batch:DialogueLocaleBatch):LifeDialogueTurn {
 if(batch.language==='ja')return turn;
 const entry=batch.scenarios[turn.scenarioId]?.turns[turn.id];
 const source=turn.speaker==='NPC'?turn.npc?.textJa:turn.player?.recommendedAnswerJa;
 if(!entry || entry.speaker!==turn.speaker || entry.sourceJa!==source || !entry.translation.trim())return turn;
 if(turn.speaker==='NPC' && turn.npc)return {...turn,npc:{...turn.npc,
  translations:{...turn.npc.translations,[batch.language]:entry.translation},
  translationVi:batch.language==='vi'?entry.translation:turn.npc.translationVi}};
 if(turn.speaker==='PLAYER' && turn.player)return {...turn,player:{...turn.player,
  translations:{...turn.player.translations,[batch.language]:entry.translation},
  ...(entry.hintJa===turn.player.hint && entry.hintTranslation?.trim() ? {
   hintTranslations:{...turn.player.hintTranslations,[batch.language]:entry.hintTranslation}
  } : {})}};
 return turn;
}
