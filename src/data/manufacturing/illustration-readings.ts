import data from './illustration-readings.json';

export type ManufacturingIllustrationRubyToken={text:string;readingKana?:string};
/** Only complete inventoried fields receive readings; changed or incomplete fields stay plain. */
export function manufacturingIllustrationTokensFor(text:string):ManufacturingIllustrationRubyToken[]|undefined {
 const entry=(data.nativeEntries as Record<string,{sourceJa:string;tokens:ManufacturingIllustrationRubyToken[]}>)[text];
 if(!entry||entry.sourceJa!==text||!Array.isArray(entry.tokens)||!entry.tokens.length
  ||entry.tokens.some(t=>!t||typeof t.text!=='string'||!t.text||(t.readingKana!==undefined&&!/^[ぁ-ゖー]+$/.test(t.readingKana))||(/[一-龯々]/.test(t.text)&&!t.readingKana))
  ||entry.tokens.map(t=>t.text).join('')!==text)return undefined;
 return entry.tokens;
}
