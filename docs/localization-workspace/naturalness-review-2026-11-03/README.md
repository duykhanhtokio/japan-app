# Dialogue contextual continuation —2026-11-03

Current progress:41/7,128 complete sentence/task sets reviewed in all12 locales;
7,087 remain. This continuation adds8 scenarios,1,536 fields and16 targeted
repairs. The first Kanazawa scenario was completed in the preceding commit.
Japanese, stable IDs, turn order, audio, UI and native-review flags are preserved.

Read complete Japanese premises/exchanges plus all12 sentence/task sets for
Kanazawa02–09. Receipts record every reviewed source/target hash and every
before/after edit. Coverage-manifest hashes are synchronized only for edited
locale files. No blanket semantic or native certification is claimed.

Corrections clarify viewpoint/path instructions, photograph framing and contact
methods, distinguish receiving medical preparation instructions from giving
them, correct Bengali contact grammar, avoid translating a garment beneath a
jacket as underwear, distinguish head removal from complete fish deboning,
and repair a Thai indirect-question ending. Medical preparation and household
eligibility remain fictional dialogue contexts; no new real-world rules added.

Known issues:Japanese jacket dialogue changes from outer/inner layers to
上下(top/bottom); retained and recorded. Learner-gender forms in existing
Hindi/Thai/Khmer targets require a corpus-wide speaker/profile policy.
AI context review with such findings is not source/native/release approval.

Next:SC-LOC-017-10-001,batch035. Continue the remaining Kanazawa scenarios,
then remaining Ishikawa cities,using the canonical prefecture queue. This
continuation does not claim completion of the remaining7,087 scenarios.

Validation:source/ID/speaker/task binding checks for batches034 and035 pass
in all12 locales. `runtime-qa.json` exercises the real loader and checks all
current contextual receipt hashes as well as full-corpus structural coverage.
