import data from './illustration-readings.json';
import type {RubyToken} from './types';

/** Exact inventoried illustration text only. Stale text never receives a partial or guessed reading. */
export function illustrationRubyTokensFor(text:string):RubyToken[]|undefined {
 const entry=(data.entries as Record<string,{sourceJa:string;tokens:RubyToken[]}>)[text];
 if(!entry || entry.sourceJa!==text || entry.tokens.map(t=>t.text).join('')!==text
   || entry.tokens.some(t=>/[一-龯々]/.test(t.text) && (!t.readingKana || !/^[ぁ-ゖー]+$/.test(t.readingKana)))) return undefined;
 return entry.tokens;
}
