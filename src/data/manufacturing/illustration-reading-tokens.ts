import index from './illustration-reading-index.json';

export type ManufacturingIllustrationRubyToken={text:string;readingKana?:string};
/** Only exact whole fields with completed context comparison receive readings; unreviewed, changed or incomplete fields stay plain. */
export function manufacturingIllustrationTokensFor(text:string):ManufacturingIllustrationRubyToken[]|undefined {
 const key=manufacturingReadingKey(text),shards=(index as Record<string,string[]>)[key];
 if(!shards)return undefined;
 let entry:ReadingEntry|undefined;
 for(const shard of shards){const row=loadReviewedShard(shard)[text];if(row?.sourceJa===text){entry=row;break;}}
 if(!entry||entry.contextReview!=='ai_whole_field_compared'||entry.sourceJa!==text||!Array.isArray(entry.tokens)||!entry.tokens.length
  ||entry.tokens.some(t=>!t||typeof t.text!=='string'||!t.text||(t.readingKana!==undefined&&!/^[ぁ-ゖー]+$/.test(t.readingKana))||(/[一-龯々]/.test(t.text)&&!t.readingKana))
  ||entry.tokens.map(t=>t.text).join('')!==text)return undefined;
 return entry.tokens;
}

type ReadingEntry={sourceJa:string;tokens:ManufacturingIllustrationRubyToken[];contextReview?:string};
/** UTF-16 FNV1a locates a shard only; exact text and aligned kana still decide admission. */
function manufacturingReadingKey(text:string){let h=0x811c9dc5;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,0x01000193);}return(h>>>0).toString(16).padStart(8,'0');}
function loadReviewedShard(shard:string):Record<string,ReadingEntry>{switch(shard){
 case 'week01':return require('./illustration-reading-shards/week01.json');
 case 'week02':return require('./illustration-reading-shards/week02.json');
 case 'week03':return require('./illustration-reading-shards/week03.json');
 case 'week04':return require('./illustration-reading-shards/week04.json');
 case 'week05':return require('./illustration-reading-shards/week05.json');
 case 'week06':return require('./illustration-reading-shards/week06.json');
 case 'week07':return require('./illustration-reading-shards/week07.json');
 case 'week08':return require('./illustration-reading-shards/week08.json');
 case 'week09':return require('./illustration-reading-shards/week09.json');
 case 'week10':return require('./illustration-reading-shards/week10.json');
 case 'week11':return require('./illustration-reading-shards/week11.json');
 case 'week12':return require('./illustration-reading-shards/week12.json');
 case 'week13':return require('./illustration-reading-shards/week13.json');
 case 'week14':return require('./illustration-reading-shards/week14.json');
 case 'other':return require('./illustration-reading-shards/other.json');
 default:return {};
}}
