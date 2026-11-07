import data from '@/data/restaurant/prior-technical-visual-readings.json';
import type {ReadingSegment} from '@/data/restaurant/types';
/** Whole-field authored readings only; changed canonical text gets no stale ruby. */
export function restaurantTechnicalVisualReading(text:string):ReadingSegment[]|undefined{
 return data.fields.find(field=>field.text===text)?.segments;
}
