# Home artwork measured-cover repair — 2026-10-03

User reports all three Home artwork cards still leave gaps after testing the latest branch. This report remains a native acceptance failure; prior web screenshots do not override it. No new native screenshot or native layout measurement was provided with this request.

## Verified cause and limits

All three original PNGs are opaque RGB 2172×724 with no transparent or empty right/bottom margins. The Royal border is a separate nine-slice open raster overlay. The original image-card design let the image occupy the card's flex bounds; later padded ImageBackground dimensions coupled artwork sizing to text padding. A subsequent absolute-fill-only repair produced natural 2172×724 DOM image bounds in a 406×135 card in the integrated web app, as documented in ROYAL_INTEGRATED_RUNTIME_2026-10-03.md. Both are concrete historical layout defects.

The immediately preceding version has an unpadded sibling Image with percentage width/height plus absolute-fill offsets. It passes previous web checks. We have not reproduced the user's remaining native gap, so percentage sizing is not a proven diagnosis of the latest native symptom. Do not claim all-device acceptance or explain an unobserved native failure as established fact.

## Change

Only Home artwork positioning changes. Each actual Pressable reports width and height with onLayout. For verified source size 2172×724, use scale=max(cardWidth/2172,cardHeight/724). Set image width=2172×scale, height=724×scale, left=(cardWidth-imageWidth)/2 and top=(cardHeight-imageHeight)/2 as numeric React Native dimensions. Both axes use the same scale; resizeMode=stretch renders this already aspect-preserving rectangle. Image bounds no longer use percentages, source natural dimensions or text padding. The card clips overflow. Existing text, Royal border, routes, card heights, economy and protected JLPT files remain intact. Size changes recompute the image from actual layout.

## Validation

Production Expo web export and scoped ESLint pass. check-home-measured-coverage.cjs drives the complete production app and resizes the same Home page through 360×800, 430×932, 768×1024, 1366×768, 932×430 and 1024×768. All 18 card/image comparisons cover all four edges within 0.1 px and preserve 3:1 aspect ratio; zero page errors. Screenshots and runtime.json are under docs/ui-workspace/home-measured-cover-2026-10-03/. Phone portrait and phone landscape screenshots were inspected directly. Landscape cards are in the existing ScrollView. Native image bounds, decode/rendering and Simulator coverage are not verified by these web measurements.

Next acceptance: update Mac to this commit, cold reload Metro and inspect all three cards in iOS portrait/landscape. If gaps persist, capture the current screenshot and actual native layout bounds before further changes; do not repeat unmeasured padding/percentage adjustments. No original asset replacements or shared frame redesign were made.

Pre-edit Home SHA-256: 3b461860310c1ee0a962951ea94addf266bcbeb9d46afec2786da665a945b753. Require remote persistence verification before claiming this unit saved.
