# Independent N1 06 runtime QA harness

Loads the byte-locked production runner/shared UI, actual new106-response adapter/master and real complete recording. The isolated build supplies navigation focus/backdrop context and a historical session-key/type-only stub; no old question arrays are authoring or runtime harness inputs. Existing approved font/art materialized from prior repository-backed QA assets. Dependencies are in dependencies.json.

Commands: node build06.cjs; node test06.cjs; node assets.cjs. Paths: /tmp/jlpt-runtime-deps/node_modules, /tmp/n106-qa-www. Playwright comes from CODEX_PRIMARY_RUNTIME_NODE_MODULES; Chrome headless executable is /tmp/jlpt-headless/chrome-headless-shell-linux64/chrome-headless-shell.

Checks selection/save, independent shared-story answers, play at0ms, pause, Back/reopen/resume, incomplete submit, score and review. Asset QA decodes the full recording and checks automatic continuation after music/resume announcement. Screenshots must be inspected. This harness does not establish full-router/native-device, perceptual or publisher approval. Reports are produced only by executed checks; completion is not inferred from the harness files.

Set JLPT_QA_ASSET_ROOT to the materialized repository assets/app directory when using a sparse checkout. The session/type-only stub is included as legacy-session-contract.ts. It supplies only existing structural contracts and the exact historical session key.
