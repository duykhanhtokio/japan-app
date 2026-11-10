'use strict';
const path=require('node:path'),fs=require('node:fs'),crypto=require('node:crypto'),{deflateSync}=require('node:zlib');
const upstream=require(require('expo/metro-config').unstable_transformerPath);
const sectors='(?:agriculture|manufacturing|food-manufacturing|restaurant|hospitality|kaigo|kensetsu|dialogue-content|generated)';
const selected=new RegExp('^(?:src/data/'+sectors+'/|docs/ssw-workspace/)');
function packedSource(projectRoot,filename,data){
 const relative=path.relative(projectRoot,path.resolve(projectRoot,filename)).split(path.sep).join('/');
 // Other modules, especially the locked JLPT data/UI, use Expo's unchanged worker.
 if(!relative.endsWith('.json')||!selected.test(relative)||data.length<16384)return null;
 const normalized=data.subarray(0,3).equals(Buffer.from([239,187,191]))?data.subarray(3):data;
 const payload=deflateSync(normalized,{level:6}).toString('base64');
 if(payload.length+200>=normalized.length)return null;
 const helper=path.join(projectRoot,'src/services/decode-bundled-json');
 let requirePath=path.relative(path.dirname(path.resolve(projectRoot,filename)),helper).split(path.sep).join('/');
 if(!requirePath.startsWith('.'))requirePath='./'+requirePath;
 return {code:'module.exports = require('+JSON.stringify(requirePath)+').decodeBundledJson('+JSON.stringify(payload)+','+normalized.length+');',payload,expectedBytes:normalized.length};
}
async function transform(config,projectRoot,filename,data,options){
 const packed=packedSource(projectRoot,filename,data);
 if(!packed)return upstream.transform(config,projectRoot,filename,data,options);
 // The original module identity stays with Metro; the JS suffix only selects
 // Expo's normal JS parser rather than its JSON-literal minification path.
 return upstream.transform(config,projectRoot,filename+'.js',Buffer.from(packed.code),options);
}
function getCacheKey(config){
 return crypto.createHash('sha256').update(upstream.getCacheKey(config)).update(fs.readFileSync(__filename)).update(fs.readFileSync(path.join(__dirname,'../../src/services/decode-bundled-json.ts'))).digest('hex');
}
module.exports={transform,getCacheKey,packedSource};
