type LocaleText=Record<string,string>;
export type TranslationBundle={sessionId:string;entries:Record<string,{sourceJa:string;translations:LocaleText}>};
type LocalizableParagraph={id:string;ja:string;translations?:LocaleText};
type LocalizableCluster={id:string;titleJa:string;titleTranslations?:LocaleText;paragraphs:LocalizableParagraph[];
 applicationPromptJa?:string;applicationPromptTranslations?:LocaleText;reflectionJa?:string;reflectionTranslations?:LocaleText;
 learningActivity?:{ja:string;translations?:LocaleText;graded?:boolean};
 terms?:{ja:string;reading:string;translations?:LocaleText;vi?:string}[];
 illustration?:{assetPath:string;captionJa:string;captionTranslations?:LocaleText}};
type LocalizableSession={id:string;titleJa:string;titleTranslations?:LocaleText;clusters:LocalizableCluster[]};

// Never show an overlay translation after its own Japanese source has changed.
// A mismatch also suppresses an older inline translation for that same unit.
export function applyLessonTranslations<T extends LocalizableSession>(session:T,bundle:TranslationBundle):T{
 if(session.id!==bundle.sessionId)return session;
 const texts=(id:string,ja:string|undefined,existing?:LocaleText):LocaleText|undefined=>{
  const entry=bundle.entries[id];
  if(!entry)return existing;
  return entry.sourceJa===ja?{...existing,...entry.translations}:undefined;
 };
 return {...session,titleTranslations:texts('title',session.titleJa,session.titleTranslations),clusters:session.clusters.map(c=>({
  ...c,titleTranslations:texts(c.id+':title',c.titleJa,c.titleTranslations),
  paragraphs:c.paragraphs.map(p=>({...p,translations:texts(p.id,p.ja,p.translations)})),
  applicationPromptTranslations:texts(c.id+':prompt',c.applicationPromptJa,c.applicationPromptTranslations),
  reflectionTranslations:texts(c.id+':reflection',c.reflectionJa,c.reflectionTranslations),
  learningActivity:c.learningActivity?{...c.learningActivity,translations:texts('learningActivity',c.learningActivity.ja,c.learningActivity.translations)}:undefined,
  terms:c.terms?.map(t=>({...t,translations:texts(c.id+':term:'+t.ja,t.ja,t.translations)})),
  illustration:c.illustration?{...c.illustration,captionTranslations:texts(c.id+':caption',c.illustration.captionJa,c.illustration.captionTranslations)}:undefined,
 }))} as T;
}
