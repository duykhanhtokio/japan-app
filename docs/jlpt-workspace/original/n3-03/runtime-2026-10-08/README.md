# N3 03 scoped runtime verification

Actual Chromium 153 decoder and isolated production runner RN-web harness; real Expo Audio, Expo Asset, images and AsyncStorage. Focus/backdrop contexts supplied, no locked production UI modifications. Japanese font used only in temporary harness rendering. Three screenshots inspected for Japanese glyphs, layout, selected answer, revised shipment illustration, spoken-only placeholder options and result.

Scripts in harness/ record the executed build and checks; temporary dependencies, browser executable, font and build output are not repository artifacts. Environment paths reflect the execution checkout. Reproduction requires npm ci, esbuild, Playwright, a compatible Chromium binary and Noto Sans JP font; adapt local paths, build, copy font into generated www01/font.ttf, run test01.cjs and assets.cjs. See runner-report.json and asset-playback-report.json for limits. No full native/router/perceptual claim.
