# Source coverage v2 — publisher requirement, 2026-11-02

The attached seven-sector requirement supersedes topic/count-based closure. This registry is the canonical acceptance view; historical ledgers remain provenance, never an independent competing total. Source census, semantic inventory and accepted teaching are separate.

## Sector file: `<sector>.json`

Sectors: agriculture, manufacturing, food, restaurant, hospitality, construction, kaigo.

```
{
 "schemaVersion": 2,
 "sector": "food",
 "baselineCommit": "<40 hex>",
 "sources": [{"sourceId":"food-2", "sha256":"<64 hex>", "pdfPages":165,
   "aliases":[], "byteVerified":true, "verificationRef":"<repo receipt or precise note>"}],
 "pages": [{"sourceId":"food-2", "pdfPage":1,
   "disposition":"unclassified",
   "exclusionReason":null,
   "regionCensus":{"artifactPath":"docs/.../food-regions.json", "sha256":"<file hash>",
     "elementCount":12, "status":"extracted", "visualReviewRef":null},
   "semanticInventory":{"status":"pending", "reviewRef":null},
   "knowledgeIds":[]}],
 "knowledgeUnits": [],
 "denominator":{"status":"open", "reviewNote":"All pages are inventoried, not all ideas."},
 "wholeSourceKnowledgeCovered":false,
 "review":{"domainReviewed":false,"nativeReviewed":false,"physicalDeviceTested":false,"learnerDurationMeasured":false},
 "unresolved":[]
}
```

Sources use unique content hashes with aliases for byte-identical files; different hashes with similar text are not automatically duplicates. Pages must cover each canonical source page exactly once. A missing/unreadable source stays explicit in sources with byteVerified=false and an unresolved reason.

Page dispositions: unclassified, instructional, navigation, publication, decorative, mixed.
Census statuses: missing, extracted, visually_reviewed, blocked.
Semantic inventory statuses: pending, partial, complete_ai, excluded.
Denominator statuses: open, inventoried_ai. Never infer inventoried_ai from a loop over page numbers.

## Region artifact

```
{"schemaVersion":1,"sector":"food","sourceId":"food-2","pages":[
 {"pdfPage":1,"elements":[
  {"elementId":"food-2:p1:t0","kind":"text","bbox":[0,0,10,10],"sha256":"<hash of private source content>",
   "classification":"pending","knowledgeIds":[],"reason":null}
 ]}
]}
```

Element kinds: text, text_span, image, vector, table, formula, unknown. Preserve ALL text, including small fonts/ruby/captions; record font metadata when useful. Do not silently discard image placements, vectors or empty/scanned pages. Geometric groups do not count as knowledge. Classification: pending, knowledge, duplicate, navigation, decorative, blocked. An explicit exclusion or duplicate requires a concrete reason; knowledge requires known knowledgeIds. Source text, extracted prose, PDF pages and source screenshots are private inputs, not public Git artifacts. Hashes, coordinates, original concise factual statements and app-authored evidence may be committed.

## Knowledge unit

```
{"knowledgeId":"food-v2-001", "sourceRefs":[{"sourceId":"food-2","pdfPage":83,"elementIds":[]}],
 "statementJa":"Independently stated factual learning objective",
 "conditionsJa":[],"exceptionsJa":[],"importance":"core","classification":"knowledge",
 "before":{"teaching":"unknown","assessment":"unknown"},
 "after":{"teaching":"partial","assessment":"missing"},
 "teachingEvidence":[],"assessmentEvidence":[],"imageEvidence":[],
 "assessmentRequirement":"required","assessmentExemptionReason":null,
 "expressionReview":{"status":"pending","note":""},
 "status":"candidate","unresolved":["Exact region assignment still requires source reading."],
 "review":{"domainReviewed":false,"nativeReviewed":false,"physicalDeviceTested":false}}
```

Importance: core, safety, supporting, reference. Classification: knowledge, duplicate, excluded, blocked. Unit status: candidate, partial, covered_ai, duplicate, excluded, blocked. State: unknown, missing, partial, present. assessmentRequirement: required, not_required, practical_external. An exemption needs a specific reason. A duplicate needs duplicateOf pointing to a non-duplicate canonical unit. Historical rows with only page-level references remain candidate/partial until exact source element assignment is self-checked. Preserve original historical IDs/provenance in optional legacyRefs; do not pretend parent and child rows form independent unique ideas.

## Evidence

```
{"path":"src/data/food-manufacturing/source-closure43.json",
 "jsonPointer":"/sections/0/bodyJa", "sha256":"<SHA256(JSON.stringify(selected JSON value))>",
 "sha256Mode":"json-value","relation":"direct","semanticReviewed":true,
 "reviewNote":"Explain exactly which source claim/condition this teaches or tests."}
```

Use file SHA256 when sha256Mode=file; then require a precise locator and app-authored quote for direct teaching/assessment. JSON pointers follow RFC6901. Semantic review is worker self-review, not cross-worker, native or expert acceptance. Candidate relevance/keyword matches never become direct evidence automatically. Image evidence can use file SHA plus objective/rights/caption metadata.

covered_ai requires exact source element references, current direct teaching evidence, direct assessment evidence or a valid exemption, independent expression self-check and no unresolved items. It is NOT expert/native/physical-device certification. Complete page inventory requires every element classified, source visual review, complete semantic review and a review receipt; page closure additionally requires all its mandatory knowledge covered. Whole-sector closure additionally requires a reviewed frozen denominator and no missing pages/regions/units. Output percentages stay null while denominator=open.

## Ownership and execution

Each worker owns its sector JSON, sector-prefixed region artifacts, sector-specific content and receipts. Root owns this contract, shared validator, registry and integration. No cross-worker semantic review. Preserve current learner IDs/state. Japanese first; regenerate only affected translations/readings/assets after independently checking content. Persist complete batches; do not stop at census when supported missing teaching can be fixed.

Validator: `node scripts/source-coverage-v2/check.cjs docs/ssw-workspace/source-coverage-v2/<sector>.json`. It supports deterministic `.json.gz` region artifacts; artifact SHA is over compressed bytes. `--require-covered` adds a separate whole-sector gate; ordinary PASS means structural/current evidence validity only. A covered_ai unit also needs `sourceReview:{status:"self_checked_ai",conditionsChecked:true,reviewRef:"..."}`. Other extraction types (links/annotations) may use kind=unknown with originalKind metadata; nothing is silently discarded. All source/page/element/knowledge links are reciprocal. Use Node SHA256(JSON.stringify(value)) for exact JSON-value evidence hashes; arbitrary Python JSON serialization can differ on floats/escaping.
