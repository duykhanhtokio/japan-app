import reusePolicy from './reuse-policy.json';
import building1 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-001.json';
import building2 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-002.json';
import building3 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-003.json';
import building4 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-004.json';
import building5 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-005.json';
import building6 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-006.json';
import building7 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-007.json';
import buildingWeek1 from '../../../docs/ssw-workspace/kensetsu/building/practical/week-001.json';
import civil1 from '../../../docs/ssw-workspace/kensetsu/civil/practical/session-001.json';
import civil2 from '../../../docs/ssw-workspace/kensetsu/civil/practical/session-002.json';
import civil3 from '../../../docs/ssw-workspace/kensetsu/civil/practical/session-003.json';
import civil4 from '../../../docs/ssw-workspace/kensetsu/civil/practical/session-004.json';
import civil5 from '../../../docs/ssw-workspace/kensetsu/civil/practical/session-005.json';
import civil6 from '../../../docs/ssw-workspace/kensetsu/civil/practical/session-006.json';
import civil7 from '../../../docs/ssw-workspace/kensetsu/civil/practical/session-007.json';
import civilWeek1 from '../../../docs/ssw-workspace/kensetsu/civil/practical/week-001.json';
import type { Session, Week, Cluster } from './index';
const originalFieldPracticalSessions: Session[] = [building1, building2, building3, building4, building5, building6, building7, civil1, civil2, civil3, civil4, civil5, civil6, civil7];
export const fieldPracticalWeeks: Week[] = [buildingWeek1, civilWeek1];

// Retain only additional facts in the active reader; original authored JSON stays archived intact.
export const fieldPracticalSessions: Session[] = originalFieldPracticalSessions.flatMap(session => {
 const view = reusePolicy.deltaViews.find(view => view.sessionId === session.id);
 if (!view) return [];
 const ids = new Set(view.activeParagraphIds);
 const clusters = session.clusters.map<Cluster>(cluster => ({ ...cluster,
  paragraphs: cluster.paragraphs.filter(paragraph => ids.has(paragraph.id)),
  // Prior case/reflection activities taught common knowledge again; keep them archived.
  applicationPromptJa: undefined, applicationPromptTranslations: undefined,
  reflectionJa: undefined, reflectionTranslations: undefined,
  terms: undefined,
 })).filter(cluster => cluster.paragraphs.length > 0);
 const visibleJapanese = clusters.flatMap(cluster => cluster.paragraphs.map(p => p.ja)).join('');
 const terms = session.clusters.flatMap(cluster => cluster.terms ?? []).filter(term => visibleJapanese.includes(term.ja));
 if (clusters.length) clusters[0].terms = terms;
 return [{ ...session, clusters }];
});
