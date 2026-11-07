import data from '@/data/restaurant/royal-week04-visual-readings.json';
/** Exact current field only: a revised label cannot inherit a stale reading. */
export function restaurantWeek04VisualReading(text:string){return data.fields.find(field=>field.text===text)?.segments;}
