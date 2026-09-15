# CHECKPOINT — Japan App / JLPT UI hiện hành

- Tạo lúc: `2026-09-12T16:36:15+09:00`
- Source tuyệt đối: `/Users/doduykhanh/Desktop/japan-app99/japan-app`
- Phương thức: ảnh chụp chỉ-đọc theo SHA-256; checkpoint này không xác nhận runtime PASS.

## Ba nguồn JLPT N1 07/2012 đã được người dùng duyệt

- PDF đề: `/Users/doduykhanh/Desktop/Giáo trình/Nội dung đưa vào app/N1/Đề thi N1/N1 7-2012/N1 7-2012/Đề N1 7-2012.pdf`
  - SHA-256: `73f024f8b0fff45ae3e0e7b6546788ed4e79a47fe667729cbf76e9e947e0a8dd`
  - Bytes: `8695928`
- PDF đáp án/script: `/Users/doduykhanh/Desktop/Giáo trình/Nội dung đưa vào app/N1/Đề thi N1/N1 7-2012/N1 7-2012/Đáp án+Script N1 7-2012.pdf`
  - SHA-256: `1a4d6433625fb90acf9da6c827c64aefd396467403f887dcf321a7abe9d2d175`
  - Bytes: `3212087`
- MP3: `/Users/doduykhanh/Desktop/Giáo trình/Nội dung đưa vào app/N1/Đề thi N1/N1 7-2012/N1 7-2012/Nghe N1 7-2012.mp3`
  - SHA-256: `3921ae53abec4f655342655d7eed4604becee0bebc26ab4909133eb55115832b`
  - Bytes: `22158513`
- Không được dùng bất kỳ nguồn nào ngoài đúng thư mục chứa ba file trên.

## Route JLPT cần kiểm chứng

- Route: `src/app/[level]/[section].tsx`
- Import khai báo trực tiếp:
  - `@/components/jlpt/JlptMockTest`
  - `@/components/jlpt/N1OfficialTrial`
  - `@/components/jlpt/ui/JlptExamUI`
  - `@/components/ui/RoyalSurface`
  - `@/data/jlpt-learning`
  - `@/services/jlpt-progress-storage`
  - `@/theme/jlpt-exam-design-system`
  - `expo-router`
  - `expo-speech`
  - `react`
  - `react-native`
  - `react-native-safe-area-context`

## File ưu tiên không tìm thấy

- Không có.

## Snapshot mã nguồn JLPT

| File | Bytes | SHA-256 |
|---|---:|---|
| `AGENTS.md` | 10060 | `8da821ed1bc6f3c6fce9636f84adadae5c6248b212635e2113a17152d82da1c1` |
| `app.json` | 1056 | `52f3050f561cecdc2743d6bfe3b7a18f8f6f416c8a87783f7c5f0d14cd2160d7` |
| `eslint.config.js` | 236 | `6ea734f0e3f5b7c3c5720b3c467695516b14935724a78386b8534abc2959da12` |
| `metro.config.js` | 170 | `5576d95242aae008ddd3a6c4e063cc0eeae0ab05726e1bc59de979b3cec98755` |
| `package-lock.json` | 500826 | `21224a673340eea8d2bf380fdcdc05eef2b576f06d9da7fa53ae53aa696e9039` |
| `package.json` | 1707 | `b476fb29823d105625c573fcb16c5e6049d2a8771194c01222806df8acbc385f` |
| `src/app/[level]/[section].tsx` | 8478 | `6f6660125c86f791c118ee740e722c875f9553ee0e33fe6cb044b8e42cf19fdf` |
| `src/app/_layout.tsx` | 667 | `7e4f606b72c7a39749845056c5047305a74ba353057c38df5b189275b9ccc948` |
| `src/app/index.tsx` | 12923 | `5ba58196eb6265d36be8d8a73a6e85b201604e8c4049a73ab42e062b9ed571ac` |
| `src/components/jlpt/JlptAudioButton.tsx` | 1643 | `3c54fbd27b96348d74c0585bb1a3580d253f1c465b6296d27fbf008e0f4b8155` |
| `src/components/jlpt/JlptMockTest.tsx` | 11986 | `21967d1b938bcf9411e7ced237de648bcdc6203b2084f683b02f77bfc1e8b41d` |
| `src/components/jlpt/JlptQuestionFeed.tsx` | 5596 | `4d225173c56a71d3ed05cc84b7b5ff84314409baadc1055e057d9eb3a997675c` |
| `src/components/jlpt/KanaWritingGuide.tsx` | 5693 | `dc99bcfb1f562cfc0ca8a0f47fd608db7b250ee46301d5f8af0912136beb8ccd` |
| `src/components/jlpt/N1Official201207Test.tsx` | 10412 | `0719d93ba528bcc03d8f15bf12ab68f019d068ac110a5cbaf974dbc680f84e22` |
| `src/components/jlpt/N1OfficialTrial.tsx` | 27585 | `e2bfd9df706d19d4f8d7c3870bd4609ed4c1df605b1130ed4d2b84710daf2fe6` |
| `src/components/jlpt/N5CurriculumOverview.tsx` | 10249 | `b93f4781f49d55758476a3b0cc8bf7a8096311a0f5d3a929a4d9bd218a8ae2ac` |
| `src/components/jlpt/N5LearningJourney.tsx` | 42168 | `9b0e45d7d4b62149dbc10bfa8a30454a01a74a02fa4c3ab1aa9498cfb9e0ed77` |
| `src/components/jlpt/N5StudyPlan.tsx` | 21651 | `77db3a2dfa06f9ef789966d748fdf61d77c1033f1a2c7258a443e4d3bf8b8556` |
| `src/components/jlpt/jlpt-speech-sequence.ts` | 983 | `11e65047f02bbdd381af955512506d73bf3dd6178a51f86dc0072540da58f6ba` |
| `src/components/jlpt/ui/JlptExamUI.tsx` | 16588 | `0ecea5a9f733d8d076bde7b7c1ea75be692255aae55e4447da3121ae06aec6cc` |
| `src/data/jlpt-exam-config.ts` | 3635 | `8b2a3fd61eab3b1f55331efda06447cefd2a219cb0b062cedcce3ca2f4fab83a` |
| `src/data/jlpt-grammar-supplements.ts` | 7749 | `9e7fe1cfdc25a58a59c1a0d0e23664db64a59c9adc58d655869448f76d325fd0` |
| `src/data/jlpt-learning.ts` | 9624 | `b93671e9b1ca1b0a3c98d1decb98abe524a6e87ae0e5f211d45a2ac2a63b941a` |
| `src/data/jlpt-mock/answer-key.ts` | 3949 | `39131238f903a4704b9bbab5025df58d2dc3ab9a36d1330ec3d1f96ee8702ae0` |
| `src/data/jlpt-mock/n1-2012-07-official.ts` | 3073 | `5abb8f29d943daef6960891c8c0fcdcab80dd279e67ee89c44fc4b2d247c11ed` |
| `src/data/jlpt-mock/n3-authored-content.ts` | 26540 | `eaddc99858dc7b387103f77792d66d762724d24e1e3b8c39b000abed64ed9297` |
| `src/data/jlpt-mock/n5-blueprint.ts` | 3031 | `bb936557b5a1a122116602b5ae52418afcea3c9f1140b09fe83775728397c75a` |
| `src/data/jlpt-mock/n5-test-01-rest.ts` | 18952 | `db56a93840c7d134d364a05c6a7694890577ea4779321c4cda14cb8fc39690f3` |
| `src/data/jlpt-mock/n5-test-01-vocabulary.ts` | 9087 | `63956282d540ece06442a825ceee1ecdc09ba3a54f9bdd2e685aba50880161b6` |
| `src/data/jlpt-mock/n5-test-01.ts` | 645 | `dab1ffcacb346638834083f76818f2a20fcf7705b938659f3a988ab6a45d9680` |
| `src/data/jlpt-mock/official-structure.ts` | 4828 | `c45d107211acc1c1b188c5087179dafb4207bfbe9416bb7d540dadf6cbcc69b8` |
| `src/data/jlpt-mock/other-level-authored-content.ts` | 20881 | `3deb465f9e5ddd0ebf50e08cbd403c7ef714f8534b0220830a4a9d303a803e51` |
| `src/data/jlpt-mock/sample-exam-factory.ts` | 15166 | `c7fa515c396df415024721e56d54681839a360034a2147f64b36222aa5bcb9d5` |
| `src/data/jlpt-mock/sample-exams.ts` | 2390 | `292ffcfbb1cb2ba650df42e56cf2a3082bbf4f2fdb4658f075505a6a856fafd1` |
| `src/data/jlpt-mock/sentence-composition.ts` | 4014 | `27110da553fc4efbd16569b6df3401fb9e297011e24f1362a386f72df3c1aa39` |
| `src/data/jlpt-mock/types.ts` | 3368 | `0c50e98f76e474f20baf087ef7368fe59cf87ef8511ea0f8695f7db6eae2dd20` |
| `src/data/jlpt-official/n1-2012-07-trial.ts` | 6299 | `26ff30bb44101a6cedec36d4183dee2959f5a3eb5551828cc737a7655d413690` |
| `src/i18n/jlpt-learning-copy.ts` | 3150 | `22c22211944b85714ecddae80293e1dc0b918467c4fe59e905dd33f2d013fd68` |
| `src/i18n/jlpt-result-copy.ts` | 9418 | `9fce753f89e210f8aa291c3f9ce0d2fd89c0bd6970da86be6ecf3f77121574c9` |
| `src/services/jlpt-progress-storage.ts` | 2170 | `d429051d84b6ab00fbfc5c0530fc11263ebe72fe366ecb8ce6a2f8df0e3e37c3` |
| `src/services/jlpt-trial-session-storage.ts` | 2369 | `df2702ce4710c7481a69d09ca431a149c2f9f325b11224891860c6968b55736d` |
| `src/theme/jlpt-exam-design-system.ts` | 996 | `9d8276e32e5b1b25485d84cbe961acd5cbca5b106ee2dd95e6fbaadd9d2b9bb7` |
| `tsconfig.json` | 384 | `ce7dcda590758d8de283ff32819a4daff4228acbf84b27e5c6eac41965f81615` |

## Trạng thái Git khi tạo checkpoint

```text
unavailable
```

## Giới hạn

- Chưa trích xuất toàn bộ đề.
- Chưa sửa chức năng.
- Chưa chạy TypeScript, lint, Expo hoặc Simulator.
- Import graph phải được đối chiếu trên gói source trước khi tích hợp.
