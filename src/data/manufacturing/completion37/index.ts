import type {ManufacturingLesson,ManufacturingQuestion,ManufacturingExam,Specialty} from '../index';
import type {LessonTranslation,QuestionTranslation} from '../translations';

type Supplement={specialty:Specialty;lessons:ManufacturingLesson[];checks:ManufacturingExam[]};
type LocaleFile={locale:string;lessons:Record<string,LessonTranslation>;questions:Record<string,QuestionTranslation>};
type Bindings={lessons:Record<string,string>;checks:Record<string,{revision:string;questionIds:string[];questionHashes:Record<string,string>;lessonSourceHashes:Record<string,string>}>};
const bindings=require('./bindings.json') as Bindings;
const isCompletion=(id:string)=>id.includes('-completion37-');
function supplement(specialty:Specialty):Supplement{
 switch(specialty){
  case 'mechanical':return require('./mechanical.json') as Supplement;
  case 'electrical':return require('./electrical.json') as Supplement;
  case 'surface':return require('./surface.json') as Supplement;
 }
}
function localeFile(locale:string):LocaleFile|null{
 switch(locale){
  case 'en':return require('./translations/en.json') as LocaleFile;
  case 'vi':return require('./translations/vi.json') as LocaleFile;
  case 'id':return require('./translations/id.json') as LocaleFile;
  case 'zh-CN':return require('./translations/zh-CN.json') as LocaleFile;
  case 'zh-TW':return require('./translations/zh-TW.json') as LocaleFile;
  case 'tl':return require('./translations/tl.json') as LocaleFile;
  case 'hi':return require('./translations/hi.json') as LocaleFile;
  case 'bn':return require('./translations/bn.json') as LocaleFile;
  case 'ne':return require('./translations/ne.json') as LocaleFile;
  case 'my':return require('./translations/my.json') as LocaleFile;
  case 'th':return require('./translations/th.json') as LocaleFile;
  case 'km':return require('./translations/km.json') as LocaleFile;
  default:return null;
 }
}
const nonempty=(value:unknown):value is string=>typeof value==='string'&&!!value.trim();
function currentLesson(lesson:ManufacturingLesson):ManufacturingLesson|undefined{
 if(!isCompletion(lesson.id))return undefined;
 return manufacturingCompletionLessons(lesson.specialty).find(item=>item.id===lesson.id&&item.sourceHash===lesson.sourceHash);
}
export function manufacturingCompletionLessons(specialty:Specialty):ManufacturingLesson[]{
 return supplement(specialty).lessons.filter(lesson=>bindings.lessons[lesson.id]===lesson.sourceHash);
}
export function manufacturingCompletionChecks(specialty:Specialty):ManufacturingExam[]{
 const data=supplement(specialty),lessons=new Map(data.lessons.map(lesson=>[lesson.id,lesson]));
 return data.checks.filter(exam=>{
  const bound=bindings.checks[exam.id];
  return bound?.revision===exam.revision&&exam.questions.length>0
   &&JSON.stringify(bound.questionIds)===JSON.stringify(exam.questions.map(q=>q.id))
   &&exam.questions.every(q=>bound.questionHashes[q.id]===q.sourceHash&&lessons.get(q.lessonId)?.sourceHash===bound.lessonSourceHashes[q.lessonId]);
 });
}
export function manufacturingCompletionLessonTranslation(lesson:ManufacturingLesson,locale:string):LessonTranslation|null{
 const source=currentLesson(lesson);if(!source)return null;
 const file=localeFile(locale),entry=file?.lessons[lesson.id];
 if(file?.locale!==locale||entry?.sourceHash!==source.sourceHash)return null;
 if(![entry.title,entry.objective,entry.activity,entry.summary].every(nonempty)
  ||!Array.isArray(entry.paragraphs)||entry.paragraphs.length!==source.paragraphs.length
  ||!entry.paragraphs.every((p,i)=>p.id===source.paragraphs[i].id&&nonempty(p.title)&&nonempty(p.text))
  ||!Array.isArray(entry.terms)||entry.terms.length!==source.terms.length
  ||!entry.terms.every((t,i)=>t.ja===source.terms[i].ja&&t.reading===source.terms[i].reading&&nonempty(t.meaning))
  ||!Array.isArray(entry.safety)||entry.safety.length!==source.safetyJa.length||!entry.safety.every(nonempty))return null;
 return entry;
}
export function manufacturingCompletionQuestionTranslation(question:ManufacturingQuestion,locale:string):QuestionTranslation|null{
 if(!isCompletion(question.id))return null;
 const specialties:Specialty[]=['mechanical','electrical','surface'];
 const source=specialties.flatMap(s=>supplement(s).checks.flatMap(exam=>exam.questions)).find(q=>q.id===question.id&&q.sourceHash===question.sourceHash);
 if(!source||source.stemJa!==question.stemJa||source.correctIndex!==question.correctIndex
  ||JSON.stringify(source.optionsJa)!==JSON.stringify(question.optionsJa)
  ||JSON.stringify(source.optionReasonsJa)!==JSON.stringify(question.optionReasonsJa))return null;
 const file=localeFile(locale),entry=file?.questions[question.id];
 return file?.locale===locale&&entry?.sourceHash===source.sourceHash&&nonempty(entry.stem)
  &&Array.isArray(entry.options)&&entry.options.length===source.optionsJa.length&&entry.options.every(nonempty)
  &&Array.isArray(entry.reasons)&&entry.reasons.length===source.optionReasonsJa.length&&entry.reasons.every(nonempty)?entry:null;
}
