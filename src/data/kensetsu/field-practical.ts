import b3 from './differential-translations/b3.json';
import b4 from './differential-translations/b4.json';
import b5 from './differential-translations/b5.json';
import b6 from './differential-translations/b6.json';
import b7 from './differential-translations/b7.json';
import c3 from './differential-translations/c3.json';
import c5 from './differential-translations/c5.json';
import c6 from './differential-translations/c6.json';
import c7 from './differential-translations/c7.json';
import b8 from './differential-translations/b8.json';
import { applyLessonTranslations, type TranslationBundle } from './localization';
import building8 from '../../../docs/ssw-workspace/kensetsu/building/practical/session-008.json';
import buildingWeek2 from '../../../docs/ssw-workspace/kensetsu/building/practical/week-002.json';
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
const originalFieldPracticalSessions: Session[] = [building1, building2, building3, building4, building5, building6, building7, civil1, civil2, civil3, civil4, civil5, civil6, civil7, building8];
export const fieldPracticalWeeks: Week[] = [
 {...buildingWeek1, titleJa: '構造工事の工具・部材の補足'},
 {...civilWeek1, titleJa: '土木に固有の機械・設備の補足'},
 buildingWeek2,
];

const differentialTranslations = new Map<string, TranslationBundle>([b3, b4, b5, b6, b7, c3, c5, c6, c7, b8].map(bundle => [bundle.sessionId, bundle]));

// Retain only additional facts in the active reader; original authored JSON stays archived intact.
export const fieldPracticalSessions: Session[] = originalFieldPracticalSessions.flatMap(session => {
 const view = reusePolicy.deltaViews.find(view => view.sessionId === session.id);
 if (!view) return [];
 const ids = new Set(view.activeParagraphIds);
 const clusters = session.clusters.map<Cluster>(cluster => ({ ...cluster, titleJa: session.titleJa,
  illustration: {assetPath: `assets/kensetsu/differential/${session.id.includes('-building-') ? 'b' : 'c'}${Number(session.id.split('-').pop())}.png`, captionJa: session.titleJa},
  paragraphs: cluster.paragraphs.filter(paragraph => ids.has(paragraph.id)),
  // Prior case/reflection activities taught common knowledge again; keep them archived.
  applicationPromptJa: undefined, applicationPromptTranslations: undefined,
  reflectionJa: undefined, reflectionTranslations: undefined,
  terms: undefined,
 })).filter(cluster => cluster.paragraphs.length > 0);
 const visibleJapanese = clusters.flatMap(cluster => cluster.paragraphs.map(p => p.ja)).join('');
 const terms = session.clusters.flatMap(cluster => cluster.terms ?? []).filter(term => visibleJapanese.includes(term.ja));
 if (clusters.length) clusters[0].terms = terms;
 const activeSession = { ...session, clusters };
 const bundle = differentialTranslations.get(session.id);
 return [bundle ? applyLessonTranslations(activeSession, bundle) : activeSession];
});
