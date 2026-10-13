# Construction study layout — 2026-10-13

Publisher-authorized change: replace the long55-week list with six week groups and a responsive grid of at most10weeks. Show short topics and completion counts, the selected week's seven lesson links, and a resume control. Keep Royal navigation/header accents and use a simple reading/calendar surface.

Navigation is stored separately from the existing completion record, scoped to learner, level and field. It records selected week/group, last opened lesson and calendar scroll offset. Writes are serialized. Returning from a lesson and reloading restore the selection and position. Existing completion IDs, revision keys and manual end-of-lesson completion remain unchanged.

Images use each asset's measured ratio and the measured article container, with width and height limits for landscape. All111ratios match decoded assets. Added the three missing week-1 ratios explicitly; no image was regenerated. The fullscreen image viewer has a pinned close control, scrollable caption and safe-area padding; orientation changes retain the active lesson/viewer.

Actual component rendered with React Native Web, expo-image and storage web adapters, and zero-inset safe-area adapter. Tested320×568,430×932,568×320,932×430,768×1024 and1024×768. Tests cover group6/week55, resume, back/reload/scroll restoration, completion persistence and learner/level/field isolation, image ratio/landscape height, image enlargement/closing and rotation. DOM text was enlarged150% at320×568. AI visually inspected26screenshots in `runtime-tests/2026-10-13-layout`; runtime report records limits. No iOS/Android Simulator, physical device, native accessibility or native safe-area validation is claimed. Isolated bundle warning: missingexpo/tsconfig.base; this was not a fullExpo build.

Data registration passes55weeks/385lessons/3,856paragraphs/111images. JLPT UI lock passes10/10. Lesson bodies, images, progress identifiers and production gate are unchanged. Only Construction UI and its asset-ratio map change. Remote proof is the commit containing this checkpoint plus fetch and `WORK PERSISTENCE PASS`.
