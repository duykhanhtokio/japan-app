const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/components/ui/prepareSceneRoute.ts', 'utf8');
const body = source.slice(source.indexOf('let navigationIntent = 0;'));
function fixture() {
 const timers = [], exports = {};
 let resolveArtwork, resolveState;
 const artwork = new Promise(resolve => { resolveArtwork = resolve; });
 const state = new Promise(resolve => { resolveState = resolve; });
 const context = {exports, console, Promise, router:{}, prepareSceneRoute:()=>artwork,prepareArtwork:()=>artwork,
 setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length},clearTimeout:()=>{},previousRoutePath:()=>undefined};
 vm.runInNewContext(ts.transpileModule(body,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
 return {api:exports,timers,resolveArtwork,resolveState,state};
}
(async()=>{
 let f=fixture(),calls=0;
 const pending=f.api.navigateWithPreparedArtwork('/home',()=>calls++,[],()=>f.state);
 await Promise.resolve();assert.equal(f.timers[0].delay,180);
 f.timers[0].fn();await new Promise(setImmediate);assert.equal(calls,0,'artwork timeout must not bypass required state/credit checks');
 f.resolveState();assert.equal(await pending,true);assert.equal(calls,1);
 f=fixture();calls=0;
 const first=f.api.navigateWithPreparedArtwork('/home',()=>calls++);
 f.api.cancelPreparedNavigation();f.resolveArtwork();assert.equal(await first,false);assert.equal(calls,0,'cancelled request must not navigate later');
 f=fixture();calls=0;
 const older=f.api.navigateWithPreparedArtwork('/home',()=>calls++);
 const newer=f.api.navigateWithPreparedArtwork('/profile',()=>calls+=10);
 f.resolveArtwork();await Promise.all([older,newer]);assert.equal(calls,10,'rapid taps must dispatch only the latest destination');
 console.log('LEAN NAVIGATION PASS: bounded artwork wait, required state guard, cancellation, latest intent.');
})().catch(error=>{console.error(error);process.exitCode=1});
