# JLPT N5 direct-source inventory

```text
SOURCE ROOT: /Users/doduykhanh/Desktop/Nội dung đưa vào app/N5
SOURCE LOCAL HEAD: 9b34683afe8fcde6b6b52100e4b717678ea3de07
SOURCE BRANCH: main (clean, no configured upstream)
REMOTE: https://github.com/duykhanhtokio/japan-app-n5-source.git
REMOTE DURABILITY: not established; origin advertises no branch ref
AUDIT DATE: 2026-09-23 (Asia/Tokyo)
```

The directory and filenames are inventory hints only. Each package remains `incomplete` until its PDF, answer material, transcript, audio content, and timing evidence are audited directly. No source directory was copied or repackaged.

| Catalog target | Direct source evidence | PDF | Audio | Identity disposition |
|---|---|---:|---:|---|
| `n5-2011-12` | Cover prints `2010-2011年 日本語能力試験 N5`; it does not isolate December 2011. The question set contains 65 written and 24 listening responses, a key, partial Chinese analysis/translation, and Japanese listening transcript. | 21 pages; SHA-256 `6277e9ba5b18e43a572ec93a6b7cadced911b8744c5605ff661632a0247cf6a6` | 1712.900998 s M4A; SHA-256 `880f22485b45ed6970182799ca4567ea6645972b42923a166f3d29a9ac9f62ae` | unresolved; audit directly but do not claim 12/2011 |
| `n5-2012-12` | Cover explicitly prints `2012年12月 日本語能力試験 N5`. Direct inspection found 67 written responses, 24 listening responses, a complete answer table, Chinese explanation/translation for 55 written responses, and Japanese transcript for all listening responses. The supplied question scan omits the source passages/questions for reading responses 27–29, while the key and explanation discuss them. Audio section order and recognized content align with the listening sheets and transcript. | 22 pages; SHA-256 `4320847c1f89415c21169ad9e24dfec3b4d534c5c2594726125ccacded5facab` | 1843.958005 s M4A; SHA-256 `88afeee93f0bb0b4311f016fa4d1f19a0035c7f5c1cece1ed88dffa3d9345557` | strong period/content match; incomplete because source question pages 27–29 and 12 written explanations are absent, runtime transcription is pending, and timing is unverified |
| `n5-2013-07` | Cover explicitly prints `2013年7月`; it also states that the volume contains test paper, analysis, and listening script. | 17 pages; SHA-256 `e1e787b10f29adee65e1fc4e7a165e9a6e6a29e6b521f82d37cb0c2479b0fe05` | 1779.409000 s MP3; SHA-256 `ad43948e6dd89cdff016377488284745e2539879a9d7cf14cab14a2a963aba1d` | strong PDF period evidence; audio/content cross-check pending |
| `n5-2017-07` | Cover/body text prints `2017年7月`; the PDF includes listening transcript pages. Its stale 2012 InDesign metadata is packaging metadata and not identity proof. | 49 pages; SHA-256 `00abb65816b435fd153054902c8b059ad5a842e9b15f80aed8f75443dada136b` | 1709.950000 s M4A; SHA-256 `7c8f8d2827b19a1e34e2271fe50f0513989dbac3f69606a804d600fb0a49e5d1` | strong printed period evidence; audio/content cross-check pending |
| `n5-2018-12` | Cover prints only `2018年 日本語能力試験 N5`; no month has yet been found in the directly inspected pages. | 24 pages; SHA-256 `604220381a3cbdbf89647b2d315b0f72af870a789779b8cd85a14516078c900e` | 1730.592993 s M4A; SHA-256 `d09cb4f18006cca4350bec478341683353f897b4cbdf570a482e39be90ee98f1` | year only; December identity unresolved |
| `n5-2020-12` | PDF footer identifies `ベスト模試 N5 第2回`; the 35 audio files are named `BPT_N5_2_02` through `_36`. This is direct evidence of a practice test, not an official December 2020 exam. | 32 pages; SHA-256 `18a47a85016ad0ab09277f2140e20264f651a17f056bd9deafc9d3686633001e` | 35 segmented MP3s; total 1789.998645 s; ordered SHA-list digest `ca306855466ff7fd40e6d46a434087b592100dc6e793f296edb1dcf53e11ab9e` | source mismatch: practice test 2, not proven 12/2020 |
| `n5-2021-12` | Question pages explicitly print `2021年12月・日本語能力試験・N5`. | 17 pages; SHA-256 `284c73e4cf4b55f6bd1f6b2d1fb7579beb5cf1002fe36d28ed1e242d48669a67` | 1747.200000 s MP3; SHA-256 `f33f2ef39098d309e5f0373e25af376afb204fd9c166ace64b5e58d21dd28020` | strong PDF period evidence; answers/transcript/audio cross-check pending |

Processing order remains chronological. A package with unresolved identity or missing content receives a complete source audit of everything available, stays `incomplete`, passes its own durable-work gate, and then processing continues to the next package.
