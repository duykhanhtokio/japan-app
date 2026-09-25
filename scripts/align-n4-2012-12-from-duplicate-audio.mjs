import fs from 'node:fs';

// This utility documents why timings must not be copied from the mislabeled
// 2017 package. It accepts a separately produced alignment map and enforces
// monotonic, bounded candidate timings before they can enter runtime data.
const sourceDurationMs=2156137;
const mapPath='docs/jlpt-workspace/conversion/n4-2012-12/listening.alignment-candidate.json';
if(!fs.existsSync(mapPath)){
  console.error('N4 2012-12 timing remains blocked: no independently generated alignment map.');
  process.exit(2);
}
const map=JSON.parse(fs.readFileSync(mapPath,'utf8'));
if(map.status!=='candidate_unverified'||map.records.length!==28)throw Error('invalid alignment map');
let end=0;
for(const record of map.records){
  if(record.startMs<end||record.endMs<=record.startMs||record.endMs>sourceDurationMs)throw Error(`invalid boundary ${record.auditId}`);
  end=record.endMs;
}
console.log('N4 2012-12 candidate alignment map PASS: 28 monotonic bounded records; perceptual review still required.');
