import type {ManufacturingLesson} from './index';
import {loadManufacturingCourse} from './index';
import {manufacturingSourceGuides} from './source-guides';
import {manufacturingCompletionLessons} from './completion37';
import data from './daily-support-bindings.json';
export type DailySupportBinding={lessonId:string;lessonSourceHash:string;companionId:string;companionSpecialty:ManufacturingLesson['specialty'];companionSourceHash:string;paragraphIds:string[];reasonJa:string};
/** Explicit source-bound paragraph selections; never append a guessed neighbour. */
export function manufacturingDailySupport(lesson:ManufacturingLesson):{binding:DailySupportBinding;companion:ManufacturingLesson}|null{
 const binding=(data.bindings as Record<string,DailySupportBinding>)[lesson.id];
 if(!binding||binding.lessonSourceHash!==lesson.sourceHash)return null;
 const sourceSpecialty=binding.companionSpecialty;
 if(!['mechanical','electrical','surface'].includes(sourceSpecialty))return null;
 const pool=[...manufacturingSourceGuides(sourceSpecialty),...manufacturingCompletionLessons(sourceSpecialty),...loadManufacturingCourse(sourceSpecialty).lessons];
 const companion=pool.find(l=>l.id===binding.companionId&&l.sourceHash===binding.companionSourceHash&&l.specialty===sourceSpecialty);
 if(!companion||!binding.paragraphIds.length||binding.paragraphIds.some(id=>!companion.paragraphs.some(p=>p.id===id)))return null;
 return {binding,companion};
}

export type DailyFigureAsset={assetFile:string;assetPath:string;width:number;height:number;titleJa:string;captionJa:string;sha256:string};
export type DailyFigureBinding={lessonId:string;lessonSourceHash:string;keyObjectiveId:string;keyObjectiveJa:string;assetId:string;assetSha256:string;reuseReasonJa:string};
export function manufacturingDailyFigure(lesson:ManufacturingLesson):{binding:DailyFigureBinding;asset:DailyFigureAsset}|null{
 const figures=require('./daily-figures.json') as {assets:Record<string,DailyFigureAsset>;lessons:Record<string,DailyFigureBinding>};
 const binding=figures.lessons[lesson.id],asset=binding?figures.assets[binding.assetId]:null;
 if(!binding||binding.lessonSourceHash!==lesson.sourceHash||binding.keyObjectiveJa!==lesson.objectiveJa||!asset||asset.sha256!==binding.assetSha256||!(asset.width>0&&asset.height>0))return null;
 return {binding,asset};
}
