import type {SourceFigure31} from '@/data/restaurant/source31';
import data from '@/data/restaurant/royal-source-figure-overrides.json';
const assetLoaders:Record<string,()=>number>={
 'rst31-hygiene1-fig-handwash-motion-atlas':()=>require('../../../assets/restaurant/royal-weekly-20261107/week03/handwash-motion-atlas.webp'),
 'rst31-hygiene1-fig-food-process-atlas':()=>require('../../../assets/restaurant/royal-weekly-20261107/week03/food-process-atlas.webp'),
 'rst31-hygiene2-figure-wall-cleaning-range':()=>require('../../../assets/restaurant/royal-weekly-20261107/week01/rst-2-hyg-02-wall-cleaning-context.webp'),
 'rst31-hygiene2-figure-pipe-entry-gap':()=>require('../../../assets/restaurant/royal-weekly-20261107/week02/rst-2-hyg-07-pest-entry-drain-monitoring.webp'),
};
/** Style-only alternate pixels. Original row/caption revision and learner identity remain authoritative. */
export function royalRestaurantSourceFigure(figure:SourceFigure31):{source:number;figure:SourceFigure31}|null{
 const o=data.overrides.find(x=>x.figureId===figure.id);if(!o)return null;
 if(figure.sourceHash!==o.originalFigureSourceHash||figure.captionJa!==o.originalCaptionJa||figure.altJa!==o.originalAltJa||figure.quizSafe!==false||figure.cropBox)return null;
 const identities=[{assetFile:o.originalAssetFile,sha256:o.originalAssetSha256,width:o.originalWidth,height:o.originalHeight},...o.acceptedLegacyIdentities];
 if(!identities.some(x=>figure.assetFile===x.assetFile&&figure.sha256===x.sha256&&figure.width===x.width&&figure.height===x.height))return null;
 const pack=o.level==='1'?require('../../data/restaurant/source31/1.json'):require('../../data/restaurant/source31/2.json');
 const row=pack.lessons[o.lessonId];
 if(!row||row.sourceHash!==o.originalRowSourceHash||!row.figures.some((f:SourceFigure31)=>f.id===figure.id&&f.sourceHash===figure.sourceHash))return null;
 const source=assetLoaders[figure.id]?.();if(source===undefined)return null;
 return {source,figure:{...figure,width:o.width,height:o.height,...(o.cropBox?{cropBox:o.cropBox}:{})}};
}
