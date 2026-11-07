import type {SourceFigure31} from '@/data/restaurant/source31';
import data from '@/data/restaurant/royal-source-figure-overrides.json';
/** Style-only alternate pixels. Original row/caption revision and learner identity remain authoritative. */
export function royalRestaurantSourceFigure(figure:SourceFigure31):{source:number;figure:SourceFigure31}|null{
 const o=data.overrides.find(x=>x.figureId===figure.id);if(!o)return null;
 if(figure.sourceHash!==o.originalFigureSourceHash||figure.assetFile!==o.originalAssetFile||figure.sha256!==o.originalAssetSha256||figure.width!==o.originalWidth||figure.height!==o.originalHeight||figure.captionJa!==o.originalCaptionJa||figure.altJa!==o.originalAltJa||figure.quizSafe!==false||figure.cropBox)return null;
 const row=require('../../data/restaurant/source31/2.json').lessons[o.lessonId];
 if(!row||row.sourceHash!==o.originalRowSourceHash||!row.figures.some((f:SourceFigure31)=>f.id===figure.id&&f.sourceHash===figure.sourceHash))return null;
 return {source:require('../../../assets/restaurant/royal-weekly-20261107/week01/rst-2-hyg-02-wall-cleaning-context.webp'),figure:{...figure,width:o.width,height:o.height}};
}
