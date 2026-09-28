# JLPT vocabulary and grammar Back checkpoint V12

```text
STATUS: USER AUTHORIZED
DATE: 2026-09-28 (Asia/Tokyo)
SCOPE: keep Back visible while scrolling vocabulary and grammar
```

The Back control in the vocabulary list, vocabulary detail, related vocabulary
list, and grammar route now sits outside the scroll view. The shared
`[level]/[section].tsx` route also serves characters; its Back remains visible
there as a consequence. The exam catalog and exam-taking components do not
change.

The home and learning pages again use the original Royal A+F image-backed HUD
and bottom navigation. Their compact `study` variants are no longer selected.

Updated locked SHA-256:

```text
4d210c29a91df77de1fad0c07ef07f52ae8e05ea4c8d1caa4c92d3116313d7f4  src/app/[level]/[section].tsx
```

All other V11 hashes remain unchanged. Simulator visual verification is required.
