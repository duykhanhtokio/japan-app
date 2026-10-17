import { sessions, weeks, type Field, type Level, type Session, type Week } from './index';

export type Subject = 'theory' | 'practical';
export const subjectLabels: Record<Subject, string> = { theory: '学科', practical: '実技' };
const theorySources = new Set(['kensetsu-src-01', 'kensetsu-src-02', 'kensetsu-src-03', 'kensetsu-src-04']);
const utilitiesPracticalSources = new Set(['kensetsu-src-05', 'kensetsu-src-06', 'kensetsu-src-07']);

/** Publisher correction 2026-10-17 supersedes historical shared applicability metadata. */
export function sessionSubject(session: Session): Subject | null {
  const sourceIds = session.sourceReferences?.map(ref => ref.sourceId) ?? [];
  if (!sourceIds.length) return null;
  if (sourceIds.every(id => theorySources.has(id))) return 'theory';
  if (sourceIds.every(id => theorySources.has(id) || utilitiesPracticalSources.has(id)) &&
      sourceIds.some(id => utilitiesPracticalSources.has(id))) return 'practical';
  return null;
}
export function isSessionInScope(session: Session, level: Level, field: Field, subject: Subject): boolean {
  return level === '1' && sessionSubject(session) === subject && (subject === 'theory' || field === 'utilities');
}
export function sessionsForScope(level: Level, field: Field, subject: Subject): Session[] {
  return sessions.filter(session => isSessionInScope(session, level, field, subject));
}
export function weeksForScope(level: Level, field: Field, subject: Subject): Week[] {
  const ids = new Set(sessionsForScope(level, field, subject).map(session => session.id));
  return weeks.map(week => ({ ...week, sessionIds: week.sessionIds.filter(id => ids.has(id)) }))
    .filter(week => week.sessionIds.length > 0);
}
