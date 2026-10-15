const fixtureSession = {
  id: "session-001",
  titleJa: "作業前の確認",
  titleTranslations: { vi: "BẢN_DỊCH_TEST" },
  clusters: [
    {
      id: "cluster-01",
      titleJa: "安全の確認",
      paragraphs: [
        {
          id: "p-01",
          ja: "作業を始める前に、周囲の状況を確認します。",
          translations: { vi: "BẢN_DỊCH_TEST" },
        },
      ],
    },
  ],
  illustrations: [],
};
const questions = Array.from({ length: 40 }, (_, i) => ({
  id: "q-" + i,
  number: i + 1,
  promptJa: "安全を確認する行動はどれですか。",
  choicesJa: ["作業前に確認する", "何も確認しない", "記録しない", "報告しない"],
  correctIndex: 0,
  explanationJa: "作業前に確認します。",
  sourceReferences: [],
}));
module.exports = { fixtureSession, questions };
