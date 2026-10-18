type LocaleText=Record<string,string>;
export type TranslationBundle={sessionId:string;entries:Record<string,{sourceJa:string;translations:LocaleText}>};
type LocalizableParagraph={id:string;ja:string;translations?:LocaleText};
type LocalizableCluster={id:string;titleJa:string;titleTranslations?:LocaleText;paragraphs:LocalizableParagraph[];
 applicationPromptJa?:string;applicationPromptTranslations?:LocaleText;reflectionJa?:string;reflectionTranslations?:LocaleText;
 learningActivity?:{ja:string;translations?:LocaleText;graded?:boolean};
 terms?:{ja:string;reading:string;translations?:LocaleText;vi?:string}[];
 illustration?:{assetPath:string;captionJa:string;captionTranslations?:LocaleText}};
type LocalizableSession={id:string;titleJa:string;titleTranslations?:LocaleText;clusters:LocalizableCluster[];
 keyTerms?:{term:string;reading:string;translations?:LocaleText}[];
 illustrations?:{path:string;altJa:string;altTranslations?:LocaleText;clusterId?:string}[]};

export function collectTranslatableUnits(session:LocalizableSession):Record<string,string>{
 const units:Record<string,string>={title:session.titleJa};
 const sharedActivity=new Set(session.clusters.map(c=>c.learningActivity?.ja).filter(Boolean)).size<=1;
 const add=(id:string,ja:string|undefined)=>{if(!ja)return;if(units[id]!==undefined&&units[id]!==ja)throw new Error(`Conflicting translation unit: ${id}`);units[id]=ja;};
 for(const c of session.clusters){
  add(c.id+':title',c.titleJa);for(const p of c.paragraphs)add(p.id,p.ja);
  add(c.id+':prompt',c.applicationPromptJa);add(c.id+':reflection',c.reflectionJa);
  add(c.id+':caption',c.illustration?.captionJa);add(sharedActivity?'learningActivity':c.id+':activity',c.learningActivity?.ja);
  for(const t of c.terms??[])add(c.id+':term:'+t.ja,t.ja);
 }
 for(const t of session.keyTerms??[])add('keyTerm:'+t.term,t.term);
 session.illustrations?.forEach((a,i)=>add(`illustration:${i}:alt`,a.altJa));
 return units;
}

// Never show an overlay translation after its own Japanese source has changed.
// A mismatch also suppresses an older inline translation for that same unit.
export function applyLessonTranslations<T extends LocalizableSession>(session:T,bundle:TranslationBundle):T{
 if(session.id!==bundle.sessionId)return session;
 const texts=(id:string,ja:string|undefined,existing?:LocaleText):LocaleText|undefined=>{
  const entry=bundle.entries[id];
  if(!entry)return existing;
  return entry.sourceJa===ja?{...existing,...entry.translations}:undefined;
 };
 return {...session,titleTranslations:texts('title',session.titleJa,session.titleTranslations),
 keyTerms:session.keyTerms?.map(t=>({...t,translations:texts('keyTerm:'+t.term,t.term,t.translations)})),
 illustrations:session.illustrations?.map((a,i)=>({...a,altTranslations:texts(`illustration:${i}:alt`,a.altJa,a.altTranslations)})),
 clusters:session.clusters.map(c=>({
  ...c,titleTranslations:texts(c.id+':title',c.titleJa,c.titleTranslations),
  paragraphs:c.paragraphs.map(p=>({...p,translations:texts(p.id,p.ja,p.translations)})),
  applicationPromptTranslations:texts(c.id+':prompt',c.applicationPromptJa,c.applicationPromptTranslations),
  reflectionTranslations:texts(c.id+':reflection',c.reflectionJa,c.reflectionTranslations),
  learningActivity:c.learningActivity?{...c.learningActivity,translations:texts(bundle.entries[c.id+':activity']?c.id+':activity':'learningActivity',c.learningActivity.ja,c.learningActivity.translations)}:undefined,
  terms:c.terms?.map(t=>({...t,translations:texts(c.id+':term:'+t.ja,t.ja,t.translations)})),
  illustration:c.illustration?{...c.illustration,captionTranslations:texts(c.id+':caption',c.illustration.captionJa,c.illustration.captionTranslations)}:undefined,
 }))} as T;
}

/** Validate each locale independently before combining overlays for one lesson. */
export function applyLocaleLessonBundles<T extends LocalizableSession>(session:T,
 bundles:readonly (TranslationBundle | undefined)[]):T {
 const sources=collectTranslatableUnits(session),entries:TranslationBundle['entries']={};
 for(const bundle of bundles){
  if(!bundle || bundle.sessionId!==session.id)continue;
  for(const [id,entry]of Object.entries(bundle.entries)){
   if(sources[id]===undefined)continue;
   if(entry.sourceJa===sources[id]){
    const previous=entries[id];
    entries[id]={sourceJa:entry.sourceJa,translations:{
     ...(previous?.sourceJa===entry.sourceJa?previous.translations:{}),...entry.translations}};
   }else if(!entries[id]){
    // When every overlay is stale, retain the original mismatch suppression.
    entries[id]={sourceJa:entry.sourceJa,translations:{}};
   }
  }
 }
 return applyLessonTranslations(session,{sessionId:session.id,entries});
}
