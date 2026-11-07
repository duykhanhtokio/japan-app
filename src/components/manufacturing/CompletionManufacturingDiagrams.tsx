import {manufacturingIllustrationCaptionReading} from '@/data/manufacturing/illustration-caption-readings';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {manufacturingCompletionLessonTranslation} from '@/data/manufacturing/completion37';
import type {SupplementalDiagram} from '@/data/manufacturing/supplemental-diagrams';
import {SupplementalFigure} from './SupplementalManufacturingDiagrams';

const sources:Record<string,ReturnType<typeof require>>={

 get 'mechanical-drawing-full-nine-lines.png'(){return require('../../../assets/manufacturing/royal-weekly-20261107/week03/companions/mechanical-drawing-full-nine-lines.png');},
 get 'royal-mechanical-machine-recognition-20261107.webp'(){return require('../../../assets/manufacturing/diagrams/royal-mechanical-machine-recognition-20261107.webp');},
 get 'batch37-mechanical-drawing.png'(){return require('../../../assets/manufacturing/diagrams/batch37-mechanical-drawing.png');},
 get 'batch37-mechanical-features.png'(){return require('../../../assets/manufacturing/diagrams/batch37-mechanical-features.png');},
 get 'batch37-mechanical-metrology.png'(){return require('../../../assets/manufacturing/diagrams/batch37-mechanical-metrology.png');},
 get 'batch37-mechanical-parts.png'(){return require('../../../assets/manufacturing/diagrams/batch37-mechanical-parts.png');},
 get 'batch37-surface-corrosion.png'(){return require('../../../assets/manufacturing/diagrams/batch37-surface-corrosion.png');},
 get 'batch37-surface-instruments.png'(){return require('../../../assets/manufacturing/diagrams/batch37-surface-instruments.png');},
 get 'batch37-surface-qc.png'(){return require('../../../assets/manufacturing/diagrams/batch37-surface-qc.png');},
};

/** Original supplementary illustrations share the exact lesson's translated summary. */
export function CompletionManufacturingDiagrams({lesson,language,showTranslation}:{lesson:ManufacturingLesson;language:string;showTranslation:boolean}){
 if(!lesson.id.includes('-completion37-'))return null;
 const items=(require('@/data/manufacturing/completion37/diagrams.json') as {items:SupplementalDiagram[]}).items;
 const target=showTranslation?manufacturingCompletionLessonTranslation(lesson,language):null;
 return <>{items.filter(item=>item.lessonId===lesson.id&&item.lessonSourceHash===lesson.sourceHash&&item.captionJa===lesson.summaryJa
  &&Number.isFinite(item.width)&&item.width>0&&Number.isFinite(item.height)&&item.height>0
  &&Object.prototype.hasOwnProperty.call(sources,item.assetFile)).map(item=><SupplementalFigure key={item.id} item={item} japaneseCaptionRuby={manufacturingIllustrationCaptionReading(lesson,item)} language={language} showTranslation={showTranslation} imageSource={sources[item.assetFile]} translatedCaption={target?.summary??null}/>)}</>;
}
