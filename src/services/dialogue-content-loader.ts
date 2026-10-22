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

// Metro indexes the JSON modules at build time, while a scenario is read only
// when the learner opens it.
const dialogueContext = (require as RequireWithContext).context(
    '../data/generated/dialogues',
    false,
    /\.json$/
);

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

const availableFiles = new Set(dialogueContext.keys());
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

// The initial JLPT assessment describes the learner; it does not select or
// restrict conversation content. New authored scenarios use `shared`.
// Existing five-level packages remain available through their N5 content
// while each scenario is rewritten; scenario IDs and saved card progress stay stable.
export function loadDialogueTurns(scenarioId: string): LifeDialogueTurn[] {
    const directKey = `./${scenarioId}.json`;
    const genericMatch = /^SC-LOC-JP-\d{5}-(\d{2})-001$/.exec(scenarioId);
    const key = availableFiles.has(directKey)
        ? directKey
        : genericMatch
            ? `./GENERIC-CITY-${genericMatch[1]}.json`
            : directKey;
    if (!availableFiles.has(key)) return [];
    const moduleValue = dialogueContext(key) as { default?: unknown } | unknown;
    const value = typeof moduleValue === 'object' && moduleValue && 'default' in moduleValue
        ? (moduleValue as { default: unknown }).default
        : moduleValue;
    if (Array.isArray(value)) return (value as LifeDialogueTurn[]).map(withTranslations);
    if (value && typeof value === 'object') {
        const content = value as LifeDialogueLevelSet & { shared?: LifeDialogueTurn[] };
        const selected = content.shared ?? content.N5;
        if (!Array.isArray(selected)) return [];
        if (key === directKey) return selected.map(withTranslations);
        const genericId = `GENERIC-CITY-${genericMatch![1]}`;
        return selected.map((turn) => {
            const replace = (value: string | null) => value?.split(genericId).join(scenarioId) ?? null;
            return withTranslations({
                ...turn,
                id: replace(turn.id)!,
                scenarioId,
                nextDialogueId: replace(turn.nextDialogueId),
            });
        });
    }
    return [];
}
