# V16 — remove inactive modal trees and JLPT resume underlay

User authorization: 2026-10-03 18:40 JST, remove unused layers/effects.
Base: 9066d6c624291149b9e9791b4044dc70e10b4e31, recovery/jlpt-n3-n1.

## Changes
- N1OfficialTrial waits for saved-session lookup before mounting the actual new-exam start page.
- Pending-session resume is an exclusive route view rather than a Modal above the start page.
- Pre-start restart confirmation is exclusive; confirmation remains mounted until attempt-summary lookup completes and begin() starts the exam. Lookup failure leaves confirmation available for retry/cancel.
- Closed JLPT navigator/restart/submit dialogs are conditionally mounted and additionally return null when invisible.
- Learn help, Profile details, Settings choices, location guide, registration language/level and work-registration category/occupation/operation dialogs mount only while open.
- Those modal transitions use animationType none. Reward modal also returns null when closed and has no Modal fade; its visible card reveal remains.
- RoyalPageBackground uses the existing brown root fallback rather than a second blue fallback. Its visible tint remains part of the intentional page treatment.
- Already conditional five farm dialog instances and dialogue reward caller are preserved. Unreferenced source components were not deleted or described as GPU layers.

## Relock
Only these two protected files changed under this explicit request:
- src/components/jlpt/N1OfficialTrial.tsx: 4a3abbc76b089cfaaf6835e64e85e2eac0e1264d79dd7667eb685c4a1be3cb31 -> d9fb6ccb033cf4d2349fcc52c73d14ef3b6000194557867d6d031b24c5de124a
- src/components/jlpt/ui/JlptExamUI.tsx: d845d4b61153d8706bd88617e734f07297f27afa7f0af45080213164138d6ebc -> 6612924f9b155762d44fdfb18b0e8cb315c76a4bb3fecaefa90a8fb71d9530e6

Exam data, scoring, session-storage implementation, audio implementation, question rendering and other eight locked files remain unchanged.

## Verification
- TSX syntax parsing PASS for ten changed source files.
- React 19.1 render harness with actual changed controller/UI and mocked native/storage interfaces PASS: unresolved lookup mounts no start action; saved-session resume mounts no start action or native Modal; restart wait mounts no start action; new exam retains its start action; four closed JLPT dialogs render null; restart saves a new session; continue preserves answers, scrollY 123 and listeningPositionMs 5000.
- Updated JLPT approved UI lock PASS 10/10; navigation contract PASS.
- No native Simulator/device frame-time, image decoding or real audio/microphone verification was available. These checks do not certify that every native transition flash is eliminated.
