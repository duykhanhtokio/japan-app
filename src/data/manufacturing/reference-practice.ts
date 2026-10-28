import type {Specialty} from './index';
import type {ManufacturingMock} from '@/services/manufacturing-mock-state';

type Selection={id:string;sourceHash:string;lessonId:string;lessonSourceHash:string};
type Form={id:string;specialty:Specialty;titleJa:string;revision:string;sections:Record<'theory'|'practical',{
 id:string;durationMs:number;passMinimumCorrect:number;selection:Selection[]}>};

// These are additional assemblies of existing taught questions. They inherit
// the exact original content, translations and ruby; no copied sample item.
export function referenceManufacturingMocks(specialty:Specialty,base:ManufacturingMock[]):ManufacturingMock[]{
 const forms=require('./reference-practice.json').forms as Form[];
 const candidates=forms.filter(f=>f.specialty===specialty);
 const pool=new Map(base.flatMap(e=>[...e.sections.theory.questions,...e.sections.practical.questions]).map(q=>[q.id,q]));
 const result:ManufacturingMock[]=[];
 for(const f of candidates){
  const resolved={theory:f.sections.theory.selection.map(s=>pool.get(s.id)),practical:f.sections.practical.selection.map(s=>pool.get(s.id))};
  const valid=(['theory','practical'] as const).every(section=>
   f.sections[section].selection.every((s,i)=>{const q=resolved[section][i];return q&&q.sourceHash===s.sourceHash&&q.lessonId===s.lessonId&&(q as typeof q & {lessonSourceHash:string}).lessonSourceHash===s.lessonSourceHash;}));
  // A stale optional assembly must not prevent opening the original catalog.
  if(!valid)continue;
  result.push({id:f.id,specialty:f.specialty,titleJa:f.titleJa,revision:f.revision,kind:'mock',officialSimulation:true,
   sections:{theory:{...f.sections.theory,questions:resolved.theory as ManufacturingMock['sections']['theory']['questions']},
             practical:{...f.sections.practical,questions:resolved.practical as ManufacturingMock['sections']['practical']['questions']}}});
 }
 return result;
}
