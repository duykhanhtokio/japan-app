# Kagoshima independent city authors — 2026-10-15

Authorized scope: continue the Japanese dialogue rewrite by city. Six independent authors, no cross-reading or peer review; root mechanically integrates and remotely verifies each city before that author advances. Do not edit shared repository files, runtime JSON, checkpoints or Git.

Active repository (read-only for workers): /workspace/scratch/63c2c6bf58c3/japan-app
WRITE ALL outputs under /workspace/scratch/63c2c6bf58c3/dialogue-046-staging/, keeping the future repository-relative paths below. This lets other city commits pass persistence while authors work. Never put files in the active checkout.

Read your assigned INPUT.json completely: city, scenario, location, all existing eleven runtime turns and five tasks. Do not read another city author's prose/review or old authored source from another city. Shared code/metadata may be read only to check supported categories/jobs and schema.

For each assigned scenario, independently compose a specific causal exchange in Japanese. Exactly 11 turns: NPC first, then PLAYER alternating; turn11 is an NPC farewell/concrete closure. Exactly five concrete Player goals matching the five Player responses and the immediately preceding NPC. All Player utterances/goals within the city must be distinct, including similar venues. No noun-swapped recipe, repeated acknowledgment-only Player lines, reusable dialogue skeleton or level gate. Use N5–N1 vocabulary naturally. Keep distinct constraints, NPC follow-ups, decisions and realistic outcomes. Do not expose authoring/app/fictitious-scenario instructions inside spoken lines.

Current place names, hours, addresses, prices and policies are not verified facts. Use explicitly fictional learning venues in metadata/premises and internally coherent hypothetical conditions; do not claim real schedules, policies, diagnoses, eligibility or geography. Match actual venue/NPC capabilities: receptionist/nurse cannot issue institutional guarantees; police/bank consultation is not a determination. Fix mismatched categories/jobs using supported existing options. Rename unverified actual-looking institutions to explicit generic fictional venue names and clear openHours/address; do not invent routes, facility history or factual local rail claims. Bus Terminal/Bus Staff and Park/Park Staff are supported. Keep original city/scenario/location/turn IDs and original route grouping; root applies metadata.

Required outputs (CITY replaced with assigned exact uppercase ID, city filename lowercased):
1. scripts/dialogue-authoring/prf-046-city-city.json
   {scenarioId:{title:<JA>,premise:<JA>,turns:[11JAstrings],tasks:[[specificIntent,concreteJAgoal] x5]}}
2. docs/dialogue-workspace/content-qa/PRF-046_CITY_CITY_ROLE_ALIGNMENT.json
   {cityId,corrections:{locationId:{category,npcJob,nameJa?,name?,description?,openHours:null,address:null}},findings:[...],inputSha256,sourceSha256,humanReviewed:false,nativeSpeakerReviewed:false,peerReviewed:false}
3. docs/dialogue-workspace/content-qa/PRF-046_CITY_CITY_SELF_REVIEW.json
   {cityId,baseline,inputSha256,sourceSha256,roleAlignmentSha256,selfReviewed:true,fullFinalReread:true,counts:{scenarios,turns,tasks},causalPlots:{scenarioId:...},corrections:[...],checks:{...},peerReviewed:false,crossReadingPerformed:false,humanReviewed:false,nativeSpeakerReviewed:false,operatorPolicyVerified:false,deviceReviewed:false,releaseApproved:false,translationState:"deferred_until_all_japanese_complete",limits:[...]}

Hashes are SHA256 of EXACT final bytes: input file, authoring JSON and role JSON. Source means your authored JSON, not a projection. Future relative paths recorded inside evidence should start scripts/ or docs/, without staging prefix. Fully reread every final own turn/task/title/premise/role correction, check causal progression, contextual task alignment, closure, no repetition, Japanese-only, and numbers/names. If a final edit occurs, reread that passage and refresh hashes. Report actual corrections and limits. Native/human/peer/operator/device/release flags stay false.

Each city owns its three outputs, plus optional reproducible generator under the same staging prefix with its city ID in the filename. Freeze outputs after completion until root confirms integration; root may return only mechanical collisions for you to repair in your own material. Do not inspect counterpart dialogues from other authors.
