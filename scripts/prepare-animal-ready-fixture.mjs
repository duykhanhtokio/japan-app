// Test-only scratch copy. Never edits source or the original exported build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const [inputArg,outputArg]=process.argv.slice(2);
if(!inputArg||!outputArg)throw Error('Usage: node scripts/prepare-animal-ready-fixture.mjs <web-export> <new-scratch-copy>');
const input=path.resolve(inputArg),output=path.resolve(outputArg);
if(output===root||output.startsWith(root+path.sep)||output===input||output.startsWith(input+path.sep)||fs.existsSync(output))throw Error('Output must be a new scratch directory outside the repository and input export');
const directory=path.join(input,'_expo/static/js/web');
const patches=[];let count=0;
for(const name of fs.readdirSync(directory).filter(name=>name.endsWith('.js'))) {
 const original=fs.readFileSync(path.join(directory,name),'utf8');let content=original;
 for(const species of ['chicken','cow'])for(let i=1;i<=3;i++) {
  const key=`id:'${species}_slot_${i}',animalId:'${species}',status:'idle'`;
  count+=content.split(key).length-1;
  content=content.split(key).join(key.replace("status:'idle'","status:'ready'"));
 }
 if(content!==original)patches.push({name,content});
}
if(count!==6)throw Error(`Expected exactly six initial idle slots, found ${count}; do not guess new bundle syntax`);
fs.cpSync(input,output,{recursive:true});
for(const {name,content} of patches)fs.writeFileSync(path.join(output,'_expo/static/js/web',name),content);
console.log('READY SLOT FIXTURE: six slots changed in scratch copy only; not production timing evidence');
