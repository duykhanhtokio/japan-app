# Dialogue rolling transcript and inactive guide cleanup — 2026-10-03

Base: 9066d6c624291149b9e9791b4044dc70e10b4e31, remote-verified before edits. Scope: latest user request to continue dialogue UI, preserving initial one panel then rolling latest two panels, right lantern and approved scene/HUD placement.

Changes: capture player transcript by departing turn before abortListening clears it; previous panel uses its own stored transcript and cannot display the current recording or a waiting animation. Active player hints remain unchanged. Location guide Modal now mounts only while open and uses no fade. Reward Modal returns null while hidden and uses no page fade; the visible reward card reveal is retained.

Checks: mocked executable dialogue flow covers five automatic NPC/player pairs, boundary text, hint stages, final turn, stale speech callback, archived transcript survival and no waiting dots in archived player panel. All pass. TSX transpilation of all three changed source files passes. JLPT lock 10/10 remains unchanged. No native device/Simulator or visual runtime check was performed; no claim that native flicker is eliminated.

Remaining layer audit: dialogue reward already conditionally mounted at caller; guide was the remaining always-mounted Modal in the location/dialogue route. JLPT locked controller still renders its initial start screen while saved-session loading resolves, and mounts inactive confirmations/navigator via visible=false; the start button is a visible legacy branch, not proof of a hidden green overlay. These locked files are unchanged in this narrow dialogue commit. Navigator blue fallback was already removed at f9221949. Home shade and farm inactive care/planting/cosmetic layers were already removed in the base. Actual iPhone transition verification remains pending.

Concurrent remote update 3f47cf7d arrived during persistence: retained all its inactive modal removal and exclusive JLPT resume/session-loading changes. Location guide conflict was equivalent conditional-mount formatting; retained remote form. The JLPT remaining-layer paragraph above describes the original base only and is superseded by this remote update.
