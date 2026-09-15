import type { LifeDialogueLevel, LifeDialogueLevelSet, LifeDialogueTurn } from '@/types/life-conversation';

type MetroRequireContext = {
    (key: string): unknown;
    keys(): string[];
};

type RequireWithContext = NodeRequire & {
    context(directory: string, useSubdirectories: boolean, pattern: RegExp): MetroRequireContext;
};

// Metro indexes the JSON modules at build time, while a scenario is read only
// when the learner opens it.
const dialogueContext = (require as RequireWithContext).context(
    '../data/generated/dialogues',
    false,
    /\.json$/
);

const availableFiles = new Set(dialogueContext.keys());

export function normalizeDialogueLevel(level?: string | null): LifeDialogueLevel {
    return level === 'N1' || level === 'N2' || level === 'N3' || level === 'N4' || level === 'N5'
        ? level
        : 'N5';
}

export function loadDialogueTurns(scenarioId: string, level?: string | null): LifeDialogueTurn[] {
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
    if (Array.isArray(value)) return value as LifeDialogueTurn[];
    if (value && typeof value === 'object') {
        const selected = (value as LifeDialogueLevelSet)[normalizeDialogueLevel(level)];
        if (!Array.isArray(selected)) return [];
        if (key === directKey) return selected;
        const genericId = `GENERIC-CITY-${genericMatch![1]}`;
        return selected.map((turn) => {
            const replace = (value: string | null) => value?.split(genericId).join(scenarioId) ?? null;
            return {
                ...turn,
                id: replace(turn.id)!,
                scenarioId,
                nextDialogueId: replace(turn.nextDialogueId),
            };
        });
    }
    return [];
}
