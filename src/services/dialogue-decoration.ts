import { applyIndexedFurigana, furiganaShardKey, type IndexedFuriganaShard } from './dialogue-indexed-furigana';
import { appLanguages } from '@/i18n/languages';
import { applyDialogueFurigana, type DialogueFuriganaBundle } from './dialogue-furigana';
import localeBatchIndex from '@/data/dialogue-content/locale-batch-index.json';
import { applyDialogueLocaleBatch, type DialogueLocaleBatch } from './dialogue-locale-batches';
import { applyDialogueTranslations, type DialogueTranslationBundle } from './dialogue-translations';
import authoredHintsJson from '@/data/dialogue-content/player-hints.json';
import type { LifeDialogueLevelSet, LifeDialogueTurn } from '@/types/life-conversation';

type MetroRequireContext = {
    (key: string): unknown;
    keys(): string[];
};

type RequireWithContext = NodeRequire & {
    context(directory: string, useSubdirectories: boolean, pattern: RegExp): MetroRequireContext;
};

type AuthoredHint={answerJa:string;hintTranslations:Record<string,string>;recommendedAnswerRuby?:{text:string;reading?:string}[]};
const authoredHints=authoredHintsJson as Record<string,AuthoredHint>;
function withAuthoredHint(turn:LifeDialogueTurn):LifeDialogueTurn{
 const hint=authoredHints[turn.id];
 if(!turn.player||!hint||hint.answerJa!==turn.player.recommendedAnswerJa)return turn;
 return {...turn,player:{...turn.player,hintTranslations:hint.hintTranslations,recommendedAnswerRuby:hint.recommendedAnswerRuby??turn.player.recommendedAnswerRuby}};
}

const indexedFuriganaContext = (require as RequireWithContext).context('../data/dialogue-content/furigana-indexed', false, /\.json$/);
const indexedFuriganaFiles = new Set(indexedFuriganaContext.keys());
function withIndexedFurigana(turn: LifeDialogueTurn): LifeDialogueTurn {
 const key = furiganaShardKey(turn.scenarioId);
 if (!indexedFuriganaFiles.has(key)) return turn;
 const value = indexedFuriganaContext(key) as IndexedFuriganaShard | { default: IndexedFuriganaShard };
 return applyIndexedFurigana(turn, 'default' in value ? value.default : value);
}

const furiganaContext = (require as RequireWithContext).context('../data/dialogue-content/furigana', false, /\.json$/);
const furiganaFiles = new Set(furiganaContext.keys());
function withFurigana(turn: LifeDialogueTurn): LifeDialogueTurn {
 const key = `./${turn.scenarioId}.json`;
 if (!furiganaFiles.has(key)) return turn;
 const value = furiganaContext(key) as DialogueFuriganaBundle | { default: DialogueFuriganaBundle };
 return applyDialogueFurigana(turn, 'default' in value ? value.default : value);
}

const translationContext = (require as RequireWithContext).context('../data/dialogue-content/translations', false, /\.json$/);
const translatedFiles = new Set(translationContext.keys());
const localeBatchContext = (require as RequireWithContext).context('../data/dialogue-content/locale-batches', true, /\.json$/);
const localeBatchFiles = new Set(localeBatchContext.keys());
function withLocaleBatches(turn:LifeDialogueTurn):LifeDialogueTurn {
 const batchId=(localeBatchIndex as Record<string,string>)[turn.scenarioId];
 if(!batchId)return turn;
 return appLanguages.reduce((current,locale)=>{
  const key=`./${locale.code}/${batchId}.json`;
  if(!localeBatchFiles.has(key))return current;
  const value=localeBatchContext(key) as DialogueLocaleBatch | {default:DialogueLocaleBatch};
  return applyDialogueLocaleBatch(current,'default' in value?value.default:value);
 },turn);
}
function withTranslations(turn: LifeDialogueTurn): LifeDialogueTurn {
 turn = withFurigana(withIndexedFurigana(turn));
 const key = `./${turn.scenarioId}.json`;
 if (!translatedFiles.has(key)) return withLocaleBatches(withAuthoredHint(turn));
 const value = translationContext(key) as DialogueTranslationBundle | { default: DialogueTranslationBundle };
 return withLocaleBatches(applyDialogueTranslations(withAuthoredHint(turn), 'default' in value ? value.default : value));
}

export function decorateGeoDialogueTurns(raw: unknown, _scenarioId: string): LifeDialogueTurn[] {
 const value = raw && typeof raw === 'object' && 'default' in raw
  ? (raw as {default: unknown}).default : raw;
 const selected = Array.isArray(value) ? value
  : value && typeof value === 'object'
   ? (value as LifeDialogueLevelSet & {shared?: LifeDialogueTurn[]}).shared ??
     (value as LifeDialogueLevelSet).N5
   : null;
 if (!Array.isArray(selected)) return [];
 return (selected as LifeDialogueTurn[]).map(withTranslations);
}
