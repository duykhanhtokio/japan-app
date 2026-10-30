const fs=require('node:fs');
const installed=Symbol.for('japan-app.bounded-build-io');
function limitIO(fn,maximum) {
  const waiting=[];let active=0;
  function drain() {
    while(active<maximum&&waiting.length) {
      const job=waiting.shift();active++;
      Promise.resolve().then(()=>fn(...job.args)).then(job.resolve,job.reject)
        .finally(()=>{active--;drain();});
    }
  }
  return (...args)=>new Promise((resolve,reject)=>{waiting.push({args,resolve,reject});drain();});
}
function installBoundedIO() {
  const io=fs.promises;
  if(io[installed])return;
  io.readFile=limitIO(io.readFile.bind(io),32);
  io.writeFile=limitIO(io.writeFile.bind(io),2);
  Object.defineProperty(io,installed,{value:true});
}
module.exports={installBoundedIO,limitIO};
