# JLPT exam inventory after approved UI lock

Audit date: 2026-09-15 (Japan time)

The word "integrated" in the older JSON report means data validation passed; it does not prove that the exam is reachable through the approved N1 UI. Runtime wiring was checked separately below.

| Exam | Data found | Questions | Approved UI wiring | Current assessment |
|---|---:|---:|---|---|
| N1 07/2012 official, exam 01 | Yes | 106 | Yes, through `N1OfficialTrial` | Complete reference exam |
| N1 12/2012 official, exam 02 | Yes | 70 written + 36 listening | No; old Royal component exists but is forbidden | Data complete, approved-UI adapter still required |
| N1 mock 01 | Yes | 108 | No; generic mock path/report only | Requires approved-UI-compatible data adapter |
| N2 mock 01 | Yes | 107 | Uses `JlptMockTest`, not the approved N1 component | Requires approved-UI-compatible data adapter |
| N3 mock 01 | Yes | 102 | Uses `JlptMockTest`, not the approved N1 component | Requires approved-UI-compatible data adapter |
| N4 mock 01 | Yes | 98 | Uses `JlptMockTest`, not the approved N1 component | Requires approved-UI-compatible data adapter |
| N5 mock 01 | Yes | 91 | Uses `JlptMockTest`, not the approved N1 component | Requires approved-UI-compatible data adapter |
| Planned exam slots 02–10 without source data | No | — | No | Blocked: must not invent questions |

Protected N1 12/2012 validation result at lock time:

```text
written 70
listening 36
explanations 840/840
audio verified
```

Stop condition discovered: the approved `N1OfficialTrial.tsx` currently hardcodes the 07/2012 dataset, audio, visual options, and storage functions. Its SHA-256 is locked. Connecting exam 02 through that same component therefore requires either explicit permission for a controlled, behavior-preserving parameterization followed by a newly approved checkpoint, or a separate adapter architecture that does not alter any locked file. No UI code was changed during this inventory.
