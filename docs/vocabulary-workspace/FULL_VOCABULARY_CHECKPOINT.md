# Full vocabulary localization — active checkpoint

Scope: all 8,350 existing stable vocabulary IDs across N5–N1, all 298 existing Japanese example records, all 13 app languages, plus 311 additional N5 calendar terms. Japanese uses the corrected Japanese headword and source example; the other 12 locales require explicit meanings and example translations. No missing-string or English fallback counts as a completed translation.

Current completed data units: Indonesian 8350/298/311; Vietnamese 8350/298/311; English 8350/298/311; Simplified Chinese 8350/298/311; Traditional Chinese 8350/298/311; Bengali 8350/298/311. Other AI language workers continue independently. Runtime integration and whole-scope QA remain unfinished. The files are AI-authored and not native-reviewed. This is not an all-language completion claim.

The original vocabulary.json stays byte-preserved. vocabulary-source-repairs.json records original spelling/reading and explicit editorial corrections, applied by an original-source guard. All original IDs and stored progress keys remain stable. The 311 N5 additions also fix unsafe homophone matching such as はい/杯, 乾杯/完敗 and こと/琴. N5 calendar content uses explicit reviewed aliases; earlier progress-ID assignment is preserved.

English definitions for 1,704 formerly empty entries use the repository's JMdict SQLite source (SHA256 36918a97b86f41029b2a0b5c1eefce0a354471cf82fd3a9cf3088cf821563bcb), exact form/reading matches and explicit ambiguous-entry selections. Source: JMdict, Electronic Dictionary Research and Development Group, https://www.edrdg.org/jmdict/j_jmdict.html . These adapted dictionary definitions are under CC BY-SA 4.0, https://creativecommons.org/licenses/by-sa/4.0/ ; attribution and entry sequences are in vocabulary-english-provenance.json. EDRDG licence: https://www.edrdg.org/edrdg/licence.html . Other missing English definitions and source repairs were authored directly in this session. This attribution does not claim EDRDG endorsement.

8,052 existing records have no Japanese example sentence. This localization scope translates all 298 existing examples; it does not invent or claim new example sentences for those other records.

Next: finish each remaining locale, reconcile source repairs, integrate bound translations, verify all meanings per level/language and every existing example, run real-screen browser tests and the approved exam UI lock, then push and verify the final complete tree.
