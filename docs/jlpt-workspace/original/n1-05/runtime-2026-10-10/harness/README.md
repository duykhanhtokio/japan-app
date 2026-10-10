# N1 05 isolated technical runtime QA

These tests load the unmodified production N1 runner and shared exam UI with the actual N1 05 master, adapter, full audio and existing artwork/font. They supply focused navigation and inherited backdrop context. In this isolated source tree only the exact legacy session constant and structural types are supplied; legacy question arrays are excluded. No production UI or app dependency files are modified.

Install the exact versions recorded in dependencies.json in an isolated dependency directory. The build expects /tmp/jlpt-runtime-deps/node_modules and resolves the QA source root through its node_modules link. Playwright is supplied by CODEX_PRIMARY_RUNTIME_NODE_MODULES. Point JLPT_QA_BROWSER at the actual Chrome headless executable; this run used Chrome 145.0.7632.6 with single-process/no-zygote/no-sandbox arguments.

Run build05.cjs, test05.cjs and assets.cjs from the QA source root. The build writes /tmp/n105-qa-www. The tests write reports and three 430×932 screenshots in the parent directory. Required existing UI assets/font must be materialized and verified; no visual substitutions were used.

Runner checks start/save, independent shared-story answers, first actual play call at 0, pause, Back/reopen/resume, incomplete submit, score and review. Opening is measured at the play call to avoid a delayed DOM observation. Asset checks decode the complete real track and test playback/pause plus automatic continuation across music/resume announcement. No full-router/native/perceptual approval is claimed.

Measured complete recording3348292ms (55m48.292s); runner/decoder/playback reports PASS. Three430x932screenshots inspected. The design includes five unscored examples and exact 60,000 ms original music. Technical gates also include the repository content/audio/adapter validators, focused adapter TypeScript and 10/10 UI hash lock. Publisher/native/perceptual/rights/release flags remain false.
