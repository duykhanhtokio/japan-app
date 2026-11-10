// Exact historical predecessor for the source63 preservation check.
// This never rewrites the canonical ledger or treats a later snapshot as the old one.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..'),hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function predecessor(current){
 const receipt=JSON.parse(fs.readFileSync(path.join(root,'docs/ssw-workspace/manufacturing/source64-reimplementation-20261106.json')));
 const expected=['mfg47-mechanical-phantom-neighbor','mfg47-mechanical-phantom-before-after','mfg47-mechanical-phantom-repeat','mfg47-mechanical-phantom-front','mfg47-mechanical-break-shape','mfg47-mechanical-break-role','mfg47-mechanical-cut-role'];
 assert.deepEqual(receipt.changes.map(c=>c.knowledgeId),expected);
 const output=structuredClone(current);
 for(const change of receipt.changes){const index=output.knowledgeUnits.findIndex(u=>u.knowledgeId===change.knowledgeId);assert(index>=0);assert.equal(hash(output.knowledgeUnits[index]),change.afterSha256,'Unrecognized source64 ledger state');assert.equal(change.before.knowledgeId,change.knowledgeId);assert.equal(change.before.status,'partial');output.knowledgeUnits[index]=structuredClone(change.before);}
 return output;
}
module.exports={predecessor};
