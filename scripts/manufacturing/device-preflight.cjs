#!/usr/bin/env node
'use strict';
const{spawnSync}=require('child_process');const fs=require('fs');
const run=(bin,args)=>{const r=spawnSync(bin,args,{encoding:'utf8',timeout:20000});return {available:!r.error,status:r.status,stdout:(r.stdout||'').trim(),stderr:(r.error?r.error.message:r.stderr||'').trim()};};
const android=run('adb',['devices','-l']);const ios=run('xcrun',['devicectl','list','devices']);
const authorizedAndroid=android.available?android.stdout.split('\n').filter(l=>/^\S+\s+device\s/.test(l)):[];
const result={timestamp:new Date().toISOString(),host:process.platform,android,ios,authorizedAndroid,physicalAcceptancePassed:false,note:'Discovery only. USB authorization, device identity, application launch, screenshots and interactive acceptance must be recorded separately. An emulator/simulator or native JS export is not a physical-device result.'};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
