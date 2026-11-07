import type {SourceFigure31} from '@/data/restaurant/source31';
import {sameRestaurantFigureIdentity} from './RestaurantFigureIdentity';
import data from '@/data/restaurant/royal-source-caption-readings.json';
/** Original Japanese captions retain exact current canonical figure and row revision. */
export function restaurantSourceCaptionReading(figure:SourceFigure31){
 const binding=data.bindings.find(b=>sameRestaurantFigureIdentity(b.figure,figure));if(!binding)return undefined;
 const pack=binding.level==='1'?require('../../data/restaurant/source31/1.json'):require('../../data/restaurant/source31/2.json'),row=pack.lessons[binding.lessonId];
 return row?.sourceHash===binding.rowSourceHash&&row.figures.some((f:SourceFigure31)=>sameRestaurantFigureIdentity(f,figure))?binding.segments:undefined;
}
