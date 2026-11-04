import { createServer } from 'node:http';
import { createHmac, timingSafeEqual, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import pg from 'pg';

/* Private API. Requires externally verified identity and subscription entitlements.
   All monetary operations are disabled until store verification is configured. */
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: true } : undefined });
const secret = process.env.ECONOMY_AUTH_SECRET;
if (!secret || secret.length < 32 || !process.env.DATABASE_URL) throw Error('Set DATABASE_URL and ECONOMY_AUTH_SECRET (>=32 chars)');
const port = Number(process.env.PORT || 8787);
function send(res, code, obj) { res.writeHead(code, { 'content-type':'application/json', 'cache-control':'no-store' }); res.end(JSON.stringify(obj)); }
function auth(req) {
  // Signed short-lived identity assertion issued by the app's trusted auth service, NEVER by the client.
  const token = /^Bearer (.+)$/.exec(req.headers.authorization || '')?.[1];
  if (!token) throw Object.assign(Error('Unauthorized'), { status:401 });
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !/^[A-Za-z0-9_-]+$/.test(payload)) throw Object.assign(Error('Unauthorized'), { status:401 });
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  const a = Buffer.from(expected), b = Buffer.from(sig);
  if (a.length !== b.length || !timingSafeEqual(a,b)) throw Object.assign(Error('Unauthorized'), { status:401 });
  const data = JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));
  if (typeof data.sub !== 'string' || !/^[a-zA-Z0-9:_-]{1,128}$/.test(data.sub) || !Number.isSafeInteger(data.exp) || data.exp <= Math.floor(Date.now()/1000)) throw Object.assign(Error('Unauthorized'), { status:401 });
  return data.sub;
}
async function body(req) {
  let raw = '';
  for await (const part of req) { raw += part; if (raw.length > 8192) throw Object.assign(Error('Payload too large'), { status:413 }); }
  try { return JSON.parse(raw); } catch { throw Object.assign(Error('Invalid JSON'), { status:400 }); }
}
async function transaction(fn) {
  const db = await pool.connect();
  try { await db.query('BEGIN'); const value = await fn(db); await db.query('COMMIT'); return value; }
  catch (e) { await db.query('ROLLBACK'); throw e; }
  finally { db.release(); }
}
const handler = async (req,res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/health') return send(res,200,{ok:true});
    const userId = auth(req);
    if (req.method === 'GET' && url.pathname === '/v1/economy/me') {
      const result = await pool.query('SELECT available_points,held_points FROM economy_wallets WHERE user_id=$1',[userId]);
      // No client-side premium claims: premium remains locked until server-verified entitlements are available.
      return send(res,200,{plan:'free',premiumVerified:false,availablePoints:Number(result.rows[0]?.available_points || 0),heldPoints:Number(result.rows[0]?.held_points || 0),redemptionEnabled:false});
    }
    if (req.method === 'GET' && url.pathname === '/v1/economy/transactions') {
      const result = await pool.query('SELECT id,kind,delta_points,created_at FROM economy_ledger WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50',[userId]);
      return send(res,200,{items:result.rows});
    }
    if (req.method === 'POST' && url.pathname === '/v1/economy/learning-sessions') {
      // Do not credit time reported by the device. Record untrusted evidence for later verification.
      const data = await body(req);
      if (typeof data.activity !== 'string' || !['jlpt','dialogue','daily','weekly','monthly'].includes(data.activity)) return send(res,400,{error:'Invalid activity'});
      if (typeof data.sessionId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.sessionId)) return send(res,400,{error:'Invalid sessionId'});
      await transaction(async db => {
        await db.query('INSERT INTO economy_wallets(user_id) VALUES($1) ON CONFLICT DO NOTHING',[userId]);
        await db.query("INSERT INTO economy_learning_sessions(id,user_id,activity,verified_seconds,credited_points,verification_version) VALUES($1,$2,$3,0,0,'pending-v1') ON CONFLICT DO NOTHING",[data.sessionId,userId,data.activity]);
      });
      return send(res,202,{status:'pending_verification',creditedPoints:0});
    }
    if (req.method === 'POST' && url.pathname === '/v1/economy/redemptions') return send(res,503,{error:'Redemption disabled until provider, premium verification and fraud controls are operational'});
    if (req.method === 'POST' && url.pathname === '/v1/economy/store-notifications') return send(res,503,{error:'Store verification not configured'});
    return send(res,404,{error:'Not found'});
  } catch(e) { console.error('economy request failed', e.message); return send(res,e.status || 500,{error:e.status ? e.message : 'Internal server error'}); }
};
createServer((req,res)=>{ void handler(req,res); }).listen(port,()=>console.log('Economy API listening on',port));
