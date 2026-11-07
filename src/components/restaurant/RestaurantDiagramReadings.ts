import readings from '@/data/restaurant/diagram-visual-readings.json';
import type {ReadingSegment} from '@/data/restaurant/types';
type Diagram={id:string};
type Entry={sourceSignature:string;title:ReadingSegment[];caption:ReadingSegment[];nodes:Record<string,ReadingSegment[]>};
/** Canonical node text, edges, bindings and every translation form one revision. */
export function restaurantDiagramReadings(diagram:Diagram):Entry|null{
 const entry=(readings.diagrams as Record<string,Entry>)[diagram.id];
 return entry&&entry.sourceSignature===JSON.stringify(diagram)?entry:null;
}
