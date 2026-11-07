import type {SourceFigure31} from '@/data/restaurant/source31';

/** Compare the current canonical figure, including metadata that may change before hash regeneration. */
export function sameRestaurantFigureIdentity(a:SourceFigure31,b:SourceFigure31):boolean{
 const fields=['id','sourceHash','assetFile','sha256','width','height','captionJa','altJa','quizSafe'] as const;
 if(fields.some(key=>a[key]!==b[key]))return false;
 const ac=a.cropBox,bc=b.cropBox;
 if(!ac||!bc)return !ac&&!bc;
 return ac.x===bc.x&&ac.y===bc.y&&ac.width===bc.width&&ac.height===bc.height;
}
