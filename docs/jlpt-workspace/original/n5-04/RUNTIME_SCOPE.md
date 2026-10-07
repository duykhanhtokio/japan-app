# N5 04 technical runtime scope

Reproduction uses Chromium from @sparticuz/chromium and Playwright, an isolated esbuild RN-web entry importing the unchanged production N1OfficialTrial and shared UI, real Expo audio/asset/image and AsyncStorage. The harness supplies focus/backdrop context, renders a reopen control outside the runner, and serves actual MP3/image assets. Detached native Audio objects are observed through constructor instrumentation; playback is not mocked.

Dependencies and paths are QA environment specific and remain outside the app. Harness source copies here are text audit artifacts, not application TypeScript. A matching real Back bitmap replaces only the LFS pointer in the QA asset resolver. NotoSansJP is a QA font; production font assets are not changed.

Expected checks: start, select/save one wrong answer, audio starts near zero, pause, Back/reopen/resume and selection color, incomplete submit, 0 correct/1 wrong/90 unanswered, review, no pageerrors. Separate browser-audio checker decodes five images and plays past the music boundary. Final evidence must be actual reports and 430×932 screenshots, visually inspected before completion.

This harness does not validate full Expo Router navigation, native iPhone, listening pitch accent, complete human hearing review, rights or release acceptance.

QA image dimensions: browser sources keep plain URIs with separate __qaWidth/__qaHeight metadata. A QA-only resolveAssetSource shim supplies actual PNG dimensions to the unchanged runner, mimicking native asset lookup without imposing intrinsic pixel height on RN-web Image. The initial screenshot showed that browser-only height issue; the corrected harness is rerun and final screenshots are inspected. Production UI/adapters are unchanged by this shim.
