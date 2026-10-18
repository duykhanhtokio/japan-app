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

const availableFiles = new Set(dialogueContext.keys());
const translationContext = (require as RequireWithContext).context('../data/dialogue-content/translations', false, /\.json$/);
const translatedFiles = new Set(translationContext.keys());
function withTranslations(turn: LifeDialogueTurn): LifeDialogueTurn {
 const key = `./${turn.scenarioId}.json`;
 if (!translatedFiles.has(key)) return withAuthoredHint(turn);
 const value = translationContext(key) as DialogueTranslationBundle | { default: DialogueTranslationBundle };
 return applyDialogueTranslations(withAuthoredHint(turn), 'default' in value ? value.default : value);
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
