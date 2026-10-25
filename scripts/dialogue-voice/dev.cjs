/** Run Expo and the local voice bridge together; stop both on exit. */
const {spawn}=require('node:child_process'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const expoCli=path.join(path.dirname(require.resolve('expo/package.json')),'bin','cli');
const children=[spawn(process.execPath,[path.join(__dirname,'local-server.cjs')],{cwd:root,stdio:'inherit'}),spawn(process.execPath,[expoCli,'start','--clear'],{cwd:root,stdio:'inherit'})];
let closing=false;
function stop(code=0){if(closing)return;closing=true;for(const child of children)if(child.exitCode===null)child.kill('SIGTERM');process.exitCode=code;}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
for(const child of children){child.on('error',error=>{console.error(error.message);stop(1)});child.on('exit',code=>stop(code||0));}
