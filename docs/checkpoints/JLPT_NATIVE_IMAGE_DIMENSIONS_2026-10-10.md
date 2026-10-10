# Native original JLPT image dimensions — 2026-10-10

Publisher reported an N5 Simulator screenshot with oversized illustrations overlapping prompts/answer options and explicitly requested responsive sizing correction.

Root cause: React Native Image on both iOS and Android merges intrinsic source.width/source.height before props.style. Absolute-fill offsets alone do not override those dimensions. The earlier web-only frame test did not exercise this native intrinsic-size merge.

The original jpapp illustration Image now explicitly uses width100%/height100% inside its source-aspect-ratio frame. The frame clips overflow defensively. Existing10px top/16px bottom spacing and N5 unscored/scored labels remain. No questions, answers, assets, audio, saved sessions, Kaigo UI or historical illustration branch changes.

Runner old SHA256:1dd8a9ca9c9e2fd9dcef70d4279d10949d2776d13b6e5c320a48cd96fe1e14d2
Runner new SHA256:6012b90f313722a76d3a3939faea0d8838cc2841421d1c53ff07d7f705cac9ca

Evidence: docs/jlpt-workspace/image-native-sizing-2026-10-10/. Production QuestionBlock tested with source.width/source.height present,84images across30forms at7viewports:320×568,390×844,430×932,932×430,768×1024,1024×768,1440×900.588browser image checks and588native Image style-merge checks PASS. Assertions cover matching frame/image bounds, original aspect ratios, margins, answer placement and no horizontal overflow/page errors. Phone, tablet and landscape screenshots inspected. Native style checks inspect production React element styles merged in the order used by installed React Native Image. They are not native-device execution. Native Simulator verification remains pending. UI-lock10/10PASS with this narrowly authorized image-size relock.
