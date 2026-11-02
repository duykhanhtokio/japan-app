// Prevent accidental publication of raw PDF text/images/vector commands in region receipts.
// This is a payload hygiene check, not a copyright/legal clearance.
const fs=require('node:fs'),path=require('node:path');
const {readJSON,SECTORS}=require('./check.cjs');
const root=path.resolve(__dirname,'../..');
function scan(value,where='$'){
 if(Array.isArray(value)){for(let i=0;i<value.length;i++)scan(value[i],`${where}[${i}]`);return;}
 if(!value||typeof value!=='object')return;
 for(const [key,v]of Object.entries(value)){
  if(/^(text|rawText|sourceText|ocrText|imageBytes|base64|dataUrl|svg|commands|drawingCommands|chars)$/i.test(key)&&v!=null&&v!==''&&(!Array.isArray(v)||v.length))throw Error(`RAW_SOURCE_PAYLOAD: ${where}/${key}`);
  if(typeof v==='string'&&v.length>4096)throw Error(`EXCESS_REGION_STRING: ${where}/${key}`);
  scan(v,`${where}/${key}`);
 }
}
function run(files){let elements=0;for(const file of files){const x=readJSON(file);if(x.schemaVersion!==1||!Array.isArray(x.pages))throw Error(`Not a region artifact: ${file}`);scan(x);elements+=x.pages.reduce((n,p)=>n+p.elements.length,0);}return {status:'PASS_REGION_PAYLOAD_HYGIENE',artifacts:files.length,elements,rawPdfTextOrImagePayloadDetected:false,legalClearanceInferred:false};}
module.exports={scan,run};
if(require.main===module){const args=process.argv.slice(2),ledgers=args.length?args:SECTORS.map(s=>`docs/ssw-workspace/source-coverage-v2/${s}.json`);try{const artifacts=new Set();for(const file of ledgers){const d=readJSON(path.resolve(root,file));for(const p of d.pages)if(p.regionCensus?.artifactPath)artifacts.add(path.resolve(root,p.regionCensus.artifactPath));}console.log(JSON.stringify(run([...artifacts])));}catch(e){console.error(e.message);process.exitCode=1;}}
