import sectionHeadings from './section-headings.json';
import {kaigoCourse,kaigoAtomicKnowledge,kaigoLanguageSupplements} from './index';
import {kaigoCatalog,type CatalogEntry} from './catalog';
import type {RubyToken,MockForm,LanguageTask} from './types';

export type ReadingSection={id:string;heading:string;paragraphs:string[];japanese?:string;ruby?:RubyToken[];parentDay:number;figureKeys?:{key:string;captionVi:string}[]};
export type WeeklyQuestion={id:string;day:number;prompt:string;japanese?:string;ruby?:RubyToken[];options:string[];correctIndex:number;rationales:string[];reading?:string;readingRuby?:RubyToken[];language:'vi'|'ja'};
export type Completion={version:1;days:Record<string,true>;assessments:Record<string,true>;lastWeek?:number};
export const completionKey='@japan_app_kaigo_weekly:completion:v1';
export const emptyCompletion=():Completion=>({version:1,days:{},assessments:{}});
export const learningWeeks=Array.from({length:26},(_,i)=>({week:i+1,slots:Array.from({length:7},(_,j)=>({day:i*7+j+1,entry:kaigoCatalog.find(e=>e.day===i*7+j+1)??null}))}));
export function restoreCompletion(raw:string|null):Completion{try{const p=JSON.parse(raw??'null');if(p?.version!==1||!p.days||!p.assessments)return emptyCompletion();const valid=(o:unknown,max:number)=>o&&typeof o==='object'&&!Array.isArray(o)?Object.fromEntries(Object.entries(o).filter(([k,v])=>/^\d+$/.test(k)&&Number(k)>=1&&Number(k)<=max&&v===true)):{};return {version:1,days:valid(p.days,176),assessments:valid(p.assessments,26),lastWeek:Number.isInteger(p.lastWeek)&&p.lastWeek>=1&&p.lastWeek<=26?p.lastWeek:1};}catch{return emptyCompletion();}}
export function weekDone(week:number,progress:Completion){const active=learningWeeks[week-1]?.slots.filter(s=>s.entry);return !!active?.length&&active.every(s=>progress.days[s.day])&&!!progress.assessments[week];}
const heading=(text:string,index:number)=>{const colon=text.indexOf(':');return colon>0&&colon<90?text.slice(0,colon):`Ý ${index+1} · ${text.split(/[.!?]/)[0]}`;};
export function sectionsFor(entry:CatalogEntry,includeCandidates=true):ReadingSection[]{
 const day=entry.day,parentDay=entry.parentDay;
 if(entry.kind==='atomic')return (kaigoAtomicKnowledge.days.find(d=>d.day===day)?.unitIds??[]).flatMap(id=>{const u=kaigoAtomicKnowledge.units.find(u=>u.id===id);return u?[{id:u.id,heading:u.titleVi,paragraphs:[...u.points.map(p=>p.explanationVi),u.limitsVi],parentDay:u.parentDay}]:[];});
 if(entry.kind==='language'){const d=kaigoLanguageSupplements.days.find(d=>d.day===day),g=kaigoLanguageSupplements.groups.find(g=>g.id===d?.groupId);if(!g)return [];return [{id:g.id+'-notes',heading:g.titleVi,paragraphs:g.notesVi,parentDay},...g.tasks.map(t=>({id:t.id,heading:t.titleVi,paragraphs:[],japanese:t.textJa,ruby:t.furigana,parentDay})),{id:g.id+'-terms',heading:'Từ vựng để tra cứu',paragraphs:g.referenceTermIds.flatMap(id=>{const t=kaigoCourse.terms.find(t=>t.id===id);return t?[`${t.termJa}（${t.readingJa}）· ${t.meaningVi}`]:[];}),parentDay}];}
 if(entry.kind==='mock')return [{id:'scheduled-'+day,heading:entry.titleVi,paragraphs:['Buổi luyện thi theo lịch. Mở đề ở mục Thi thử bên dưới; các đáp án và vị trí câu của lượt cũ vẫn được giữ.',entry.mockParts===2?`Đây là phần ${entry.mockPart}/2 của cùng đề kỹ năng. Hai buổi luyện 30 phút không phải một lượt thi liên tục 60 phút.`:'Đề tiếng Nhật có 15 câu trong 30 phút.','Bài đánh giá nội dung tuần nằm riêng ở cuối lịch tuần; không thay thế đề thi đầy đủ.'],parentDay}];
 const l=[...kaigoCourse.lessons,...kaigoCourse.candidates].find(l=>l.id===entry.id);if(!l)return [];
 const sections:ReadingSection[]=l.knowledgeSectionsVi.map((text,i)=>({id:l.id+'-knowledge-'+i,heading:(sectionHeadings as Record<string,string>)[l.id+'-knowledge-'+i]??heading(text,i),paragraphs:[text],parentDay}));
 if(l.knowledgeSummaryJa)sections.unshift({id:l.id+'-summary',heading:l.knowledgeTitleVi??l.titleVi,paragraphs:[],japanese:l.knowledgeSummaryJa,parentDay});
 for(const u of l.knowledgeDepthUnits??[])sections.push({id:u.id,heading:u.titleVi,paragraphs:[u.knowledgeVi,u.methodVi,u.mistakesVi,u.limitsVi],parentDay,figureKeys:u.figures});
 if(l.contrast)sections.push({id:l.id+'-case',heading:'Tình huống và nguyên tắc áp dụng',paragraphs:[l.contrast.case,l.contrast.correctPrinciple,l.contrast.overreachToAvoid].filter((x):x is string=>!!x),parentDay});
 sections.push({id:l.id+'-words',heading:'Từ vựng và cách nói',paragraphs:[...kaigoCourse.terms.filter(t=>l.termIds.includes(t.id??'')).map(t=>`${t.termJa}（${t.readingJa}）· ${t.meaningVi}`),...l.inlineNotes.map(t=>`${t.termJa}（${t.readingJa}）· ${t.meaningVi}`),...l.expressions.map(e=>`${e.textJa}\n${e.meaningVi}`)],parentDay});
 sections.push({id:l.id+'-dialogue',heading:'Hội thoại trong tình huống',paragraphs:[l.contextVi,...l.dialogue.map(t=>`${t.speaker==='npc'?(kaigoCourse.npcs.find(n=>n.id===t.npcId)?.nameJa??'Người đối thoại'):'Bạn'}: ${t.textJa}\n${t.meaningVi}`)],parentDay});
 for(const v of l.transfers)sections.push({id:v.id,heading:v.titleVi,paragraphs:[v.contextVi,v.boundaryVi,...v.steps.flatMap(t=>[t.promptVi,t.promptJa,t.promptMeaningVi,t.modelJa,t.modelVi,...t.meaningsVi,...t.alternativesJa,t.replyJa,t.replyVi].filter(Boolean))],parentDay});
 if(l.readingJa)sections.push({id:l.id+'-reading',heading:'Đọc văn bản',japanese:l.readingJa,paragraphs:[l.readingVi],parentDay});
 for(const t of l.languageTasks??[])sections.push({id:t.id,heading:t.titleVi,japanese:t.textJa,ruby:t.furigana,paragraphs:[],parentDay});
 if(includeCandidates)for(const c of kaigoCourse.candidates.filter(c=>c.baseLessonId===l.id))sections.push({id:c.id+'-intro',heading:'Tình huống bổ sung · '+c.titleVi,paragraphs:[c.contextVi],parentDay},...sectionsFor({...entry,id:c.id,titleVi:c.titleVi},false));
 // Old written probes become weekly questions. No input/reveal cards are rendered in the reader.
 return sections;
}
type ProbeRecord={id:string;day:number;parentDay:number;prompt:string;expected:string;reading?:string;ruby?:RubyToken[]};
const probeRecords:ProbeRecord[]=[];
for(const e of kaigoCatalog){
 if(e.kind==='atomic'){for(const id of kaigoAtomicKnowledge.days.find(d=>d.day===e.day)?.unitIds??[]){const u=kaigoAtomicKnowledge.units.find(u=>u.id===id)!;probeRecords.push({id:u.probe.id,day:e.day,parentDay:u.parentDay,prompt:u.probe.promptVi,expected:u.probe.expectedVi});}}
 if(e.kind==='language'){const d=kaigoLanguageSupplements.days.find(d=>d.day===e.day),g=kaigoLanguageSupplements.groups.find(g=>g.id===d?.groupId)!;for(const t of g.tasks)probeRecords.push({id:t.id,day:e.day,parentDay:g.parentDay,prompt:t.promptVi,expected:t.expectedVi,reading:t.textJa,ruby:t.furigana});}
 if(e.kind==='lesson'){for(const l of kaigoCourse.lessons.filter(l=>l.id===e.id).flatMap(l=>[l,...kaigoCourse.candidates.filter(c=>c.baseLessonId===l.id)])){for(const p of [...l.knowledgeProbes??[],...l.knowledgeDepthUnits?.map(u=>u.probe)??[],...l.languageTasks??[],...(l.retrieval?[{id:l.id+'-retrieval',...l.retrieval}]:[])])probeRecords.push({id:p.id,day:e.day,parentDay:e.parentDay,prompt:p.promptVi,expected:p.expectedVi,...(typeof (p as Partial<LanguageTask>).textJa==='string'?{reading:(p as LanguageTask).textJa,ruby:(p as LanguageTask).furigana}:{})});}}
}
const words=(s:string)=>new Set(s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(x=>x.length>3));
const overlap=(a:Set<string>,b:Set<string>)=>[...a].filter(x=>b.has(x)).length/Math.max(1,a.size);
// Recognition conversion of project-authored cases: three explanations belonging to
// different course contexts are distractors. No false medical instruction is invented.
const recordWords=new Map(probeRecords.map(p=>[p.id,words(p.prompt+' '+p.expected)]));
const converted=probeRecords.map((p,index):WeeklyQuestion=>{
 const target=recordWords.get(p.id)!,seen=new Set([p.expected]);
 const pool=probeRecords.filter(x=>x.id!==p.id&&x.parentDay!==p.parentDay&&x.expected!==p.expected).sort((a,b)=>overlap(target,recordWords.get(a.id)!)-overlap(target,recordWords.get(b.id)!)||a.id.localeCompare(b.id));
 const others=pool.filter(x=>{if(seen.has(x.expected))return false;seen.add(x.expected);return true;}).slice(0,3);
 const position=[2,0,3,1,0,2,1,3][index%8],options=others.map(x=>x.expected);options.splice(position,0,p.expected);
 return {id:'weekly-'+p.id,day:p.day,prompt:p.prompt+'\nChọn phần giải thích trả lời đúng dữ kiện của tình huống.',options,correctIndex:position,rationales:options.map((o,i)=>i===position?p.expected:'Phần giải thích này thuộc một tình huống khác; không trả lời các dữ kiện cần xác nhận trong câu hỏi này.'),reading:p.reading,readingRuby:p.ruby,language:'vi'};
});
const baseQuestions:WeeklyQuestion[]=kaigoCatalog.filter(e=>e.kind==='lesson').flatMap(e=>{return kaigoCourse.lessons.filter(l=>l.id===e.id).flatMap(l=>[l,...kaigoCourse.candidates.filter(c=>c.baseLessonId===l.id)]).flatMap(l=>l.questions.map(q=>({id:'weekly-'+q.id,day:e.day,prompt:q.promptVi,japanese:q.promptJa,options:q.optionsJa,correctIndex:q.correctIndex,rationales:q.rationalesVi,reading:l.readingJa,language:'ja' as const})));});
export const weeklyQuestions=[...baseQuestions,...converted];
export const questionsForWeek=(week:number)=>weeklyQuestions.filter(q=>Math.ceil(q.day/7)===week);
export function assessmentRevisionForWeek(week:number){let hash=2166136261;for(const char of JSON.stringify(questionsForWeek(week)))hash=Math.imul(hash^char.charCodeAt(0),16777619);return 'weekly-recognition-v1-'+(hash>>>0).toString(16);}
export const mockForDay=(day:number):MockForm|undefined=>{const e=kaigoCatalog.find(e=>e.day===day);return e?.kind==='mock'?kaigoCourse.mocks.find(m=>m.id===e.id):undefined;};
