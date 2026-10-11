import type {ImageSourcePropType} from 'react-native';
import session001 from '../../../docs/ssw-workspace/kensetsu/shared-session-001.json';
import session002 from '../../../docs/ssw-workspace/kensetsu/shared-session-002.json';
import session003 from '../../../docs/ssw-workspace/kensetsu/shared-session-003.json';
import session004 from '../../../docs/ssw-workspace/kensetsu/shared-session-004.json';
import session005 from '../../../docs/ssw-workspace/kensetsu/shared-session-005.json';
import session006 from '../../../docs/ssw-workspace/kensetsu/shared-session-006.json';
import session007 from '../../../docs/ssw-workspace/kensetsu/shared-session-007.json';
import session008 from '../../../docs/ssw-workspace/kensetsu/shared-session-008.json';
import session009 from '../../../docs/ssw-workspace/kensetsu/shared-session-009.json';
import session010 from '../../../docs/ssw-workspace/kensetsu/shared-session-010.json';
import session011 from '../../../docs/ssw-workspace/kensetsu/shared-session-011.json';
import session012 from '../../../docs/ssw-workspace/kensetsu/shared-session-012.json';
import session013 from '../../../docs/ssw-workspace/kensetsu/shared-session-013.json';
import session014 from '../../../docs/ssw-workspace/kensetsu/shared-session-014.json';
import session015 from '../../../docs/ssw-workspace/kensetsu/shared-session-015.json';
import session016 from '../../../docs/ssw-workspace/kensetsu/shared-session-016.json';
import session017 from '../../../docs/ssw-workspace/kensetsu/shared-session-017.json';
import session018 from '../../../docs/ssw-workspace/kensetsu/shared-session-018.json';
import session019 from '../../../docs/ssw-workspace/kensetsu/shared-session-019.json';
import session020 from '../../../docs/ssw-workspace/kensetsu/shared-session-020.json';
import session021 from '../../../docs/ssw-workspace/kensetsu/shared-session-021.json';
import session022 from '../../../docs/ssw-workspace/kensetsu/shared-session-022.json';
import session023 from '../../../docs/ssw-workspace/kensetsu/shared-session-023.json';
import session024 from '../../../docs/ssw-workspace/kensetsu/shared-session-024.json';
import session025 from '../../../docs/ssw-workspace/kensetsu/shared-session-025.json';
import session026 from '../../../docs/ssw-workspace/kensetsu/shared-session-026.json';
import session027 from '../../../docs/ssw-workspace/kensetsu/shared-session-027.json';
import session028 from '../../../docs/ssw-workspace/kensetsu/shared-session-028.json';
import session029 from '../../../docs/ssw-workspace/kensetsu/shared-session-029.json';
import session030 from '../../../docs/ssw-workspace/kensetsu/shared-session-030.json';
import session031 from '../../../docs/ssw-workspace/kensetsu/shared-session-031.json';
import session032 from '../../../docs/ssw-workspace/kensetsu/shared-session-032.json';
import session033 from '../../../docs/ssw-workspace/kensetsu/shared-session-033.json';
import session034 from '../../../docs/ssw-workspace/kensetsu/shared-session-034.json';
import session035 from '../../../docs/ssw-workspace/kensetsu/shared-session-035.json';
import session036 from '../../../docs/ssw-workspace/kensetsu/shared-session-036.json';
import session037 from '../../../docs/ssw-workspace/kensetsu/shared-session-037.json';
import session038 from '../../../docs/ssw-workspace/kensetsu/shared-session-038.json';
import session039 from '../../../docs/ssw-workspace/kensetsu/shared-session-039.json';
import session040 from '../../../docs/ssw-workspace/kensetsu/shared-session-040.json';
import session041 from '../../../docs/ssw-workspace/kensetsu/shared-session-041.json';
import session042 from '../../../docs/ssw-workspace/kensetsu/shared-session-042.json';
import session043 from '../../../docs/ssw-workspace/kensetsu/shared-session-043.json';
import session044 from '../../../docs/ssw-workspace/kensetsu/shared-session-044.json';
import session045 from '../../../docs/ssw-workspace/kensetsu/shared-session-045.json';
import session046 from '../../../docs/ssw-workspace/kensetsu/shared-session-046.json';
import session047 from '../../../docs/ssw-workspace/kensetsu/shared-session-047.json';
import session048 from '../../../docs/ssw-workspace/kensetsu/shared-session-048.json';
import session049 from '../../../docs/ssw-workspace/kensetsu/shared-session-049.json';
import session050 from '../../../docs/ssw-workspace/kensetsu/shared-session-050.json';
import session051 from '../../../docs/ssw-workspace/kensetsu/shared-session-051.json';
import session052 from '../../../docs/ssw-workspace/kensetsu/shared-session-052.json';
import session053 from '../../../docs/ssw-workspace/kensetsu/shared-session-053.json';
import session054 from '../../../docs/ssw-workspace/kensetsu/shared-session-054.json';
import session055 from '../../../docs/ssw-workspace/kensetsu/shared-session-055.json';
import session056 from '../../../docs/ssw-workspace/kensetsu/shared-session-056.json';
import week001 from '../../../docs/ssw-workspace/kensetsu/shared-week-001.json';
import week002 from '../../../docs/ssw-workspace/kensetsu/shared-week-002.json';
import week003 from '../../../docs/ssw-workspace/kensetsu/shared-week-003.json';
import week004 from '../../../docs/ssw-workspace/kensetsu/shared-week-004.json';
import week005 from '../../../docs/ssw-workspace/kensetsu/shared-week-005.json';

import week006 from '../../../docs/ssw-workspace/kensetsu/shared-week-006.json';

import week007 from '../../../docs/ssw-workspace/kensetsu/shared-week-007.json';

import week008 from '../../../docs/ssw-workspace/kensetsu/shared-week-008.json';

export type Level='1'|'2';
export type Field='utilities'|'building'|'civil';
export type Paragraph={id:string;ja:string};
export type Cluster={id:string;titleJa:string;paragraphs:Paragraph[];applicationPromptJa?:string;illustration?:{assetPath:string;captionJa:string}};
export type Session={id:string;revision:number;titleJa:string;clusters:Cluster[];keyTerms?:{term:string;reading:string}[];illustrations?:{path:string;clusterId?:string;altJa:string}[]};
export type Week={id:string;titleJa:string;sessionIds:string[]};
export const fields:{id:Field;title:string}[]=[{id:'utilities',title:'ライフライン・設備'},{id:'building',title:'建築'},{id:'civil',title:'土木'}];

export const sessions:Session[]=[session001,session002,session003,session004,session005,session006,session007,session008,session009,session010,session011,session012,session013,session014,session015,session016,session017,session018,session019,session020,session021,session022,session023,session024,session025,session026,session027,session028,session029,session030,session031,session032,session033,session034,session035,session036,session037,session038,session039,session040,session041,session042,session043,session044,session045,session046,session047,session048,session049,session050,session051,session052,session053,session054,session055,session056] as unknown as Session[];
export const weeks:Week[]=[week001,week002,week003,week004,week005,week006,week007,week008];

export const sessionById=new Map(sessions.map(s=>[s.id,s]));
export const illustrations:Record<string,ImageSourcePropType>={
 'assets/kensetsu/shared/handover-v1.webp':require('../../../assets/kensetsu/shared/handover-v1.webp'),
 'assets/kensetsu/shared/greeting-v1.webp':require('../../../assets/kensetsu/shared/greeting-v1.webp'),
 'assets/kensetsu/shared/morning-meeting-v1.webp':require('../../../assets/kensetsu/shared/morning-meeting-v1.webp'),
};
export const completionId=(session:Session)=>`${session.id}:r${session.revision}`;
export const completionKey=(learner:string,level:Level,field:Field)=>`@japan_app_kensetsu_test:v1:${encodeURIComponent(learner)}:${level}:${field}`;
export function restoreProgress(raw:string|null):Record<string,true>{
 try{const data=JSON.parse(raw??'null');if(!data||typeof data!=='object'||Array.isArray(data))return {};
 return Object.fromEntries(sessions.filter(s=>data[completionId(s)]===true).map(s=>[completionId(s),true]));}catch{return {};}
}
