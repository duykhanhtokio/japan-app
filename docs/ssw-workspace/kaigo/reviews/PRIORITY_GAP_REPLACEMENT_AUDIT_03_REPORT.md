# Kaigo — replacement audit 03

Date: 2026-10-08 (Asia/Tokyo)
Baseline: `99c5aa6bf03df5e9c1ebd242c9339ea574f46ce4`

## Outcome

All four candidates remain **NOT_READY_FOR_REPLACEMENT** and unselected. The audit maps 15 capability rows to all 11 objectives of the four original lessons. Four rows retain the principle, seven are partial, two retain the principle with only partial combined practice, and two do not retain the applied practice.

The two explicit gaps are distinguishing “not found here” from “lost” in the hygiene case, and arranging assistance/time when a resident leaves an activity early in the review case. Late entry is not equivalent to early departure. Other partial mappings include integrated reporting, inventory/permission handling, and opportunities that occur after the proposed replacement day. Day-40 practice cannot be counted as prior retrieval on day 14.

## Load and timing

| Candidate | Day | Knowledge VI token ratio | Reading/check JA character ratio | Decision |
|---|---:|---:|---:|---|
| Worker health | 14 | 1.569 | 1.288 | Not ready |
| Infection | 42 | 1.416 | 1.238 | Not ready |
| Care process | 50 | 1.431 | 1.411 | Not ready |
| Services | 49 | 1.290 | 1.252 | Not ready |

Ratios compare each candidate with its proposed base lesson. Vietnamese counts are whitespace tokens; Japanese counts are NFKC-normalized non-whitespace Unicode code points, not linguistic words. These increases do not establish elapsed time or difficulty. New concepts introduced in review slots still require teaching even when mandatory new vocabulary is zero.

The timing protocol contains four unexecuted learner-session templates. Day 14 uses 3/8/5/9/5 minutes; the others use 5/5/5/10/5. Observed times and learner records are empty. At 30 minutes, record unfinished work; any continued feedback time is recorded separately. No completion rate, sample size, or learner result is invented.

## Repairs

- Both candidate bundles now link this audit and explicitly keep replacementReady false.
- Care-process vocabulary now reuses the earlier reporting term instead of movement. Services removes unrelated bulletin/change/tidying/handover/reporting links and reuses confirmation/consultation terms.
- Batch-01 duplicate detection now reads the original lessons' textJa field as well as ja.
- Batch-02 validation checks canonical vocabulary IDs rather than forcing vocabulary equality with the proposed base lesson.

Candidate prose, readings, questions, answer keys, rubrics, and term explanations are unchanged. The original curriculum remains 54 ordinary lessons/270 questions and 60 mock questions. No candidate is assigned as an additional mandatory lesson.

## Verification and limits

The 43 inputs were materialized from exact GitHub blobs and verified against their blob hashes. Both existing candidate validators and the new replacement-audit validator pass under Node in an isolated snapshot. The new validator checks 37 immutable input hashes and includes three negative controls: an unknown vocabulary ID, a copied core textJa line, and an enabled release flag. All three are rejected.

The supplied 276-page Vietnamese textbook was materialized privately; its SHA-256 matches 997bf386ba8344e19c644c3cbd6ae2d40760bfb32ed882db999ad8e17068aa54. A full-text lexical screen checks 665 authored JA/VI fields, including 117 eligible fields, against exact normalized 60-character windows within each source page; zero hits were found. This is not semantic, external-source, image, copyright, or native-language approval. Official MHLW infection and worker-health references were checked as text; no new external PDF hash or visual page-offset certification is claimed.

No full repository suite, app/runtime test, learner timing session, semantic evaluator, or work-persistence script ran. All human, domain, native, publisher, rights, runtime, and release flags remain false. Private source text and images are not published.

## Next work

Preserve or repair the missing search/reporting and early-return assistance practice within the existing schedule before selecting replacements. Measure learner load and resolve the remaining partial mappings. Then continue original C02 abuse/restraint material with source verification; this audit does not authorize automatic selection or app integration.
