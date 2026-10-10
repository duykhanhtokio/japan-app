# Original JLPT illustration layout repair — 2026-10-10

Authorized by publisher request 2026-10-10: inspect/recreate merged images and align top/bottom spacing across all 30 new forms.

Only original jpapp question illustrations use an explicit aspect-ratio parent with absolute-fill Image (10px top,16px bottom). This prevents Image intrinsic pixel height from reserving a tall contain box on native. Legacy illustration branch is preserved. N5 pair labels distinguish unscored practice left and scored question1 right, retaining audio references. Six N5 pair assets independently regenerated as colored2D, two bordered panels/clear cream divider. All30masters/IDs/keys/scripts/audio unchanged.

Prior runner SHA256: 65f584d660cc852cbd2a37deddec4a088c414d44aa40335686d91dfcade9b943
New runner SHA256: 1dd8a9ca9c9e2fd9dcef70d4279d10949d2776d13b6e5c320a48cd96fe1e14d2

Runtime: production QuestionBlock in RN-web,30forms at390/430/768widths,84illustrations per width; frame height/spacing/no-overflow/no-page-error PASS. Four phone screenshots visually inspected. Native Simulator verification remains pending. All other9UIlocks preserved. Full TypeScript reports pre-existing life-content-repository.ts TS2352; no JLPT diagnostics. Asset manifests/hashes PASS.
