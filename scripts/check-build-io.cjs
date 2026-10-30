const assert=require('node:assert/strict');
const {limitIO}=require('./metro/bounded-io.cjs');
let active=0,peak=0;
const failure=new Error('expected I/O failure');
const run=limitIO(async value=>{
  active++;peak=Math.max(peak,active);
  await new Promise(resolve=>setTimeout(resolve,1));
  active--;
  if(value===7)throw failure;
  return value*2;
},3);
(async()=>{
  const results=await Promise.allSettled(Array.from({length:40},(_,i)=>run(i)));
  assert.equal(peak,3);
  for(let i=0;i<results.length;i++) {
    if(i===7)assert.strictEqual(results[i].reason,failure);
    else assert.deepEqual(results[i],{status:'fulfilled',value:i*2});
  }
  console.log('PASS: bounded concurrency, exact results, error identity and queue recovery');
})().catch(error=>{console.error(error);process.exitCode=1});
