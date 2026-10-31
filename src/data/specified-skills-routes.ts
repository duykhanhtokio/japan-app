/** Explicit routes prevent an unregistered sector from opening another course. */
const routes={'宿泊':'/specified-skills/hospitality','介護':'/specified-skills/kaigo','建設':'/specified-skills/kensetsu','農業':'/specified-skills/agriculture','製造分野':'/specified-skills/manufacturing','外食業':'/specified-skills/restaurant','飲食料品製造業':'/specified-skills/food-manufacturing'} as const;
export type SpecifiedSkillRoute=(typeof routes)[keyof typeof routes];
export function specifiedSkillRoute(name:string):SpecifiedSkillRoute|null{return Object.prototype.hasOwnProperty.call(routes,name)?routes[name as keyof typeof routes]:null;}
export function specifiedSkillAvailable(name:string,development:boolean):boolean{return specifiedSkillRoute(name)!==null&&(development||name==='外食業'||name==='飲食料品製造業');}
