import {strFromU8,unzlibSync} from 'fflate/browser';

// No Buffer, filesystem, network, eval or Node-only APIs in native bundles.
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64Bytes(text:string):Uint8Array {
 if(!text.length||text.length%4!==0||!/^[A-Za-z0-9+/]*={0,2}$/.test(text))throw new Error('Invalid bundled JSON encoding');
 const padding=text.endsWith('==')?2:text.endsWith('=')?1:0;
 const bytes=new Uint8Array(text.length/4*3-padding);let offset=0;
 for(let i=0;i<text.length;i+=4){
  const a=alphabet.indexOf(text[i]),b=alphabet.indexOf(text[i+1]);
  const c=text[i+2]==='='?0:alphabet.indexOf(text[i+2]),d=text[i+3]==='='?0:alphabet.indexOf(text[i+3]);
  const bits=(a<<18)|(b<<12)|(c<<6)|d;
  if(offset<bytes.length)bytes[offset++]=(bits>>>16)&255;
  if(offset<bytes.length)bytes[offset++]=(bits>>>8)&255;
  if(offset<bytes.length)bytes[offset++]=bits&255;
 }
 return bytes;
}
export function decodeBundledJson(payload:string,expectedBytes:number):unknown {
 if(!Number.isSafeInteger(expectedBytes)||expectedBytes<0)throw new Error('Invalid bundled JSON size');
 const bytes=unzlibSync(base64Bytes(payload));
 if(bytes.length!==expectedBytes)throw new Error('Bundled JSON size mismatch');
 return JSON.parse(strFromU8(bytes));
}
