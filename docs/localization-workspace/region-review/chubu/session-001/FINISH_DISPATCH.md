# Finish dispatch: six balanced independent scopes

The original immutable assignment remains the logical ownership ledger. `finish-dispatch.json` divides only the 223 still-unreviewed IDs at checkpoint008 into physical AI scopes of 38/37/37/37/37/37. Each scenario belongs to exactly one physical scope. This is scheduling, not semantic cross-review or new completion evidence. Preserve all completed receipts. An AI may execute work for more than one logical worker, but each receipt uses the original logical owner and existing validation.

For physical AI number N, derive its pending list without printing prior reviewed bodies:

```python
import json, glob
base='docs/localization-workspace/region-review/chubu/session-001/'
done={e['scenarioId'] for p in glob.glob(base+'worker*-part*.json') for e in json.load(open(p))['entries']}
scope=next(s for s in json.load(open(base+'finish-dispatch.json'))['scopes'] if s['ai']==N)
pending=[x for x in scope['assignments'] if x['scenarioId'] not in done]
print(pending)
```

Run this scan under a shared `flock -s /tmp/chubu-finish-dispatch.lock`. Take the first one or two pending IDs that have the same `logicalWorker`. NEVER use the helper's default next IDs during this dispatch: another physical AI can own those IDs. Specify the selected IDs explicitly in every extraction.

```bash
flock -s /tmp/chubu-finish-dispatch.lock python3 scripts/dialogue-region-review.py context LOGICAL_WORKER --ids ID1 ID2
flock -s /tmp/chubu-finish-dispatch.lock python3 scripts/dialogue-region-review.py targets LOGICAL_WORKER --ids ID1 ID2 --locales en,vi,id
```

Read the Japanese metadata, all11 source turns and hints, then all12 target sets using the four locale groups in README. Return ONE group per tool result, max12000 output tokens; repair any truncation before attesting. Do not infer review from similarity, hashes or screening. Create the usual case-specific input only after actual full reading.

All reads use the shared lock; ALL records use its exclusive lock. This serializes file updates even when physical scopes contain different scenarios in one original owner's batch. A record process starts inside the lock, so its read/modify/write and part-number allocation cannot race another record. Changes to different IDs retain the other scope's fields.

```bash
flock -x /tmp/chubu-finish-dispatch.lock python3 scripts/dialogue-region-review.py record LOGICAL_WORKER --input /tmp/chubu-finish-aiN-group.json
```

Do not edit shared queues, manifests, sources, UI, audio, review flags, original assignment or completed receipts. Do not commit. Continue the whole assigned physical scope until empty or actual context/response-budget limit. Report exact unread IDs and any partial reading state at handoff; renew the same physical scope without rereading completed cases. The coordinator checks structural integration, scope uniqueness and persistence, not another AI's semantics. Only complete the region when all993 new IDs have valid all12 evidence and Chubu is1432/1432.
