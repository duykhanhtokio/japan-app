import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import type {SourceFigure31} from '@/data/restaurant/source31';
import data from '@/data/restaurant/royal-source-figure-overrides.json';
const assetLoaders:Record<string,()=>number>={
 'rst31-cooking1-fig-food-sawara':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-asari':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-wakame':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-ayu':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-surumeika':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-hotate':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-katsuo':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-salmon':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-sanma':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-snow-crab':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-oyster':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-fugu':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/fish-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-lotus':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-strawberry':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-melon':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-watermelon':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-bamboo':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-nanohana':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-asparagus':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-soramame':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-goya':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-piman':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-broccoli':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-cooking1-fig-food-negi':()=>require('../../../assets/restaurant/royal-weekly-20261107/week04/produce-recognition-atlas.webp'),
 'rst31-hygiene1-fig-handwash-motion-atlas':()=>require('../../../assets/restaurant/royal-weekly-20261107/week03/handwash-motion-atlas.webp'),
 'rst31-hygiene1-fig-food-process-atlas':()=>require('../../../assets/restaurant/royal-weekly-20261107/week03/food-process-atlas.webp'),
 'rst31-hygiene2-figure-wall-cleaning-range':()=>require('../../../assets/restaurant/royal-weekly-20261107/week01/rst-2-hyg-02-wall-cleaning-context.webp'),
 'rst31-hygiene2-figure-pipe-entry-gap':()=>require('../../../assets/restaurant/royal-weekly-20261107/week02/rst-2-hyg-07-pest-entry-drain-monitoring.webp'),
};
/** Style-only alternate pixels. Original row/caption revision and learner identity remain authoritative. */
export function royalRestaurantSourceFigure(figure:SourceFigure31):{source:number;figure:SourceFigure31}|null{
 const o=data.overrides.find(x=>x.figureId===figure.id);if(!o)return null;
 if(figure.sourceHash!==o.originalFigureSourceHash||figure.captionJa!==o.originalCaptionJa||figure.altJa!==o.originalAltJa||figure.quizSafe!==false||JSON.stringify(figure.cropBox??null)!==JSON.stringify(o.originalCropBox??null))return null;
 const identities=[{assetFile:o.originalAssetFile,sha256:o.originalAssetSha256,width:o.originalWidth,height:o.originalHeight},...o.acceptedLegacyIdentities];
 if(!identities.some(x=>figure.assetFile===x.assetFile&&figure.sha256===x.sha256&&figure.width===x.width&&figure.height===x.height))return null;
 const pack=o.level==='1'?require('../../data/restaurant/source31/1.json'):require('../../data/restaurant/source31/2.json');
 const row=pack.lessons[o.lessonId];
 if(!row||row.sourceHash!==o.originalRowSourceHash||!row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure)))return null;
 const source=assetLoaders[figure.id]?.();if(source===undefined)return null;
 return {source,figure:{...figure,width:o.width,height:o.height,...(o.cropBox?{cropBox:o.cropBox}:{})}};
}
