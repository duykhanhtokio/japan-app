import test from 'node:test';
import assert from 'node:assert/strict';
import { verifiedHeartbeatSeconds, pointsFromVerifiedSeconds } from './session-verifier.mjs';
test('rejects forged elapsed durations and idle events',()=>{
 assert.equal(verifiedHeartbeatSeconds(0, 1000000, true),0);
 assert.equal(verifiedHeartbeatSeconds(0, 60000, false),0);
 assert.equal(verifiedHeartbeatSeconds(0, 1000, true),0);
 assert.equal(verifiedHeartbeatSeconds(0, 60000, true),60);
});
test('premium-only points and full minute requirement',()=>{
 assert.equal(pointsFromVerifiedSeconds(119,true),1);
 assert.equal(pointsFromVerifiedSeconds(120,false),0);
 assert.equal(pointsFromVerifiedSeconds(-1,true),0);
});
