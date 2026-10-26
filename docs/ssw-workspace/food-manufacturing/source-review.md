# Food manufacturing source inventory — 2026-10-26

## Verified source identity

The supplied documents concern **飲食料品製造業**, not 外食業. The first document is the OTAFF 1号 study text, version 5.1, April 2026, with 86 PDF pages. The second is the OTAFF 2号 study text, version 3.01, April 2026, with 165 PDF pages. SHA-256 hashes and original filenames are in `source-map.json`.

The scope of this inventory is the complete table of contents, including supplements, references, indexes and notices. There are **158 entries: 54 for 1号 and 104 for 2号**. These are inventory counts, not completed lesson counts. Chapter and parent section entries overlap child subsections intentionally. Leaf topics need further decomposition where a long source section contains several competencies.

## Page mapping

- 1号: PDF page = printed page + 5. All 81 printed footers were checked against extracted page boundaries; none unresolved.
- 2号: PDF page = printed page + 9. All 156 printed footers were checked against extracted page boundaries; none unresolved.
- The opening chapter pages were additionally parsed with pypdf. The 2号 opening chapter is PDF10, not PDF11.
- PDF page numbers are one-based. Printed page ranges are conservative TOC boundaries; multiple entries may begin on the same printed page.
- The wrapped 2号 HACCP subsection at printed51 was manually joined into its complete heading.

## Stable IDs and downstream binding

IDs use `food-{level}-c{chapter:02d}-s{section:02d}-u{subsection:02d}`. A chapter or section omits the subsequent segments. Supplements and reference material use explicit appendix/reference IDs. Every entry records its document, level, source heading, learning objective, PDF/printed page, parent and review state.

`lessonIds`, `questionIds` and `illustrationIds` are intentionally empty until actual authoring is bound and checked. A TOC record does not imply content coverage. Metadata such as the index should be marked as reference coverage rather than padded into a learner lesson.

## Source cautions checked during inventory

1. **Allergen list, 1号 printed9 / PDF14:** visually checked. The 2026 edition lists nine mandatory categories and twenty recommended categories. Its note states the April2026 additions of cashew to mandatory ingredients and pistachio to the recommended group. Do not inherit an older count of eight mandatory allergens. This is a statement about the attached edition; current legal claims beyond it require fresh official verification.
2. **Critical limits versus operational limits, 2号 printed47 / PDF56:** visually checked. The source distinguishes CL and OL and gives separate example values. These are contextual teaching examples. Do not turn them into a universal factory setting or imply every workplace uses the same terminology.
3. **Monitoring example, 2号 printed48 / PDF57:** extracted text inspected. Fryer temperature and duration are an illustrative process example and must not be promoted into general food-safety instructions.
4. 2号 explicitly builds on 1号 foundations and adds supervisory knowledge. Shared topics must retain different worker/supervisor outcomes.
5. PDF tables, diagrams, illustrations, video links and small notes still require page-specific review when used in authored content. Full-text extraction is available, but extraction alone is not visual or domain certification.

## Initial review limits (superseded by the follow-up below)

All source pages were extracted; the TOCs and complete printed-page mappings were checked. This pass does **not** certify that every paragraph, table, figure or numeric value has been fully read and reviewed. `sourceBodyReviewed`, `sourceVisualReviewed` and `domainExpertReviewed` remain false for units unless a later scoped review supplies evidence. Two sampled visual reviews are recorded separately and do not certify whole sections.

Before reporting full coverage, bind each authored lesson/question to the exact knowledge entries and inspect its cited source pages. Within-section knowledge expansion, all video links, all image-based information and all numeric claims remain open until that work is performed. Do not mark publication-ready on the strength of this inventory.


## Follow-up body review and priority visual review

The instructional body has now been read in compact extracted form: 1号 printed1–69 plus notices/references80–81; 2号 printed1–143 plus notice156. Index pages were checked structurally as reference material, not treated as additional instructional competencies. Compact reading removes kana-only furigana lines to reduce interleaving; original layout is retained for page-specific checks. This is AI source reading, not native or domain-expert certification.

Priority visuals inspected:

- 1号 printed9,11,25,29,33,34,47,63,64,65: allergen list, pathogen table, handwashing, storage temperatures, heat/cooling examples, PPE and safety signs.
- 2号 printed29,34,43,47,69,70,71,77,78,79,80,81,84,90,91,100,103,118,125,127: SSOP, temperature log, process flow, CL/OL, normal distribution, numerical examples, Pareto/scatter/histogram/control charts, progress/utilization, KYT and risk assessment.

### Confirmed source discrepancies

1. 2号 printed70–71 (PDF79–80): the overall mean23.8g for18000 items is inconsistent with subgroup means25.5g for10000 and24.0g for8000. The weighted mean is24.833333…g. This inconsistency is visible in the PDF, not just extraction. Do not reproduce this dataset or silently certify its arithmetic. Write fresh consistent examples.
2. 2号 printed91 (PDF100): formula e labels quantities72.7 and75 as MH, although the surrounding text identifies them as kg/MH productivity. Use matching productivity units in newly authored calculations.

### Additional authoring checks sent to authors

- Soft foreign objects remain unacceptable, even where the source distinguishes them from hard physical hazards.
- Norovirus does not multiply in food; its four prevention principles differ from the three bacterial principles. Cold storage does not sterilize; preformed heat-resistant toxins can remain after heating.
- Ingredient storage conditions differ. Any extracted table must preserve food category, inequality, units and notes. Heating/cooling/chemical examples are contextual and should not become universal operating recipes.
- Failed detector tests require identifying affected production since the last confirmed working test. Restoring the machine alone does not release previously made products.
- ATP is an organic-residue cleanliness indicator; it does not by itself prove successful disinfection.
- HACCP validation assesses effectiveness, verification checks that management is implemented. Correction and root-cause corrective action must be distinguished.
- SPC control limits differ from product specification limits. Normal-distribution percentages assume the relevant distribution, and3σ is not a guarantee of100% conformity. Scatterplot correlation alone does not establish causation.
- Yield can exceed100% when expressed against a selected raw ingredient with added water, and higher yield is not always better. State denominator and sale unit. Line productivity and labor productivity can move in opposite directions.
- Planned operating time excludes the stated planned stops; define denominators before calculating utilization. Maintain kg/MH versus MH distinctions.
- Risk assessment requires identifying hazards, estimating risk, selecting priorities and implementing measures. The sample matrix is an example, not a universal mathematical scoring formula. Give design/elimination and engineering measures priority over dependence on PPE.
- Immediate danger may require an immediate clear warning; this does not authorize angry public humiliation. Teach-back is stronger evidence than a yes response.
- Health and harassment reports require privacy, escalation and a supportive reporting climate. Supervisors should not diagnose workers or promise individual immigration outcomes.
- Historical statistics, government campaign dates and source references are edition-specific. Avoid calling them current without external official verification.

### Binding snapshot and explicit unresolved scope

At this snapshot51 lessons existed:37 for1号 and14 for2号. Page-overlap matching gives88 TOC units with candidate references and70 without any candidate reference. **Zero units are certified as fully covered by this operation.** Full lesson IDs are reserved for reviewed competency bindings; candidate references are stored separately with their matching pages and an explicit overlap-only basis. The map contains `unaddressedUnitIds` and `unverifiedCompetencyUnitIds` so absence cannot be hidden.

The37 1号 lessons were read for source consistency. No direct contradiction was found in that pass. They remain an initial conceptual treatment: full knowledge coverage still needs, among other things, detailed allergen/pathogen distinctions, table-based reading and numeric conditions where appropriate, equipment/PPE distinctions and safety-sign recognition. Referring generally to a source table is not equivalent to teaching its complete contents. No exam, illustration or translation completeness is implied by source mapping.

Source-body review remains distinct from source factual correctness, up-to-date legal verification, full-document visual review, content coverage and learner-facing integration.


## Final binding snapshot of this pass

The refreshed inventory references **78 authored lessons** and **160 questions** as candidates. 153 TOC units have candidate lesson page references; 73 have candidate question knowledge-ID references; 5 have neither. The explicit unaddressed and no-lesson lists are in `source-map.json`. All158 units still await formal full-competency coverage verification.

The five added1号 lessons038–042 were checked against the source lists/tables and the already inspected original visuals. Allergen names and counts, eight bacterial categories, ingredient-storage groups, contextual heating/cooling/chemical numbers, Anisakis conditions and fifteen safety-sign meanings match the attached edition. These checks do not certify current legal applicability or replace workplace procedures.

The initial80 question prompts, keyed correct answers and main explanations were read. Their knowledge IDs and PDF/printed page offsets validate. One wording correction was sent to the question author:2号 q011 should say acting before deviation from CL, rather than before satisfying CL. All distractors and later forms still need scoped source review; no full exam certification is claimed.


## Weekly assessment checkpoint update

The frozen assessment inventory now contains160 mock questions and 39 weekly questions (199 total). Source-map candidate question references include the 39 additions by their explicit knowledgeId. Earlier 160-question review counts above describe the earlier snapshot; they do not certify the 39 additions. All structural/semantic review limitations remain.
