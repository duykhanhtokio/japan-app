# N2 01 runtime evidence

Unmodified production runner/shared UI, isolated RN-web harness; supplied focus/backdrop contexts. Build with `JLPT_QA_FONT=/path/to/materialized/Japanese.ttf node harness/build01.cjs` then `node harness/test01.cjs` and `node harness/assets.cjs` from repository root. Test requires existing React/Expo dependencies, esbuild and Playwright/Chromium. Current QA font was scratch NotoSansJP; approved project font/royal art are unmaterialized LFS placeholders here. No full-router/native/exact approved-art-font or perceptual claim.

All three screenshots inspected after Japanese font was loaded. Shared dialogue response3/4 save distinct answers, survive Back/resume and score separately. Result0/3/103of106; opening/audio pause and automatic music boundary pass. Full decoded duration3008969ms, music60000ms. Temporary built bundle/font excluded from Git; reproducible harness sources retained.
