import copyJson from './ui-copy.json';
import type { AppLanguageCode } from './languages';

export const uiCopy = copyJson as Record<keyof typeof copyJson, Record<AppLanguageCode, string>>;
export type UiTextKey = keyof typeof copyJson;

export function uiText(key: UiTextKey, language: AppLanguageCode, params: Record<string, string | number> = {}) {
    return uiCopy[key][language].replace(/\{(\w+)\}/g, (token, name: string) => String(params[name] ?? token));
}

// Match complete authored UI strings, including interpolated counts. This is a
// compatibility adapter for old screens, never a machine translation service.
const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
type CopyRow = Record<AppLanguageCode, string>;
const exactSources = new Map<string, CopyRow>();
const templates: { row: CopyRow; names: string[]; pattern: RegExp }[] = [];
for (const row of Object.values(uiCopy)) {
    const source = normalize(row.vi);
    // The legacy scan returns the first matching row, including duplicates.
    if (!exactSources.has(source)) exactSources.set(source, row);
    if (!row.vi.includes('{')) continue;
    const names: string[] = [];
    const pattern = source.split(/(\{\w+\})/).map(part => {
        if (/^\{\w+\}$/.test(part)) { names.push(part.slice(1, -1)); return '(.+?)'; }
        return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('');
    templates.push({ row, names, pattern: new RegExp('^' + pattern + '$') });
}
export function translatedUiSource(value: string, language: AppLanguageCode): string | undefined {
    const source = normalize(value);
    const exact = exactSources.get(source);
    if (exact) return exact[language];
    for (const { row, names, pattern } of templates) {
        const match = pattern.exec(source);
        if (match) {
            const params = Object.fromEntries(names.map((name, i) => [name, match[i + 1]]));
            return row[language].replace(/\{(\w+)\}/g, (token, name: string) => params[name] ?? token);
        }
    }
    return undefined;
}
