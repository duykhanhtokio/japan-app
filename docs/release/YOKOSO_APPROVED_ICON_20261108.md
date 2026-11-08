# Approved YOKOSO icon — 2026-11-08

Publisher approved the crowned tanuki with small paws on the multicolour YOKOSO wordmark, on midnight navy. Use the exact approved artwork; no changes to its subject, wordmark or palette.

The Expo root icon and the iOS AppIcon catalog use identical 1024 x 1024 RGB PNG bytes without alpha. Both PNGs are stored directly in Git with narrow attribute exceptions, so a checkout does not require LFS to retrieve the release icon. SHA-256: 41ba17747f6d2c0f1abec6ba93f494776b59745d676cbd87eaae9e783feb30ec.

The previous empty Android adaptive-icon configuration contained only a white background. Remove that unused override so Expo's default icon generation uses the approved root icon without enabling foreground cropping. Native Android output still requires its own build; no Android build was run here.

The App Store icon is delivered by the signed iOS build, not changed directly on an existing App Store page by this source commit. Native rebuild/archive and upload are still required; no TestFlight/App Store upload was performed.

The publisher's Mac may still have an untracked white file at the native AppIcon path. Back up/move that untracked placeholder before pulling this commit, so Git can install the approved tracked PNG. Preserve any tracked local changes for review. Do not reset or clean the checkout.
