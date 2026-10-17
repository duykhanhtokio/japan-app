import paragraphReuse from './paragraph-reuse-policy.json';
import reusePolicy from './reuse-policy.json';
import { sessions, weeks, type Field, type Level, type Session, type Week } from './index';

export type Subject = 'theory' | 'practical' | 'foreman';
export const subjectLabels: Record<Subject, string> = { theory: '学科', practical: '実技', foreman: '職長' };
const theorySources = new Set(['kensetsu-src-01', 'kensetsu-src-02', 'kensetsu-src-03', 'kensetsu-src-04']);
const practicalSources: Record<Field, Set<string>> = {
 utilities: new Set(['kensetsu-src-05', 'kensetsu-src-06', 'kensetsu-src-07']),
 building: new Set(['kensetsu-src-5k', 'kensetsu-src-6k', 'kensetsu-src-7k']),
 civil: new Set(['kensetsu-src-5d', 'kensetsu-src-6d', 'kensetsu-src-7d']),
};
const allPracticalSources = new Set(Object.values(practicalSources).flatMap(ids => [...ids]));

/** Publisher correction 2026-10-17 supersedes historical shared applicability metadata. */
export function sessionSubject(session: Session): Subject | null {
  const sourceIds = session.sourceReferences?.map(ref => ref.sourceId) ?? [];
  if (!sourceIds.length) return null;
  if (sourceIds.every(id => id === 'kensetsu-2go-foreman-leader-20250115')) return 'foreman';
  if (sourceIds.every(id => theorySources.has(id))) return 'theory';
  if (sourceIds.every(id => theorySources.has(id) || allPracticalSources.has(id)) &&
      sourceIds.some(id => allPracticalSources.has(id))) return 'practical';
  return null;
}
export function isSessionInScope(session: Session, level: Level, field: Field, subject: Subject): boolean {
  if (subject === 'foreman') return level === '2' && sessionSubject(session) === 'foreman';
  if (reusePolicy.retiredSessionIds.includes(session.id) || sessionSubject(session) !== subject) return false;
  if (subject === 'practical' && field !== 'utilities' && reusePolicy.canonicalPracticalAssignments[field].includes(session.id)) return true;
  if (subject === 'practical' && field === 'civil' && reusePolicy.crossFieldDeltaAssignments.civil.includes(session.id)) return true;
  return subject === 'theory' || !!session.sourceReferences?.every(ref => theorySources.has(ref.sourceId) || practicalSources[field].has(ref.sourceId));
}
const scopedViews = new Map<string, Session>();
function viewForField(session: Session, field: Field): Session {
 const specs = paragraphReuse.supplements.filter(spec => spec.targetSessionId === session.id && spec.fields.includes(field));
 if (!specs.length) return session;
 const revision = specs.map(spec => spec.scopeRevision).join('+');
 const key = `${field}:${session.id}:${revision}`;
 const cached = scopedViews.get(key); if (cached) return cached;
 const additions = specs.flatMap(spec => {
  const source = sessions.find(candidate => candidate.id === spec.sourceSessionId)!;
  const ids = new Set(spec.paragraphIds);
  // Reuse the exact translated paragraphs. Do not import unrelated activities, terms or pictures.
  return source.clusters.flatMap(cluster => {
   const paragraphs = cluster.paragraphs.filter(paragraph => ids.has(paragraph.id));
   return paragraphs.length ? [{id: cluster.id, titleJa: cluster.titleJa,
    titleTranslations: cluster.titleTranslations, paragraphs}] : [];
  });
 });
 const view: Session = { ...session, scopeRevision: revision, clusters: [...session.clusters, ...additions] };
 scopedViews.set(key, view); return view;
}
const scopeLists = new Map<string, Session[]>();
const paragraphSets = new Map<string, Set<string>>();
export function sessionsForScope(level: Level, field: Field, subject: Subject): Session[] {
 const key = `${level}:${field}:${subject}`;
 const cached = scopeLists.get(key); if (cached) return cached;
 const list = sessions.filter(session => isSessionInScope(session, level, field, subject)).map(session => viewForField(session, field));
 scopeLists.set(key, list); return list;
}
export function sessionForScope(id: string, level: Level, field: Field, subject: Subject): Session | undefined {
 return sessionsForScope(level, field, subject).find(session => session.id === id);
}
export function paragraphIdsForScope(id: string, level: Level, field: Field, subject: Subject): Set<string> {
 const key = `${level}:${field}:${subject}:${id}`;
 const cached = paragraphSets.get(key); if (cached) return cached;
 const session = sessionForScope(id, level, field, subject);
 const ids = new Set(session?.clusters.flatMap(cluster => cluster.paragraphs.map(p => p.id)) ?? []);
 paragraphSets.set(key, ids); return ids;
}

export function weeksForScope(level: Level, field: Field, subject: Subject): Week[] {
  const ids = new Set(sessionsForScope(level, field, subject).map(session => session.id));
  return weeks.map(week => ({ ...week, sessionIds: week.sessionIds.filter(id => ids.has(id)) }))
    .filter(week => week.sessionIds.length > 0);
}
