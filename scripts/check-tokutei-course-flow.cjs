const assert = require("node:assert/strict"),
  fs = require("fs"),
  path = require("path"),
  root = path.resolve(__dirname, ".."),
  modules = process.env.TOKUTEI_QA_MODULES,
  dependency = (name) =>
    require(require.resolve(name, { paths: [modules || root] })),
  React = dependency("react"),
  renderer = dependency("react-test-renderer");
let m;
global.requestAnimationFrame = (fn) => setTimeout(fn, 0);
global.cancelAnimationFrame = clearTimeout;
global.IS_REACT_ACT_ENVIRONMENT = true;
global.__tokuteiStorage = new Map();
global.__tokuteiFailSave = false;
const { act } = renderer;
const sleep = () => new Promise(setImmediate);
function hosts(tree, id) {
  return tree.root.findAll(
    (n) => typeof n.type === "string" && n.props.testID === id,
  );
}
function get(tree, id) {
  const list = hosts(tree, id);
  assert(list.length, `Missing ${id}`);
  return list[0];
}
async function click(tree, id) {
  await act(async () => {
    const n = get(tree, id);
    assert(!n.props.disabled, `${id} disabled`);
    n.props.onPress();
    await sleep();
  });
}
function raw(tree) {
  const errors = [];
  function walk(n) {
    if (!n) return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (typeof n === "object") {
      if (n.type !== "Text")
        for (const c of n.children ?? [])
          if (typeof c === "string" || typeof c === "number")
            errors.push({ type: n.type, text: c });
      (n.children ?? []).forEach(walk);
    }
  }
  walk(tree.toJSON());
  assert.deepEqual(errors, [], "Native text must only appear under Text");
}
function text(tree) {
  const values = [];
  function walk(n) {
    if (Array.isArray(n)) n.forEach(walk);
    else if (n && typeof n === "object") (n.children ?? []).forEach(walk);
    else if (typeof n === "string") values.push(n);
  }
  walk(tree.toJSON());
  return values.join(" ");
}
async function mount(C, props) {
  let t;
  await act(async () => {
    t = renderer.create(React.createElement(C, props));
    await sleep();
  });
  raw(t);
  return t;
}
async function unmount(t) {
  await act(async () => t.unmount());
}
async function end(tree, id) {
  await act(async () => {
    const n = get(tree, id);
    n.props.onLayout({ nativeEvent: { layout: { height: 700 } } });
    n.props.onContentSizeChange(430, 1400);
    n.props.onScroll({
      nativeEvent: {
        layoutMeasurement: { height: 700 },
        contentSize: { height: 1400 },
        contentOffset: { y: 700 },
      },
    });
    await sleep();
  });
}
(async () => {
  m = await require("./tokutei-ui-qa/compile.cjs")(root, modules);
  let t = await mount(m.KensetsuCourse, {
    learner: "qa",
    language: "vi",
    onBack() {},
  });
  await click(t, "kensetsu-field-utilities");
  await click(t, "kensetsu-mode-study");
  await click(t, "kensetsu-week-1");
  await click(t, "kensetsu-day-1");
  assert(!text(t).includes("BẢN_DỊCH_TEST"));
  raw(t);
  await click(t, "kensetsu-translation");
  assert(text(t).includes("BẢN_DỊCH_TEST"));
  raw(t);
  await end(t, "kensetsu-reader");
  await click(t, "kensetsu-complete");
  assert.equal(hosts(t, "kensetsu-reader").length, 0);
  assert(text(t).includes("学習済み"));
  await unmount(t);
  // Storage failure must keep the reader open instead of losing the day.
  t = await mount(m.KensetsuCourse, {
    learner: "save-failure",
    language: "vi",
    onBack() {},
  });
  await click(t, "kensetsu-field-utilities");
  await click(t, "kensetsu-mode-study");
  await click(t, "kensetsu-week-1");
  await click(t, "kensetsu-day-1");
  await end(t, "kensetsu-reader");
  global.__tokuteiFailSave = true;
  await click(t, "kensetsu-complete");
  assert.equal(hosts(t, "kensetsu-reader").length, 1);
  global.__tokuteiFailSave = false;
  await unmount(t);
  // All examination controls are siblings of the scroll view, with no 40-question grid.
  t = await mount(m.KensetsuReviewTests, {
    learner: "qa",
    level: "1",
    field: "utilities",
    onBack() {},
  });
  await click(t, "kensetsu-test-exam-01");
  raw(t);
  const footer = get(t, "kensetsu-test-controls");
  assert(
    !footer.parent
      .findAll(
        (n) =>
          typeof n.type === "string" &&
          n.props.testID === "kensetsu-test-content",
      )[0]
      ?.findAll((n) => n === footer).length,
  );
  assert.equal(
    t.root.findAll(
      (n) =>
        typeof n.type === "string" &&
        String(n.props.testID).startsWith("kensetsu-test-navigator-"),
    ).length,
    0,
  );
  await click(t, "kensetsu-test-choice-1");
  await click(t, "kensetsu-test-next");
  assert(text(t).replace(/\s/g, "").includes("問題2/40"));
  await click(t, "kensetsu-test-restart");
  await click(t, "kensetsu-test-confirm-restart");
  assert(text(t).replace(/\s/g, "").includes("問題1/40"));
  raw(t);
  await unmount(t);
  // The actual 176-day Kaigo curriculum is rendered through the new Japanese adapter.
  t = await mount(m.KaigoCourse, { onBack() {}, active: false });
  assert.equal(hosts(t, "kaigo-week-schedule-1").length, 0);
  await click(t, "kaigo-week-1");
  await click(t, "kaigo-calendar-day-1");
  raw(t);
  assert.equal(hosts(t, "kaigo-japanese-reader").length, 1);
  assert(
    !/[À-ỹ]/u.test(text(t)),
    "No Vietnamese before the translation action",
  );
  await click(t, "kaigo-translation");
  assert(/[À-ỹ]/u.test(text(t)));
  raw(t);
  await end(t, "kaigo-course-scroll");
  await click(t, "kaigo-complete-day");
  assert.equal(hosts(t, "kaigo-japanese-reader").length, 0);
  assert.equal(hosts(t, "kaigo-week-schedule-1").length, 1);
  await unmount(t);
  // Kaigo completion must also remain open on a storage failure.
  global.__tokuteiStorage.delete("@japan_app_kaigo_weekly:completion:v1");
  t = await mount(m.KaigoCourse, { onBack() {}, active: false });
  await click(t, "kaigo-week-1");
  await click(t, "kaigo-calendar-day-1");
  await end(t, "kaigo-course-scroll");
  global.__tokuteiFailSave = true;
  await click(t, "kaigo-complete-day");
  assert.equal(hosts(t, "kaigo-japanese-reader").length, 1);
  global.__tokuteiFailSave = false;
  await click(t, "kaigo-complete-day");
  assert.equal(hosts(t, "kaigo-japanese-reader").length, 0);
  await unmount(t);
  // Full Kaigo mocks retain one question and persistent controls in review, too.
  t = await mount(m.KaigoCourse, { onBack() {}, active: false });
  await click(t, "kaigo-weekly-tab-mocks");
  await click(t, "kaigo-mock-" + m.kaigoCourse.mocks[0].id);
  raw(t);
  assert.equal(hosts(t, "kaigo-mock-controls").length, 1);
  await click(t, "kaigo-option-0");
  await click(t, "kaigo-mock-next");
  await click(t, "kaigo-mock-restart");
  await click(t, "kaigo-confirm-restart");
  await click(t, "kaigo-submit-exam");
  await click(t, "kaigo-confirm-submit");
  raw(t);
  assert.equal(hosts(t, "kaigo-mock-review").length, 1);
  assert.equal(hosts(t, "kaigo-mock-controls").length, 1);
  assert.equal(get(t, "kaigo-option-0").props.disabled, true);
  await unmount(t);
  // Palette decisions and paragraph retention, using every real Kaigo section.
  assert.equal(m.readingPeriod(7), "day");
  assert.equal(m.readingPeriod(18), "day");
  assert.equal(m.readingPeriod(19), "night");
  assert.equal(m.readingPeriod(6), "night");
  const days = m.kaigoCatalog.map((entry) => {
    const old = m.sectionsFor(entry),
      next = m.japaneseSectionsFor(entry);
    assert.equal(old.length, next.length);
    old.forEach((section, i) => {
      assert.equal(section.id, next[i].id);
      assert.deepEqual(section.paragraphs, next[i].paragraphs);
    });
    return {
      day: entry.day,
      sections: next.length,
      completeJapanese: next.filter((s) => s.japaneseComplete).length,
      missingJapanese: next.filter((s) => !s.japaneseComplete).map((s) => s.id),
    };
  });
  const report = {
    date: "2026-10-15",
    status: "UI_PASS_JAPANESE_CONTENT_INCOMPLETE",
    days: days.length,
    sections: days.reduce((n, d) => n + d.sections, 0),
    completeJapaneseSections: days.reduce((n, d) => n + d.completeJapanese, 0),
    missingJapaneseSections: days.reduce(
      (n, d) => n + d.missingJapanese.length,
      0,
    ),
    allExistingParagraphsPreserved: true,
    nativeDeviceTested: false,
    humanReviewed: false,
    releaseReady: false,
    perDay: days,
  };
  if (process.env.TOKUTEI_QA_REPORT)
    fs.writeFileSync(
      process.env.TOKUTEI_QA_REPORT,
      JSON.stringify(report, null, 2) + "\n",
    );
  console.log(
    "TOKUTEI FLOW PASS: saved completion returns to week; failure stays; Japanese first / explicit translation; native text nodes; fixed examination controls and restart; all real Kaigo paragraphs preserved.",
  );
  console.log(JSON.stringify({ ...report, perDay: undefined }));
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
