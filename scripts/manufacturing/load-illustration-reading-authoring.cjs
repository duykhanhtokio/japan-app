// Tooling only: immutable automatic candidates plus explicit reviewed weekly overrides.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
module.exports=function loadIllustrationReadingAuthoring(root){
 const base=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/manufacturing/illustration-reading-authoring-corpus-20261107.json'),'utf8'));
 const folder=path.join(root,'docs/ssw-workspace/manufacturing/illustration-reading-reviewed-overrides');
 if(fs.existsSync(folder))for(const name of fs.readdirSync(folder).filter(n=>n.endsWith('.json')).sort())for(const [text,row]of Object.entries(JSON.parse(fs.readFileSync(path.join(folder,name),'utf8')).nativeEntries)){assert.equal(row.sourceJa,text);assert.equal(row.contextReview,'ai_whole_field_compared');base.nativeEntries[text]=row;}
 return base;
};
