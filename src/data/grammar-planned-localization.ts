import contentJson from './generated/grammar-planned-content.json';
import extraJson from './generated/grammar-planned-extra-localizations.json';
import progressJson from './generated/grammar-planned-progress-bindings.json';
import { generatedGrammar, getGrammarMeaning, getGrammarExampleTranslation } from './jlpt-study-data';
import { getGrammarCopy } from '@/i18n/grammar-copy';
import type { AppLanguageCode } from '@/i18n/languages';

type Sample = { exampleJa: string; exampleReading?: string; exampleTranslation?: string };
type Mapping = { nameJa: string; canonicalIds: string[]; extraId: string | null; expectedSourceExamples: string[] };
type Extra = { nameJa: string; pattern: string; formation: string; meanings: Record<AppLanguageCode,string>; example: { exampleJa:string; exampleReading:string; translations:Record<Exclude<AppLanguageCode,'ja'>,string> } };
type PlannedSource = { pattern:string; example:{ japanese:string } };
export type LocalizedPlannedGrammar = {
    id:string; name:string; reading?:string; meaning:string; pattern?:string; formation?:string;
    examples:Sample[];
};
const content = contentJson as Record<string,Mapping>;
const extras = extraJson as Record<string,Extra>;
const progress = progressJson as Record<string,{pattern:string;progressId:string}>;
const catalog = new Map(generatedGrammar.map(x=>[x.id,x]));

/** Content selection is semantic and explicit; legacy learned keys stay fixed. */
export function getPlannedGrammar(day:number,index:number,source:PlannedSource,language:AppLanguageCode):LocalizedPlannedGrammar {
    const key=`${day}:${index}`, previous=progress[key], mapping=content[source.pattern], copy=getGrammarCopy(language);
    const id=previous?.progressId ?? `n5-plan:grammar:${day}:${index}`;
    const pending=():LocalizedPlannedGrammar=>({id,name:mapping?.nameJa??source.pattern,meaning:copy.pending,
        examples:[{exampleJa:source.example.japanese,exampleTranslation:language==='ja'?undefined:copy.pending}]});
    if(!mapping||previous?.pattern!==source.pattern||!mapping.expectedSourceExamples.includes(source.example.japanese))return pending();
    if(mapping.extraId){
        const item=extras[mapping.extraId];if(!item)return pending();
        return {id,name:item.nameJa,meaning:item.meanings[language]??copy.pending,pattern:item.pattern,formation:item.formation,
            examples:[{exampleJa:item.example.exampleJa,exampleReading:item.example.exampleReading,
                exampleTranslation:language==='ja'?undefined:item.example.translations[language]??copy.pending}]};
    }
    const items=mapping.canonicalIds.map(id=>catalog.get(id));
    if(!items.length||items.some(x=>!x))return pending();
    const valid=items.filter((x):x is NonNullable<typeof x>=>!!x);
    return {id,name:mapping.nameJa,meaning:valid.map(x=>getGrammarMeaning(x,language)).join('\n'),
        pattern:valid.map(x=>x.pattern).filter(Boolean).join(' / '),
        formation:valid.map(x=>x.formation).filter(Boolean).join(' / ')||undefined,
        examples:valid.filter(x=>x.exampleJa).map(x=>({exampleJa:x.exampleJa!,exampleReading:x.exampleReading,exampleTranslation:getGrammarExampleTranslation(x,language)}))};
}
