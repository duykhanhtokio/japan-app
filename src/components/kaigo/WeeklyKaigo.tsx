import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import {
  RoyalContentPanel,
  RoyalExplanationPanel,
} from "@/components/ui/RoyalPanels";
import { ROYAL_FONT } from "@/components/ui/RoyalSurface";
import RoyalPageBackground from "@/components/ui/RoyalPageBackground";
import {
  TokuteiHeader,
  TokuteiDayCard,
  TokuteiActionBar,
} from "@/components/tokutei/TokuteiChrome";
import {
  useStudyAppearance,
  ReadingAppearanceControl,
  TranslationText,
} from "@/components/tokutei/StudyAppearance";
import { useAppLanguage } from "@/context/LanguageContext";
import { kaigoCourse } from "@/data/kaigo";
import { kaigoCatalog, type CatalogEntry } from "@/data/kaigo/catalog";
import {
  japaneseSectionsFor,
  titleForDay,
} from "@/data/kaigo/japanese-reading";
import { illustrationForStudyDay } from "@/data/kaigo/weekly-art-allocation";
import { kaigoDepthFigures } from "@/data/kaigo/depth-figures";
import {
  assessmentRevisionForWeek,
  completionKey,
  emptyCompletion,
  learningWeeks,
  mockForDay,
  questionsForWeek,
  restoreCompletion,
  weekDone,
  type Completion,
  type WeeklyQuestion,
} from "@/data/kaigo/weekly-learning";
import { loadKaigoState, saveKaigoState } from "@/services/kaigo-storage";
import type { MockForm, RubyToken } from "@/data/kaigo/types";

function Action({
  title,
  onPress,
  disabled = false,
  testID,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[s.action, disabled && s.disabled]}
    >
      <Text style={s.actionText}>{title}</Text>
    </Pressable>
  );
}
function useSaved<T>(
  key: string,
  initial: () => T,
  restore: (raw: string | null) => T,
) {
  const [value, setValue] = useState(initial),
    [ready, setReady] = useState(false),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(false);
  const current = useRef(value),
    loaded = useRef(false),
    restoreRef = useRef(restore),
    queue = useRef(Promise.resolve()),
    writes = useRef(0),
    live = useRef(true);
  restoreRef.current = restore;
  useEffect(() => {
    live.current = true;
    loaded.current = false;
    setReady(false);
    void loadKaigoState(key)
      .then((raw) => {
        if (live.current) {
          const next = restoreRef.current(raw);
          current.current = next;
          setValue(next);
          loaded.current = true;
          setReady(true);
          setError(false);
        }
      })
      .catch(() => {
        if (live.current) setError(true);
      });
    return () => {
      live.current = false;
    };
  }, [key]);
  const update = useCallback(
    async (change: (old: T) => T): Promise<boolean> => {
      if (!loaded.current) return false;
      const next = change(current.current);
      current.current = next;
      const n = ++writes.current;
      setSaving(true);
      const write = queue.current
        .catch(() => {})
        .then(() => saveKaigoState(key, next));
      queue.current = write;
      try {
        await write;
        if (live.current) {
          setValue(next);
          setError(false);
        }
        return true;
      } catch {
        if (live.current) setError(true);
        return false;
      } finally {
        if (live.current && n === writes.current) setSaving(false);
      }
    },
    [key],
  );
  const retry = () => {
    if (loaded.current) void update(() => current.current);
    else
      void loadKaigoState(key)
        .then((raw) => {
          if (!live.current) return;
          const next = restoreRef.current(raw);
          current.current = next;
          setValue(next);
          loaded.current = true;
          setReady(true);
          setError(false);
        })
        .catch(() => {
          if (live.current) setError(true);
        });
  };
  return { value, ready, saving, error, update, retry };
}
type Route =
  | { kind: "day"; day: number }
  | { kind: "assessment"; week: number }
  | { kind: "mock"; id: string }
  | null;
type AssessmentState = { answers: Record<string, number>; submitted: boolean };
function restoreAssessment(
  raw: string | null,
  questions: WeeklyQuestion[],
): AssessmentState {
  try {
    const p = JSON.parse(raw ?? "null");
    if (
      typeof p?.submitted !== "boolean" ||
      !p.answers ||
      typeof p.answers !== "object" ||
      Array.isArray(p.answers)
    )
      return { answers: {}, submitted: false };
    const answers: Record<string, number> = {};
    for (const [id, a] of Object.entries(p.answers))
      if (
        typeof a === "number" &&
        Number.isInteger(a) &&
        a >= 0 &&
        a < 4 &&
        questions.some((q) => q.id === id)
      )
        answers[id] = a;
    return {
      answers,
      submitted:
        p.submitted && Object.keys(answers).length === questions.length,
    };
  } catch {
    return { answers: {}, submitted: false };
  }
}
function WeeklyAssessment({
  week,
  completed,
  onComplete,
  completeReady,
}: {
  week: number;
  completed: boolean;
  onComplete: () => void;
  completeReady: boolean;
}) {
  const questions = questionsForWeek(week),
    st = useSaved<AssessmentState>(
      `@japan_app_kaigo_weekly:assessment:${assessmentRevisionForWeek(week)}:${week}`,
      () => ({ answers: {}, submitted: false }),
      (raw) => restoreAssessment(raw, questions),
    );
  const [index, setIndex] = useState(0),
    [translationOpen, setTranslationOpen] = useState(false),
    scroll = useRef<ScrollView>(null),
    { colors } = useStudyAppearance();
  const q = questions[index],
    answered = Object.keys(st.value.answers).length,
    allAnswered = questions.length > 0 && answered === questions.length,
    score = questions.filter(
      (x) => st.value.answers[x.id] === x.correctIndex,
    ).length;
  const move = (next: number) => {
    setIndex(next);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  if (!q)
    return (
      <Text style={[s.body, { color: colors.text }]}>
        この週の確認テストは準備中です。
      </Text>
    );
  return (
    <View style={s.root} testID={`kaigo-weekly-assessment-${week}`}>
      <ScrollView ref={scroll} contentContainerStyle={s.content}>
        <View style={s.article}>
          <RoyalContentPanel style={s.paper}>
            <Text style={s.heading}>第{week}週 · 確認テスト</Text>
            <Text style={s.meta}>
              {st.value.submitted
                ? `結果 ${score}/${questions.length}`
                : `問題 ${index + 1}/${questions.length} · 解答済み ${answered}`}
            </Text>
            <Action
              title={translationOpen ? "翻訳を閉じる" : "翻訳を見る"}
              onPress={() => setTranslationOpen((v) => !v)}
            />
            {q.reading && (
              <Text selectable style={s.japanese}>
                {q.reading}
              </Text>
            )}
            {q.japanese && (
              <Text selectable style={s.japanese}>
                {q.japanese}
              </Text>
            )}
            {q.language === "vi" && !translationOpen && (
              <Text style={s.body}>
                この問題の日本語本文は整備中です。翻訳を開くと既存のベトナム語教材を確認できます。
              </Text>
            )}
            {translationOpen && <TranslationText>{q.prompt}</TranslationText>}
            {(q.language === "ja" || translationOpen) &&
              q.options.map((option, i) => (
                <Pressable
                  key={q.id + "-" + i}
                  testID={`kaigo-weekly-option-${i}`}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: st.value.answers[q.id] === i,
                    disabled: st.value.submitted || !st.ready || st.saving,
                  }}
                  disabled={st.value.submitted || !st.ready || st.saving}
                  onPress={() =>
                    void st.update((old) => ({
                      ...old,
                      answers: { ...old.answers, [q.id]: i },
                    }))
                  }
                  style={[s.option, st.value.answers[q.id] === i && s.selected]}
                >
                  <Text style={s.body}>
                    {i + 1}. {option}
                  </Text>
                </Pressable>
              ))}
            {st.value.submitted && (
              <View testID="kaigo-weekly-review">
                <Text style={s.heading}>正答：{q.correctIndex + 1}</Text>
                {translationOpen &&
                  q.rationales.map((r, i) => (
                    <TranslationText key={i}>
                      {i + 1}. {r}
                    </TranslationText>
                  ))}
              </View>
            )}
            {st.error && <Action title="保存を再試行" onPress={st.retry} />}
          </RoyalContentPanel>
        </View>
      </ScrollView>
      <TokuteiActionBar testID="kaigo-weekly-controls">
        <View style={s.controls}>
          <View style={s.control}>
            <Action
              title="前へ"
              disabled={index === 0}
              onPress={() => move(index - 1)}
              testID="kaigo-weekly-question-prev"
            />
          </View>
          <View style={s.control}>
            <Action
              title="次へ"
              disabled={index === questions.length - 1}
              onPress={() => move(index + 1)}
              testID="kaigo-weekly-question-next"
            />
          </View>
        </View>
        {!st.value.submitted ? (
          <Action
            title="提出する"
            disabled={!st.ready || st.saving || !allAnswered}
            testID="kaigo-weekly-submit"
            onPress={() =>
              void st.update((old) => ({ ...old, submitted: true }))
            }
          />
        ) : (
          <View style={s.controls}>
            <View style={s.control}>
              <Action
                title={completed ? "✓ 完了" : "確認テストを完了"}
                disabled={!completeReady || completed}
                testID="kaigo-weekly-complete-assessment"
                onPress={onComplete}
              />
            </View>
            <View style={s.control}>
              <Action
                title="やり直す"
                testID="kaigo-weekly-restart"
                disabled={st.saving}
                onPress={() => {
                  void st.update(() => ({ answers: {}, submitted: false }));
                  move(0);
                }}
              />
            </View>
          </View>
        )}
      </TokuteiActionBar>
    </View>
  );
}
function JapaneseText({
  text,
  tokens,
  testID,
}: {
  text: string;
  tokens?: RubyToken[];
  testID: string;
}) {
  const { colors } = useStudyAppearance();
  return tokens?.length ? (
    <View
      testID={testID}
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-end",
        marginVertical: 8,
      }}
    >
      {tokens.map((token, index) =>
        token.text === "\n" ? (
          <View key={index} style={{ width: "100%" }} />
        ) : (
          <View key={index} style={{ alignItems: "center" }}>
            {!!token.readingKana && (
              <Text
                style={{ fontSize: 11, lineHeight: 17, color: colors.muted }}
              >
                {token.readingKana}
              </Text>
            )}
            <Text
              style={[s.japanese, { color: colors.text, marginVertical: 0 }]}
            >
              {token.text}
            </Text>
          </View>
        ),
      )}
    </View>
  ) : (
    <Text
      selectable
      testID={testID}
      style={[s.japanese, { color: colors.text }]}
    >
      {text}
    </Text>
  );
}
function DayReading({
  entry,
  onMock,
}: {
  entry: CatalogEntry;
  onMock: (id: string) => void;
}) {
  const sections = japaneseSectionsFor(entry),
    form = mockForDay(entry.day),
    cover = illustrationForStudyDay(entry.day),
    [translationOpen, setTranslationOpen] = useState(false),
    { colors } = useStudyAppearance(),
    { language } = useAppLanguage();
  const translated = (text: string, id?: string) =>
    translationOpen ? (
      language === "vi" ? (
        <TranslationText testID={id}>{text}</TranslationText>
      ) : (
        <TranslationText>この言語の翻訳は準備中です。</TranslationText>
      )
    ) : null;
  return (
    <View testID="kaigo-japanese-reader">
      <ReadingAppearanceControl />
      <Action
        title={translationOpen ? "翻訳を閉じる" : "翻訳を見る"}
        testID="kaigo-translation"
        onPress={() => setTranslationOpen((v) => !v)}
      />
      <Text style={[s.heading, { color: colors.text }]}>
        {titleForDay(entry)}
      </Text>
      {translated(entry.titleVi)}
      <Text style={[s.meta, { color: colors.muted }]}>
        第{Math.ceil(entry.day / 7)}週 · 目安30分
      </Text>
      <Image
        testID={`kaigo-day-art-${entry.day}`}
        source={cover.source}
        resizeMode="contain"
        style={{
          width: "100%",
          aspectRatio: cover.aspectRatio,
          maxHeight: 320,
        }}
      />
      {translated(cover.captionVi)}
      {sections.map((section) => (
        <View
          key={section.id}
          testID={`kaigo-reading-section-${section.id}`}
          style={s.readingSection}
        >
          <Text style={[s.heading, { color: colors.text }]}>
            {section.headingJa}
          </Text>
          {section.paragraphsJa.map((paragraph, index) => (
            <JapaneseText
              key={index}
              testID={`kaigo-source-${section.id}-${index}`}
              text={paragraph}
              tokens={
                index === 0 && paragraph === section.japanese
                  ? section.ruby
                  : undefined
              }
            />
          ))}
          {!section.japaneseComplete && (
            <Text
              testID={`kaigo-source-pending-${section.id}`}
              style={[s.meta, { color: colors.muted }]}
            >
              この項目の日本語本文は整備中です。要約を本文の代わりにはしていません。
            </Text>
          )}
          {translated(section.heading)}
          {section.paragraphs.map((paragraph, index) => (
            <View key={index}>
              {translated(
                paragraph,
                `kaigo-translation-${section.id}-${index}`,
              )}
            </View>
          ))}
          {section.figureKeys?.map((figure) => (
            <View key={figure.key}>
              <Image
                source={kaigoDepthFigures[figure.key]}
                resizeMode="contain"
                style={{
                  width: "100%",
                  aspectRatio: 800 / 660,
                  maxHeight: 320,
                }}
              />
              {translated(figure.captionVi)}
            </View>
          ))}
        </View>
      ))}
      {form && (
        <Action
          title="予定の模擬試験を開く"
          testID="kaigo-scheduled-mock"
          onPress={() => onMock(form.id)}
        />
      )}
    </View>
  );
}

export function WeeklyKaigo({
  onBack,
  renderMock,
}: {
  onBack: () => void;
  renderMock: (form: MockForm) => ReactNode;
}) {
  const progress = useSaved(completionKey, emptyCompletion, restoreCompletion),
    [week, setWeek] = useState(1),
    [showWeek, setShowWeek] = useState(false),
    [route, setRoute] = useState<Route>(null),
    [tab, setTab] = useState<"calendar" | "mocks">("calendar"),
    [endReached, setEndReached] = useState(false),
    [frameWidth, setFrameWidth] = useState(350);
  const { colors } = useStudyAppearance(),
    { fontScale } = useWindowDimensions(),
    scroll = useRef<ScrollView>(null),
    geometry = useRef({ height: 0, content: 0, y: 0 }),
    restoredWeek = useRef(false);
  useEffect(() => {
    if (progress.ready && !restoredWeek.current) {
      setWeek(progress.value.lastWeek ?? 1);
      restoredWeek.current = true;
    }
  }, [progress.ready, progress.value.lastWeek]);
  const entry =
      route?.kind === "day"
        ? kaigoCatalog.find((e) => e.day === route.day)
        : undefined,
    form =
      route?.kind === "mock"
        ? kaigoCourse.mocks.find((m) => m.id === route.id)
        : undefined,
    currentWeek = learningWeeks[week - 1];
  const columns = Math.max(
      1,
      Math.min(
        5,
        Math.floor((frameWidth + 10) / Math.max(124, 124 * fontScale)),
      ),
    ),
    cellWidth = (frameWidth - 10 * (columns - 1)) / columns;
  const open = (next: Route) => {
    geometry.current = { height: 0, content: 0, y: 0 };
    setEndReached(false);
    setRoute(next);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  const checkEnd = () => {
    const g = geometry.current;
    if (g.height > 0 && g.content > 0 && g.y + g.height >= g.content - 24)
      setEndReached(true);
  };
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const e = event.nativeEvent;
    geometry.current = {
      height: e.layoutMeasurement.height,
      content: e.contentSize.height,
      y: e.contentOffset.y,
    };
    checkEnd();
  };
  const finishDay = async () => {
    if (!entry) return;
    if (progress.value.days[entry.day]) {
      setWeek(Math.ceil(entry.day / 7));
      setShowWeek(true);
      open(null);
      return;
    }
    const saved = await progress.update((old) => ({
      ...old,
      days: { ...old.days, [entry.day]: true },
    }));
    if (saved) {
      setWeek(Math.ceil(entry.day / 7));
      setShowWeek(true);
      open(null);
    }
  };
  const header = (
    <TokuteiHeader
      title="介護"
      subtitle={
        route?.kind === "day"
          ? `第${week}週 · 第${entry?.day}日`
          : route?.kind === "assessment"
            ? `第${route.week}週 · 確認テスト`
            : form
              ? "模擬試験"
              : "26週間 · 176回 · 1日30分"
      }
      onBack={() => {
        if (route) open(null);
        else if (showWeek) setShowWeek(false);
        else onBack();
      }}
    />
  );
  const insets = useSafeAreaInsets();
  const content = (
    <View style={[s.root, route && { backgroundColor: colors.background }]}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        {header}
        {route?.kind === "assessment" ? (
          <WeeklyAssessment
            key={route.week}
            week={route.week}
            completed={!!progress.value.assessments[route.week]}
            completeReady={progress.ready && !progress.saving}
            onComplete={() => {
              void progress
                .update((old) => ({
                  ...old,
                  assessments: { ...old.assessments, [route.week]: true },
                }))
                .then((saved) => {
                  if (saved) open(null);
                });
            }}
          />
        ) : form ? (
          renderMock(form)
        ) : (
          <ScrollView
            ref={scroll}
            key={
              route ? JSON.stringify(route) : "calendar-" + tab + "-" + showWeek
            }
            testID="kaigo-course-scroll"
            scrollEventThrottle={80}
            onScroll={onScroll}
            onLayout={(e) => {
              geometry.current.height = e.nativeEvent.layout.height;
              checkEnd();
            }}
            onContentSizeChange={(_, height) => {
              geometry.current.content = height;
              checkEnd();
            }}
            contentContainerStyle={s.content}
          >
            <View style={s.article}>
              {!route && (
                <>
                  <View style={s.controls}>
                    <View style={s.control}>
                      <Action
                        title="学習"
                        onPress={() => {
                          setTab("calendar");
                          setShowWeek(false);
                        }}
                        testID="kaigo-weekly-tab-calendar"
                      />
                    </View>
                    <View style={s.control}>
                      <Action
                        title="模擬試験"
                        onPress={() => setTab("mocks")}
                        testID="kaigo-weekly-tab-mocks"
                      />
                    </View>
                  </View>
                  {tab === "calendar" ? (
                    showWeek ? (
                      <View testID={`kaigo-week-schedule-${week}`}>
                        <RoyalExplanationPanel style={s.info}>
                          <Text style={s.light}>
                            第{week}週 ·{" "}
                            {
                              currentWeek.slots.filter(
                                (d) => d.entry && progress.value.days[d.day],
                              ).length
                            }
                            /{currentWeek.slots.filter((d) => d.entry).length}日
                            学習済み
                          </Text>
                        </RoyalExplanationPanel>
                        {currentWeek.slots.map((slot, index) =>
                          slot.entry ? (
                            <TokuteiDayCard
                              key={slot.day}
                              testID={`kaigo-calendar-day-${slot.day}`}
                              day={index + 1}
                              title={titleForDay(slot.entry)}
                              done={!!progress.value.days[slot.day]}
                              onPress={() =>
                                open({ kind: "day", day: slot.day })
                              }
                            />
                          ) : (
                            <View key={slot.day} style={s.emptyDay}>
                              <Text style={s.meta}>
                                第{index + 1}日 · 学習なし
                              </Text>
                            </View>
                          ),
                        )}
                        <RoyalContentPanel style={s.paper}>
                          <Text style={s.heading}>週末の確認テスト</Text>
                          <Text style={s.meta}>
                            {questionsForWeek(week).length}問 · 四択
                          </Text>
                          <Action
                            title={
                              progress.value.assessments[week]
                                ? "✓ 確認テストを見る"
                                : "確認テストを開く"
                            }
                            testID={`kaigo-assessment-open-${week}`}
                            onPress={() => open({ kind: "assessment", week })}
                          />
                        </RoyalContentPanel>
                      </View>
                    ) : (
                      <>
                        <RoyalExplanationPanel style={s.info}>
                          <Text style={s.light}>週を選ぶ</Text>
                          <Text style={s.light}>
                            学習する日を選び、最後まで読んだら「完了」を押してください。
                          </Text>
                        </RoyalExplanationPanel>
                        <View
                          testID="kaigo-week-grid"
                          onLayout={(e) =>
                            setFrameWidth(e.nativeEvent.layout.width)
                          }
                          style={s.weekGrid}
                        >
                          {learningWeeks.map((w) => {
                            const count = w.slots.filter(
                                (d) => d.entry && progress.value.days[d.day],
                              ).length,
                              total = w.slots.filter((d) => d.entry).length;
                            return (
                              <Pressable
                                key={w.week}
                                testID={`kaigo-week-${w.week}`}
                                accessibilityRole="button"
                                accessibilityLabel={`第${w.week}週`}
                                onPress={() => {
                                  setWeek(w.week);
                                  setShowWeek(true);
                                  void progress.update((old) => ({
                                    ...old,
                                    lastWeek: w.week,
                                  }));
                                  scroll.current?.scrollTo({
                                    y: 0,
                                    animated: false,
                                  });
                                }}
                                style={{ width: cellWidth }}
                              >
                                <RoyalContentPanel style={s.weekPaper}>
                                  <Text style={s.weekNumber}>第{w.week}週</Text>
                                  <Text style={s.meta}>
                                    {count}/{total}日 学習済み{" "}
                                    {weekDone(w.week, progress.value)
                                      ? "✓"
                                      : ""}
                                  </Text>
                                </RoyalContentPanel>
                              </Pressable>
                            );
                          })}
                        </View>
                      </>
                    )
                  ) : (
                    <>
                      <RoyalExplanationPanel style={s.info}>
                        <Text style={s.light}>模擬試験 · 12回</Text>
                        <Text style={s.light}>
                          技能：45問・60分 ／ 日本語：15問・30分
                        </Text>
                      </RoyalExplanationPanel>
                      {kaigoCourse.mocks.map((m, index) => (
                        <RoyalContentPanel key={m.id} style={s.paper}>
                          <Text style={s.heading}>
                            {m.id.includes("skills")
                              ? "介護技能"
                              : "介護日本語"}{" "}
                            · 第{(index % 6) + 1}回
                          </Text>
                          <Text style={s.body}>
                            {m.questions.length}問 · {m.durationMs / 60000}分
                          </Text>
                          <Action
                            title="模擬試験を開く"
                            testID={`kaigo-mock-${m.id}`}
                            onPress={() => open({ kind: "mock", id: m.id })}
                          />
                        </RoyalContentPanel>
                      ))}
                    </>
                  )}
                </>
              )}
              {entry && (
                <>
                  <DayReading
                    key={entry.day}
                    entry={entry}
                    onMock={(id) => open({ kind: "mock", id })}
                  />
                  <View testID="kaigo-day-completion-footer">
                    <Text style={[s.meta, { color: colors.muted }]}>
                      {progress.value.days[entry.day]
                        ? "✓ 学習済み"
                        : endReached
                          ? "最後まで読みました。「完了」を押すと週の予定に戻ります。"
                          : "最後まで読んでから完了してください。"}
                    </Text>
                    <Action
                      title={
                        progress.value.days[entry.day]
                          ? "✓ 学習済み · 戻る"
                          : progress.saving
                            ? "保存中…"
                            : "完了"
                      }
                      disabled={
                        !progress.ready ||
                        progress.saving ||
                        (!endReached && !progress.value.days[entry.day])
                      }
                      testID="kaigo-complete-day"
                      onPress={() => void finishDay()}
                    />
                    <Action
                      title="週の予定に戻る"
                      testID="kaigo-reading-back"
                      onPress={() => open(null)}
                    />
                  </View>
                </>
              )}
              {progress.error && (
                <RoyalExplanationPanel style={s.info}>
                  <Text style={s.light}>
                    進捗を保存できませんでした。保存に成功してから前の画面へ戻ります。
                  </Text>
                  <Action
                    title="再試行"
                    onPress={entry ? () => void finishDay() : progress.retry}
                  />
                </RoyalExplanationPanel>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
  return route ? content : <RoyalPageBackground>{content}</RoyalPageBackground>;
}
const s = StyleSheet.create({
  root: { flex: 1, minHeight: 0 },
  content: { padding: 12, paddingBottom: 28, alignItems: "center" },
  article: { width: "100%", maxWidth: 900 },
  paper: { paddingHorizontal: 24, paddingVertical: 22, marginBottom: 14 },
  info: { paddingHorizontal: 24, paddingVertical: 22, marginBottom: 14 },
  light: {
    fontFamily: ROYAL_FONT.body,
    fontSize: 16,
    lineHeight: 26,
    color: "#fff3cf",
  },
  body: {
    fontFamily: ROYAL_FONT.body,
    fontSize: 17,
    lineHeight: 28,
    color: "#26364c",
  },
  meta: { fontSize: 14, lineHeight: 23, color: "#536575", marginVertical: 6 },
  heading: {
    fontFamily: ROYAL_FONT.heading,
    fontSize: 21,
    lineHeight: 31,
    color: "#173a60",
    marginVertical: 8,
  },
  japanese: {
    fontFamily: ROYAL_FONT.body,
    fontSize: 18,
    lineHeight: 30,
    color: "#253749",
    marginVertical: 8,
  },
  action: {
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#c99c51",
    backgroundColor: "#1b3153",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginVertical: 4,
    justifyContent: "center",
  },
  actionText: {
    color: "#fff3cf",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  disabled: { opacity: 0.45 },
  option: {
    padding: 14,
    minHeight: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#b9bec6",
    backgroundColor: "#fffdf6",
    marginVertical: 6,
  },
  selected: {
    borderColor: "#244e7b",
    borderWidth: 2,
    backgroundColor: "#e6eff8",
  },
  controls: { flexDirection: "row", gap: 8 },
  control: { flex: 1, minWidth: 0 },
  readingSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#998363",
  },
  weekGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  weekPaper: { minHeight: 120, paddingHorizontal: 18, paddingVertical: 22 },
  weekNumber: {
    fontSize: 22,
    lineHeight: 32,
    color: "#173a60",
    fontWeight: "700",
  },
  emptyDay: { padding: 18, opacity: 0.7 },
});
