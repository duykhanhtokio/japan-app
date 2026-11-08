# First learner beta — iOS release preparation

Status: PREPARATION ONLY. No signed Release archive or TestFlight upload exists from this session.

## Source and scope

- Native dependency/photo permission changes from the publisher's Mac were verified on GitHub at 0bc48f89e828ddfd3c8ac3a8e685c6931a2b89aa, tree bc0ebc25e8458c03af887a80f3fa0dadf2ab5705.
- Existing app version 1.0.0, native build 1; bundle ID com.doduykhanh.japanapp. Do not change the publishing identity or bundle ID without publisher confirmation.
- All learner/JLPT/dialogue access is free for this release. Three institution portals remain disabled; game routes lead to missions. Preserve later commercial features and data.
- No Apple Developer Program membership yet (publisher confirmed). Enrollment, signing team and App Store Connect app record remain external prerequisites. Never request passwords, two-factor codes, private keys or certificates in chat.

## Confirmed blockers / remaining evidence

1. GitHub's native AppIcon catalog references App-Icon-1024x1024@1x.png but contains only Contents.json. The publisher's Mac has an untracked icon. That image must be checked visually, validated and saved before a reproducible release is frozen. This task does not fabricate or replace branding.
2. Apple currently requires Xcode 26+ and iOS SDK 26+ for App Store Connect uploads (since 2026-04-28). The previously reported Xcode 16.3 must be checked on the actual Mac and upgraded if still in use.
3. The AI checkout is sparse and runs on Linux. Missing assets here are not evidence that those assets are absent on the publisher's Mac. Run the provided check on the Mac to identify its real unresolved LFS pointers/missing files and CocoaPods state.
4. No physical-device Release acceptance, native archive, signing or upload was performed. Technical tests do not certify all educational content or all translations.
5. Confirm final display name/icon, support and privacy-policy URLs, App Store privacy declarations, rights to distributed content/voices, beta contact and export-compliance answers before submission. Do not invent these details or claim no data collection without examining actual services.

## Read-only Mac check

From the existing working copy after fetching/merging the new preparation commit:

```bash
node scripts/release/check-ios-beta.cjs
```

Optional machine-readable report:

```bash
node scripts/release/check-ios-beta.cjs --json > "$HOME/Desktop/japan-app-ios-beta-check.json"
```

Exit 2 means automatic blockers were found. The checker does not install packages, download media, modify source files, sign or upload. It checks clean source/tracking ref, installed JS/native module versions, usage descriptions, tracked 1024px PNG icon without alpha, presence of tracked assets/unresolved LFS pointers, Xcode/SDK version, plist syntax and installed Pods. A successful automatic check still requires manual signing and device acceptance. It is not App Store approval.

Do not reset, clean, delete or stash user changes to make the checker pass. Review and preserve them. Restore only the reported missing media/LFS objects; do not regenerate existing illustrations or voice recordings.

## Build and acceptance order

1. Enroll the chosen publishing individual/organization in Apple Developer Program; use its proper team. Confirm the bundle ID before the first upload.
2. Resolve preflight blockers; save the real native icon; ensure npm ci and pod install have completed on the Mac.
3. Build Release for a physical iPhone. With Metro stopped, test cold startup/onboarding, profile camera and album/persistence, all JLPT levels/access/resume/submission, Kaiwa first/warm NPC playback, all Tokutei sector choices/week/day/review, language switching and mission routing.
4. Once acceptance passes, open ios/japanapp.xcworkspace in Xcode, select the application target and signing team, choose a generic physical iOS destination, and Product > Archive using Release. Validate in Organizer. Increment build number when re-uploading; keep app/native versions aligned.
5. Upload the validated archive to App Store Connect and use TestFlight first. Provide beta metadata and complete required compliance/review steps. Public App Store submission is a separate step after the beta is accepted.

## Technical checks executed here

Passed: free-learner access/unlimited zero-credit sessions; 11 blocked institution routes with learner routes open; onboarding re-entry/disposed-audio cleanup; 13-locale Premium/profile photo mocked-host tests; six lightweight Tokutei entry/selection/back tests; ranged Kaiwa clips; approved JLPT UI lock 10/10. Native device/visual acceptance not performed. Full repository type/build and full media readiness are not certified by the sparse-host checks.

## Official references (checked 2026-11-08)

- https://developer.apple.com/news/upcoming-requirements/
- https://developer.apple.com/help/account/membership/program-enrollment
- https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/
- https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/
