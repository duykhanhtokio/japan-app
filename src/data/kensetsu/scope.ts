import paragraphReuse from './paragraph-reuse-policy.json';
import dailyGroups from './daily-study-groups.json';
import technicalFigures from './daily-technical-figures.json';
import reusePolicy from './reuse-policy.json';
import { completionId, sessions, weeks, type Field, type Level, type Session, type Week } from './index';

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

/** A learning day may contain several existing short, same-topic sessions.
 * Canonical source/question lookups above remain unchanged. */
const dailyGroupCache = new Map<string, string[][]>();
function activeDailyGroups(level: Level, field: Field, subject: Subject): string[][] {
 const key = `${level}:${field}:${subject}`;
 const cached = dailyGroupCache.get(key); if (cached) return cached;
 const allowed = new Set(sessionsForScope(level, field, subject).map(s => s.id));
 const groups = dailyGroups.groups.map(g => g.memberIds.filter(id => allowed.has(id))).filter(ids => ids.length > 1);
 dailyGroupCache.set(key, groups); return groups;
}
export function studyDayIdForSession(id: string, level: Level, field: Field, subject: Subject): string {
 return activeDailyGroups(level, field, subject).find(ids => ids.includes(id))?.[0] ?? id;
}
export function studyDayMembers(id: string, level: Level, field: Field, subject: Subject): Session[] {
 const memberIds = activeDailyGroups(level, field, subject).find(ids => ids.includes(id)) ?? [id];
 const byId = new Map(sessionsForScope(level, field, subject).map(s => [s.id, s]));
 return memberIds.map(member => byId.get(member)).filter((s): s is Session => !!s);
}
const dailyViewCache = new Map<string, Session>();
export function studyDayForScope(id: string, level: Level, field: Field, subject: Subject): Session | undefined {
 const primaryId = studyDayIdForSession(id, level, field, subject);
 const key = `${level}:${field}:${subject}:${primaryId}`;
 const cached = dailyViewCache.get(key); if (cached) return cached;
 const members = studyDayMembers(id, level, field, subject);
 if (!members.length) return undefined;
 const primary = members[0];
 const addedFigures = technicalFigures.figures.flatMap(figure => {
  const member = members.find(candidate => figure.bindings.some(binding =>
   candidate.id === binding.sessionId && candidate.revision === binding.revision && candidate.clusters.some(cluster =>
    cluster.paragraphs.some(p => p.id === binding.paragraphId && p.ja === binding.paragraphJa))));
  // Reuse exact canonical Japanese captions and their 12 direct translations.
  // New diagram-design/scoping descriptions stay in the authoring register.
  return member ? [{path: figure.assetPath, altJa: member.titleJa, altTranslations: member.titleTranslations}] : [];
 });
 // Every paragraph retains its ID, direct translations and technical claims.
 const clusters = [...new Map(members.flatMap(s => s.clusters).map(c => [c.id, c])).values()];
 const sourceReferences = [...new Map(members.flatMap(s => s.sourceReferences ?? []).map(r => [r.sourceId, r])).values()];
 const view = { ...primary, clusters, sourceReferences,
  illustrations: [...members.flatMap(s => s.illustrations ?? []), ...addedFigures],
  keyTerms: [...new Map(members.flatMap(s => s.keyTerms ?? []).map(t => [t.term, t])).values()] };
 dailyViewCache.set(key, view); return view;
}
export function studyDayCompletionIds(id: string, level: Level, field: Field, subject: Subject): string[] {
 return studyDayMembers(id, level, field, subject).map(completionId);
}
export function weeksForScope(level: Level, field: Field, subject: Subject): Week[] {
 const ids = new Set(sessionsForScope(level, field, subject).map(s => s.id));
 return weeks.flatMap(week => {
  const kept = week.sessionIds.filter(id => ids.has(id) && studyDayIdForSession(id, level, field, subject) === id);
  // Preserve order and week IDs; split any historical eighth slot into a continuation.
  const parts: Week[] = [];
  for (let start = 0; start < kept.length; start += 7) parts.push({ ...week,
   id: start ? `${week.id}:continuation:${Math.floor(start / 7) + 1}` : week.id,
   sessionIds: kept.slice(start, start + 7) });
  return parts;
 });
}
