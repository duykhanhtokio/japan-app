import {Text,View,type StyleProp,type TextStyle} from 'react-native';
import diagrams from '@/data/agriculture/diagrams.json';
import canonical from '@/data/agriculture/lessons.ja.json';
import support from '@/data/agriculture/concept-native-support.json';
type Token={text:string;readingKana?:string};
type Labels={title:string;alt:string;panels:{title:string;body:string}[]};
type Entry={sourceSnapshot:unknown;lessonBindings:Record<string,{sourceHash:string;revision:string;levels:string[]}>;canonicalJapanese:Record<string,unknown>;locales:Record<string,Labels>;fields:Record<string,{sourceJapanese:string;tokens:Token[]}>};
const registry=support as unknown as {schemaVersion:number;studyOnly:boolean;entries:Record<string,Entry>};
export type ConceptContext={diagramId:string;lessonId:string;lessonSourceHash:string;lessonRevision?:string;level:string};
export const hasConceptSupport=(id:string)=>Object.prototype.hasOwnProperty.call(registry.entries,id);
export function currentConceptEntry(p:ConceptContext){
 const e=registry.entries[p.diagramId],d=diagrams.diagrams.find(d=>d.id===p.diagramId),l=canonical.lessons.find(l=>l.id===p.lessonId),b=e?.lessonBindings[p.lessonId];
 if(registry.schemaVersion!==1||!registry.studyOnly||!e||!d||!l||!b||!p.lessonRevision||p.lessonSourceHash!==b.sourceHash||l.sourceHash!==b.sourceHash||p.lessonRevision!==b.revision||l.revision!==b.revision||!b.levels.includes(p.level)||!l.levels.includes(p.level)||JSON.stringify(d)!==JSON.stringify(e.sourceSnapshot)||JSON.stringify({titleJa:l.titleJa,objectiveJa:l.objectiveJa,paragraphs:l.paragraphs.map(p=>({id:p.id,titleJa:p.titleJa,textJa:p.textJa}))})!==JSON.stringify(e.canonicalJapanese[p.lessonId])||JSON.stringify(e.locales.ja)!==JSON.stringify({title:d.titleJa,alt:d.altJa,panels:d.panels.map(p=>({title:p.titleJa,body:p.bodyJa}))}))return null;
 return e;
}
export function conceptSupportLabels(p:ConceptContext&{language:string}){const e=currentConceptEntry(p),v=e?.locales[p.language],ja=e?.locales.ja;return v&&ja&&v.title?.trim()&&v.alt?.trim()&&v.panels?.length===ja.panels.length&&v.panels.every(x=>x.title?.trim()&&x.body?.trim())?v:null;}
export function conceptSupportReading(p:ConceptContext&{language:string;field:string;text:string}){const e=currentConceptEntry(p),f=e?.fields[p.field];if(p.language!=='ja'||!f||f.sourceJapanese!==p.text||!Array.isArray(f.tokens)||!f.tokens.length||f.tokens.map(t=>t.text).join('')!==p.text||!f.tokens.every(t=>typeof t.text==='string'&&!!t.text&&(t.readingKana===undefined||typeof t.readingKana==='string'&&!!t.readingKana.trim()&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))&&(!/[\p{Script=Han}々]/u.test(t.text)||typeof t.readingKana==='string'&&/^[\p{Script=Hiragana}\p{Script=Katakana}ー\s]+$/u.test(t.readingKana))))return null;return f.tokens;}
export function AgricultureConceptRuby(p:ConceptContext&{language:string;field:string;text:string;style?:StyleProp<TextStyle>;color:string}){const tokens=conceptSupportReading(p);if(!tokens)return <Text style={p.style}>{p.text}</Text>;const parts=tokens.flatMap(t=>t.readingKana?[t]:Array.from(t.text,text=>({text,readingKana:undefined})));return <View accessible accessibilityLabel={p.text} testID={`agri-concept-ruby-${p.diagramId}-${p.field}`} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}>{parts.map((t,i)=><View key={i} style={{alignItems:'center',maxWidth:'100%',minWidth:0}}><Text style={{fontSize:10,lineHeight:14,color:p.color}}>{t.readingKana||' '}</Text><Text style={p.style}>{t.text}</Text></View>)}</View>;}
