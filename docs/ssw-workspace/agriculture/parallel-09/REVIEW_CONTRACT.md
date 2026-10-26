# Batch09 independent direct-translation review

Scope:18 canonical Japanese lessons listed by parallel-08-manifest.json.newLessonIds. Each packet owns two target locales:36lesson-locale pairs,216body paragraphs,216headings,108title/objective/activity fields (540translated fields).

Read AGENTS/startup and Agriculture AUTHORING_REQUIREMENTS_VI.md. Apply the general approved respectful, natural and complete Kaigo language principles and relevant locale profiles; Kaigo-specific curriculum/production orders do not govern Agriculture.

Canonical source is src/data/agriculture/lessons.ja.json, not another translation. Read every source/target field in bounded2–5lesson chunks and save review progress. Never substitute field counts or token equality for semantic reading. Japanese technical headwords/readings can remain when they are the learning target. No public translation service or intermediate-language translation. Do not edit author packets, canonical data, UI or Git; write only the assigned review file.

Check completeness, natural terminology, negation, certainty, temporal order, source1/source2 scope, historical years, numeric values/units, inclusive/exclusive bounds and source-specific conditions. In particular preserve PVC-burning toxic-gas warning, UV/bee qualification, pF direction and source-dependent ranges, CO2/light qualification, nursery/graft roles, source2woody/herbaceous at-least2-year definition, fruit handling/ripening distinctions, flower-quality chain and distinct Japanese readings. Never add an unverified operation, diagnosis, legal rule or product prescription. Flag unclear Japanese to root rather than silently rewriting it.

Numeric screen:root runs `python scripts/agriculture/integrate-parallel-09.py --screen --pair TAG`. Check every candidate in numeric-screen-TAG.json. It compares normalized digit-token multisets only; source Kanji numerals, CO2 notation, ordinal labels and month names can legitimately differ. Preserve natural target expression, not artificial number formatting. If meaning is wrong, patch the field. If meaning is correct, add a specific source-grounded exception using the exact caseKey. Root rescreens the patched packet and rejects any remaining candidate without an exception.

Final JSON:

```json
{
  "status": "complete",
  "packetSha256": "actual SHA-256 of frozen author file",
  "scope": {
    "locales": ["assigned", "locales"],
    "lessonIds": ["all18 actual IDs"],
    "lessonLocalePairsReviewed": 36,
    "fieldsReviewed": 540,
    "reviewMethod": "direct Japanese semantic comparison of all translated fields"
  },
  "patches": [
    {
      "locale": "assigned locale",
      "lessonId": "actual ID",
      "field": "paragraphs",
      "paragraphId": "actual paragraph ID",
      "before": "exact old field",
      "after": "exact replacement",
      "reason": "specific source-based correction"
    }
  ],
  "numericExceptions": [
    {
      "caseKey": "exact screen key",
      "disposition": "meaning_preserved",
      "reason": "specific explanation of the same quantity/label/notation"
    }
  ],
  "unresolvedBlockingIssues": [],
  "nativeReviewed": false,
  "domainReviewed": false,
  "humanReviewed": false
}
```

Patch fields:title,objective,activity,paragraphTitles,paragraphs. paragraphId is required for the last two. Before/after must be exact; sourceHash is not editable. Bind the final raw file SHA and preserve honest limits. Once complete, notify root and end the turn to free the next parallel slot.

Batch09 has no staged canonical source correction. Preserve all144Japanese lesson hashes and all1512prior translation objects. Review every source/table qualifier, plant-part term, pH suitability/optimal/coarse distinction, rotation caveat, harvest旬/units and comparative economics. Flag Japanese ambiguities to root; do not change source binding.
