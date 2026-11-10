import { useBackdropOcclusion } from '@/components/ui/AppBackdrop';
import { type PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  useWindowDimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RoyalPageBackground from "@/components/ui/RoyalPageBackground";
import { KensetsuReviewTests } from "./KensetsuReviewTests";
import { STUDY_IVORY } from "@/theme/study-surface";
import {
  StudyAppearanceProvider,
  useStudyAppearance,
  ReadingAppearanceControl,
  TranslationText,
} from "@/components/tokutei/StudyAppearance";
import {
  TokuteiHeader,
  TokuteiDayCard,
} from "@/components/tokutei/TokuteiChrome";
import {
  RoyalContentPanel,
  RoyalExplanationPanel,
} from "@/components/ui/RoyalPanels";
import { ROYAL_FONT } from "@/components/ui/RoyalSurface";
import {
  completionId,
  completionKey,
  fields,
  illustrations,
  illustrationAspectRatios,
  restoreProgress,
  type Field,
  type Level,
  type Session,
} from "@/data/kensetsu";
import { subjectLabels, weeksForScope, sessionsForScope, sessionForScope, studyDayForScope, studyDayIdForSession, studyDayCompletionIds, type Subject } from "@/data/kensetsu/scope";
const CALENDAR_LEAF = require("../../../assets/kensetsu/ui/calendar-leaf-v1.webp");
// The backdrop owns safe-area edges; only the lesson reader uses solid ivory.
function CourseSurface({
  children,
  reading = false,
}: PropsWithChildren<{ reading?: boolean }>) {
  useBackdropOcclusion(reading);
  const insets = useSafeAreaInsets(),
    { colors } = useStudyAppearance();
  const content = (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      {children}
    </View>
  );
  return reading ? (
    <View
      testID="kensetsu-ivory-surface"
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {content}
    </View>
  ) : (
    <RoyalPageBackground>{content}</RoyalPageBackground>
  );
}
function CalendarBinding() {
  const [width, setWidth] = useState(64);
  return (
    <View
      pointerEvents="none"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{
        width: "100%",
        alignSelf: "stretch",
        height: (width * 0.19) / 0.75,
        overflow: "hidden",
      }}
    >
      <Image
        source={CALENDAR_LEAF}
        resizeMode="contain"
        style={{ width, height: width / 0.75 }}
      />
    </View>
  );
}
function Action({
  title,
  onPress,
  disabled = false,
  selected = false,
  testID,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={[s.button, selected && s.selected, disabled && { opacity: 0.45 }]}
    >
      <Text style={s.buttonText}>{title}</Text>
    </Pressable>
  );
}
function StudyImage({ path, caption }: { path: string; caption: string }) {
  const { width, height } = useWindowDimensions(),
    [open, setOpen] = useState(false),
    [magnified, setMagnified] = useState(false),
    [containerWidth, setContainerWidth] = useState(0);
  const source = illustrations[path];
  const insets = useSafeAreaInsets(),
    { colors } = useStudyAppearance();
  const captionStyle = [s.caption, { color: colors.muted }];
  const ratio = illustrationAspectRatios[path];
  const availableWidth = Math.min(
    containerWidth || Math.max(0, width - 32),
    760,
  );
  const imageWidth = Math.min(
    availableWidth,
    620,
    (width > height ? Math.max(80, Math.min(260, height * 0.4)) : 420) * ratio,
  );
  const enlargedWidth = Math.min(
    Math.max(0, width - insets.left - insets.right - 32),
    900,
    Math.max(80, (height - insets.top - insets.bottom - 100) * 0.8) * ratio,
  );
  if (!source) return null;
  if (!ratio || !Number.isFinite(ratio) || ratio <= 0)
    return <Text style={captionStyle}>画像の寸法を確認できませんでした。</Text>;
  return (
    <View
      style={s.figure}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      <Pressable
        testID="kensetsu-study-image"
        accessibilityRole="button"
        accessibilityLabel="画像を拡大"
        onPress={() => { setMagnified(false); setOpen(true); }}
        style={{ width: imageWidth, maxWidth: "100%" }}
      >
        <Image
          source={source}
          accessibilityLabel={caption}
          resizeMode="contain"
          fadeDuration={0}
          style={{ width: imageWidth, height: imageWidth / ratio }}
        />
      </Pressable>
      <Text style={captionStyle}>{caption}</Text>
      <Text style={captionStyle}>タップして拡大</Text>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View
          style={[
            s.imageModal,
            {
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 12,
              paddingLeft: insets.left + 16,
              paddingRight: insets.right + 16,
            },
          ]}
        >
          <Action
            testID="kensetsu-image-close"
            title="閉じる"
            onPress={() => setOpen(false)}
          />
          <ScrollView
            testID="kensetsu-image-viewer"
            contentContainerStyle={s.imageViewer}
          >
            <Action
              testID="kensetsu-image-magnify"
              title={magnified ? "全体を見る" : "さらに拡大 · 横に動かして読む"}
              onPress={() => setMagnified(value => !value)}
            />
            <ScrollView
              horizontal
              testID="kensetsu-image-pan"
              style={{ width: Math.max(0, width - insets.left - insets.right - 32) }}
              contentContainerStyle={{ minWidth: Math.max(0, width - insets.left - insets.right - 32), justifyContent: "center" }}
            >
              <Image
                source={source}
                accessibilityLabel={caption}
                resizeMode="contain"
                style={{ width: magnified ? Math.max(900, enlargedWidth * 2) : enlargedWidth,
                  height: (magnified ? Math.max(900, enlargedWidth * 2) : enlargedWidth) / ratio }}
              />
            </ScrollView>
            <Text style={s.light}>{caption}</Text>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
export function KensetsuDayReader({
  session,
  done,
  ready,
  saving,
  onComplete,
  language,
}: {
  session: Session;
  done: boolean;
  ready: boolean;
  saving: boolean;
  onComplete: () => void;
  language: string;
}) {
  const { colors } = useStudyAppearance();
  const r = {
    ...s,
    body: [s.body, { color: colors.text }],
    caption: [s.caption, { color: colors.muted }],
    heading: [s.heading, { color: colors.text }],
    articleTitle: [s.articleTitle, { color: colors.text }],
    readingText: [s.readingText, { color: colors.text }],
    reflectionText: [s.reflectionText, { color: colors.text }],
    readingSurface: [s.readingSurface, { backgroundColor: colors.background }],
    translationNotice: [
      s.translationNotice,
      { backgroundColor: colors.translation },
    ],
  };
  const [reachedEnd, setReachedEnd] = useState(false),
    [translationOpen, setTranslationOpen] = useState(false);
  const geometry = useRef({ height: 0, content: 0, y: 0 });
  const check = () => {
    const g = geometry.current;
    if (g.height > 0 && g.content > 0 && g.y + g.height >= g.content - 16)
      setReachedEnd(true);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const n = e.nativeEvent;
    geometry.current = {
      height: n.layoutMeasurement.height,
      content: n.contentSize.height,
      y: n.contentOffset.y,
    };
    check();
  };
  const pictures = session.illustrations ?? [];
  const sharedActivity =
    new Set(session.clusters.map((c) => c.learningActivity?.ja).filter(Boolean))
      .size <= 1;
  const activityCluster = session.clusters.find((c) => c.learningActivity?.ja);
  const translated = (id: string, text?: string) =>
    translationOpen && language !== "ja" && text ? (
      <TranslationText testID={`kensetsu-localized-${id}`}>
        {text}
      </TranslationText>
    ) : null;
  const repeatedActivity = (c: Session["clusters"][number]) =>
    c.learningActivity?.ja === c.applicationPromptJa &&
    c.learningActivity?.translations?.[language] ===
      c.applicationPromptTranslations?.[language];
  const exerciseText = (
    id: string,
    ja: string,
    text?: string,
    alias?: string,
  ) => (
    <View key={id}>
      <View testID={alias ? `kensetsu-source-${alias}` : undefined}>
        <Text
          selectable
          testID={`kensetsu-source-${id}`}
          style={r.reflectionText}
        >
          {ja}
        </Text>
      </View>
      {translationOpen && language !== "ja" && (
        <View testID={alias ? `kensetsu-localized-${alias}` : undefined}>
          <TranslationText testID={`kensetsu-localized-${id}`}>
            {text || "この段落の翻訳は準備中です。"}
          </TranslationText>
        </View>
      )}
    </View>
  );
  const art = (items: typeof pictures) =>
    items.map((a) => (
      <View key={a.path}>
        <StudyImage path={a.path} caption={a.altJa} />
        {translated(
          session.id + ":illustration:" + pictures.indexOf(a) + ":alt",
          a.altTranslations?.[language],
        )}
      </View>
    ));
  return (
    <ScrollView
      testID="kensetsu-reader"
      style={r.readingSurface}
      scrollEventThrottle={80}
      onScroll={onScroll}
      onLayout={(e) => {
        geometry.current.height = e.nativeEvent.layout.height;
        check();
      }}
      onContentSizeChange={(_, height) => {
        geometry.current.content = height;
        check();
      }}
      contentContainerStyle={r.readingContent}
    >
      <View style={r.article}>
        <ReadingAppearanceControl />
        <Action
          testID="kensetsu-translation"
          title={translationOpen ? "翻訳を閉じる" : "翻訳を見る"}
          onPress={() => setTranslationOpen((v) => !v)}
        />
        {translationOpen && (
          <View
            testID="kensetsu-translation-status"
            style={r.translationNotice}
          >
            <Text style={r.body}>
              {language === "ja"
                ? "翻訳を読むには、アプリの言語設定で母語を選んでください。"
                : "選択した言語の翻訳を、本文の下に表示します。未翻訳の段落は準備中と表示されます。"}
            </Text>
          </View>
        )}
        <Text style={r.articleTitle}>{session.titleJa}</Text>
        {translated(
          session.id + ":title",
          session.titleTranslations?.[language],
        )}
        <Text style={r.caption}>この回のテーマ</Text>
        <Text style={r.body}>
          {session.clusters.map((c) => c.titleJa).join(" ・ ")}
        </Text>
        {session.clusters.map((c, i) => (
          <View
            key={c.id}
            testID={`kensetsu-section-${c.id}`}
            style={r.readingSection}
          >
            <Text style={r.heading}>
              {i + 1}. {c.titleJa}
            </Text>
            {translated(c.id + ":title", c.titleTranslations?.[language])}
            {c.paragraphs.map((p) => (
              <View key={p.id}>
                <Text selectable style={r.readingText}>
                  {p.ja}
                </Text>
                {translationOpen && language !== "ja" && (
                  <TranslationText testID={`kensetsu-translation-${p.id}`}>
                    {p.translations?.[language] ||
                      "この段落の翻訳は準備中です。"}
                  </TranslationText>
                )}
              </View>
            ))}
            {c.terms?.map((t) => (
              <View key={t.ja}>
                <Text style={r.body}>
                  {t.ja}（{t.reading}）
                </Text>
                {translated(c.id + ":term:" + t.ja, t.translations?.[language])}
              </View>
            ))}
            {art(pictures.filter((a) => a.clusterId === c.id))}
            {c.illustration && (
              <>
                <StudyImage
                  path={c.illustration.assetPath}
                  caption={c.illustration.captionJa}
                />
                {translated(
                  c.id + ":caption",
                  c.illustration.captionTranslations?.[language],
                )}
              </>
            )}
            {i === 0 && art(pictures.filter((a) => !a.clusterId))}
          </View>
        ))}
        {!!session.keyTerms?.length && (
          <View style={r.readingSection}>
            <Text style={r.heading}>ことばを整理する</Text>
            {session.keyTerms.map((t) => (
              <View key={t.term}>
                <Text style={r.body}>
                  {t.term}（{t.reading}）
                </Text>
                {translated(
                  session.id + ":keyTerm:" + t.term,
                  t.translations?.[language],
                )}
              </View>
            ))}
          </View>
        )}
        <View testID="kensetsu-reflections" style={r.readingSection}>
          <Text style={r.heading}>振り返り</Text>
          <Text style={r.caption}>
            採点はありません。本文をもとに自分の言葉で説明してください。
          </Text>
          {sharedActivity &&
            activityCluster?.learningActivity &&
            exerciseText(
              session.id + ":learningActivity",
              activityCluster.learningActivity.ja,
              activityCluster.learningActivity.translations?.[language],
            )}
          {session.clusters
            .filter(
              (c) =>
                c.applicationPromptJa ||
                c.reflectionJa ||
                (!sharedActivity && c.learningActivity?.ja),
            )
            .map((c) => (
              <View key={c.id}>
                <Text style={r.body}>{c.titleJa}</Text>
                {!sharedActivity &&
                  c.learningActivity &&
                  !repeatedActivity(c) &&
                  exerciseText(
                    c.id + ":activity",
                    c.learningActivity.ja,
                    c.learningActivity.translations?.[language],
                  )}
                {c.applicationPromptJa &&
                  exerciseText(
                    c.id + ":prompt",
                    c.applicationPromptJa,
                    c.applicationPromptTranslations?.[language],
                    !sharedActivity && repeatedActivity(c)
                      ? c.id + ":activity"
                      : undefined,
                  )}
                {c.reflectionJa &&
                  exerciseText(
                    c.id + ":reflection",
                    c.reflectionJa,
                    c.reflectionTranslations?.[language],
                  )}
              </View>
            ))}
        </View>
        <Action
          testID="kensetsu-complete"
          title={done ? "✓ 学習済み · 戻る" : saving ? "保存中…" : "完了"}
          disabled={!ready || saving || (!reachedEnd && !done)}
          onPress={onComplete}
        />
        {!done && !reachedEnd && (
          <Text style={r.caption}>
            最後まで読んでから「完了」を押してください。
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
function Calendar({
  level,
  field,
  learner,
  onBack,
  language,
  subject,
}: {
  level: Level;
  field: Field;
  learner: string;
  onBack: () => void;
  language: string;
  subject: Subject;
}) {
  const weeks = useMemo(() => weeksForScope(level, field, subject), [level, field, subject]);
  const scopedSessionById = useMemo(() => new Map(sessionsForScope(level, field, subject).map(session => studyDayForScope(session.id, level, field, subject)!).map(session => [session.id, session])), [level, field, subject]);
  const dayDone = (session: Session) => studyDayCompletionIds(session.id, level, field, subject).every(id => !!progress[id]);
  const allowedSessionIds = useMemo(() => new Set(weeks.flatMap(w => w.sessionIds)), [weeks]);
  const key = completionKey(learner, level, field),
    navigationKey = key + `:navigation:${subject}:v2`;
  const { width, fontScale } = useWindowDimensions();
  const calendar = useRef<ScrollView>(null),
    calendarOffset = useRef(0);
  const navigationWrites = useRef(Promise.resolve());
  const [progress, setProgress] = useState<Record<string, true>>({}),
    [ready, setReady] = useState(false),
    [error, setError] = useState(false),
    [saving, setSaving] = useState(false),
    [week, setWeek] = useState(0),
    [lesson, setLesson] = useState<Session | null>(null),
    [lastId, setLastId] = useState<string | null>(null),
    [navigationReady, setNavigationReady] = useState(false),
    [navigationError, setNavigationError] = useState(false),
    [gridWidth, setGridWidth] = useState(0),
    [showWeek, setShowWeek] = useState(false);
  useEffect(() => {
    let live = true;
    void AsyncStorage.getItem(key)
      .then((raw) => {
        if (live) {
          setProgress(restoreProgress(raw));
          setReady(true);
          setError(false);
        }
      })
      .catch(() => {
        if (live) setError(true);
      });
    void AsyncStorage.getItem(navigationKey)
      .then((raw) => {
        if (!live) return;
        try {
          const n = JSON.parse(raw || "{}");
          setShowWeek(n.view === "days");
          if (Number.isInteger(n.week) && n.week >= 0 && n.week < weeks.length)
            setWeek(n.week);
          if (typeof n.lastId === "string" && allowedSessionIds.has(studyDayIdForSession(n.lastId, level, field, subject))) {
            const resumedId = studyDayIdForSession(n.lastId, level, field, subject);
            setLastId(resumedId);
            // Reuse can reorder/filter week lists; restore by the stable lesson ID.
            const restoredWeek = weeks.findIndex(w => w.sessionIds.includes(resumedId));
            if (restoredWeek >= 0) setWeek(restoredWeek);
          }
          if (Number.isFinite(n.offset) && n.offset >= 0)
            calendarOffset.current = n.offset;
        } catch {
          /* Invalid navigation never changes completed lessons. */
        }
        setNavigationReady(true);
      })
      .catch(() => {
        if (live) {
          setNavigationError(true);
          setNavigationReady(true);
        }
      });
    return () => {
      live = false;
    };
  }, [key, navigationKey, weeks, allowedSessionIds]);
  const persistNavigation = (
    selectedWeek: number,
    recentId: string | null,
    offset: number,
    days = showWeek,
  ) => {
    if (!navigationReady) return;
    navigationWrites.current = navigationWrites.current
      .then(() =>
        AsyncStorage.setItem(
          navigationKey,
          JSON.stringify({
            week: selectedWeek,
            lastId: recentId,
            offset,
            view: days ? "days" : "weeks",
          }),
        ),
      )
      .then(() => setNavigationError(false))
      .catch(() => setNavigationError(true));
  };
  useEffect(() => {
    if (!navigationReady || lesson || showWeek) return;
    const frame = requestAnimationFrame(() =>
      calendar.current?.scrollTo({
        y: calendarOffset.current,
        animated: false,
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [navigationReady, lesson, showWeek]);
  const changeWeek = (next: number) => {
    setWeek(next);
    persistNavigation(next, lastId, calendarOffset.current);
  };
  const openLesson = (d: Session) => {
    if (!allowedSessionIds.has(d.id)) return;
    const next = weeks.findIndex((w) => w.sessionIds.includes(d.id));
    setWeek(next);
    setLastId(d.id);
    setShowWeek(true);
    persistNavigation(next, d.id, calendarOffset.current, true);
    setLesson(d);
  };
  const closeLesson = () => {
    persistNavigation(week, lastId, calendarOffset.current);
    setLesson(null);
  };
  const group = Math.floor(week / 10),
    groups = Math.ceil(weeks.length / 10),
    visibleWeeks = weeks.slice(group * 10, group * 10 + 10);
  const columns = Math.max(
    1,
    Math.min(
      5,
      Math.floor(
        ((gridWidth || Math.min(width - 36, 900)) + 10) /
          Math.max(124, 124 * (fontScale || 1)),
      ),
    ),
  );
  const tileWidth = gridWidth
    ? Math.max(0, (gridWidth - 10 * (columns - 1)) / columns)
    : "100%";
  const load = () => {
    void AsyncStorage.getItem(key)
      .then((raw) => {
        setProgress(restoreProgress(raw));
        setReady(true);
        setError(false);
      })
      .catch(() => setError(true));
  };
  const complete = async () => {
    if (!lesson || !ready || saving) return;
    if (dayDone(lesson)) {
      closeLesson();
      return;
    }
    const next = { ...progress };
    for (const id of studyDayCompletionIds(lesson.id, level, field, subject)) next[id] = true;
    setSaving(true);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next));
      setProgress(next);
      setError(false);
      closeLesson();
    } catch {
      setError(true);
    } finally {
      setSaving(false);
    }
  };
  return (
    <CourseSurface reading={!!lesson}>
      <View style={s.root}>
        <TokuteiHeader
          title={`建設 · ${level}号`}
          subtitle={`${fields.find((f) => f.id === field)?.title} · ${subjectLabels[subject]}`}
          onBack={() => {
            if (lesson) closeLesson();
            else if (showWeek) {
              setShowWeek(false);
              persistNavigation(week, lastId, calendarOffset.current, false);
            } else onBack();
          }}
        />
        {error && (
          <View style={s.error}>
            <Text style={s.body}>進捗を保存・読み込みできませんでした。</Text>
            <Action
              title="再試行"
              onPress={() => {
                if (ready && lesson) void complete();
                else load();
              }}
            />
          </View>
        )}
        {navigationError && (
          <Text style={s.body}>
            表示位置を保存できませんでした。学習の完了記録は別に保存されます。
          </Text>
        )}
        {lesson ? (
          <KensetsuDayReader
            key={lesson.id}
            session={lesson}
            done={dayDone(lesson)}
            ready={ready}
            saving={saving}
            onComplete={() => void complete()}
            language={language}
          />
        ) : showWeek ? (
          <ScrollView
            key={`week-page-${week}`}
            testID="kensetsu-week-page"
            style={s.calendarSurface}
            contentContainerStyle={s.calendarContent}
          >
            <View style={s.calendarArticle}>
              <RoyalExplanationPanel style={s.info}>
                <Text style={s.light}>
                  第{week + 1}週 ·{" "}
                  {
                    weeks[week].sessionIds.filter((id) => {
                      const d = scopedSessionById.get(id);
                      return d && dayDone(d);
                    }).length
                  }
                  /{weeks[week].sessionIds.length}日 学習済み
                </Text>
                <Text style={s.light}>{weeks[week].titleJa}</Text>
              </RoyalExplanationPanel>
              <View testID="kensetsu-day-calendar">
                {weeks[week].sessionIds.map((id, i) => {
                  const d = scopedSessionById.get(id);
                  return d ? (
                    <TokuteiDayCard
                      key={id}
                      testID={`kensetsu-day-${Number(d.id.split("-").pop())}`}
                      day={i + 1}
                      title={d.titleJa}
                      done={dayDone(d)}
                      disabled={!navigationReady}
                      onPress={() => openLesson(d)}
                    />
                  ) : null;
                })}
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            key="week-selector"
            ref={calendar}
            style={s.calendarSurface}
            contentContainerStyle={s.calendarContent}
            testID="kensetsu-calendar"
            scrollEventThrottle={180}
            onScroll={(e) => {
              calendarOffset.current = e.nativeEvent.contentOffset.y;
              persistNavigation(week, lastId, calendarOffset.current);
            }}
            onScrollEndDrag={() =>
              persistNavigation(week, lastId, calendarOffset.current)
            }
            onMomentumScrollEnd={() =>
              persistNavigation(week, lastId, calendarOffset.current)
            }
            onContentSizeChange={() => {
              if (navigationReady)
                calendar.current?.scrollTo({
                  y: calendarOffset.current,
                  animated: false,
                });
            }}
          >
            <View style={s.calendarArticle}>
              <RoyalExplanationPanel style={s.info}>
                <Text
                  style={s.light}
                >{`テスト版 · ${weeks.length}週間 · 学習する週を選んでください。`}</Text>
              </RoyalExplanationPanel>

              <RoyalExplanationPanel style={s.info}>
                <Text style={s.light}>週を選ぶ</Text>
              </RoyalExplanationPanel>
              <View style={s.row}>
                {Array.from({ length: groups }, (_, i) => (
                  <Pressable
                    key={i}
                    testID={`kensetsu-group-${i + 1}`}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: group === i,
                      disabled: !navigationReady,
                    }}
                    disabled={!navigationReady}
                    onPress={() => {
                      calendarOffset.current = 0;
                      calendar.current?.scrollTo({ y: 0, animated: false });
                      changeWeek(i * 10);
                    }}
                    style={[s.group, group === i && s.groupSelected]}
                  >
                    <Text
                      style={[s.groupText, group === i && s.groupTextSelected]}
                    >
                      {i * 10 + 1}–{Math.min((i + 1) * 10, weeks.length)}週
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View
                style={s.row}
                onLayout={(e) => setGridWidth(e.nativeEvent.layout.width)}
              >
                {visibleWeeks.map((w, i) => {
                  const index = group * 10 + i,
                    count = w.sessionIds.filter((id) => {
                      const d = scopedSessionById.get(id);
                      return d && dayDone(d);
                    }).length;
                  return (
                    <Pressable
                      key={w.id}
                      testID={`kensetsu-week-${index + 1}`}
                      accessibilityRole="button"
                      accessibilityLabel={`第${index + 1}週 · ${w.titleJa} · ${count}/${w.sessionIds.length}`}
                      accessibilityState={{
                        selected: week === index,
                        disabled: !navigationReady,
                      }}
                      disabled={!navigationReady}
                      onPress={() => {
                        setWeek(index);
                        setShowWeek(true);
                        persistNavigation(
                          index,
                          lastId,
                          calendarOffset.current,
                          true,
                        );
                      }}
                      style={[
                        s.weekTile,
                        { width: tileWidth },
                        week === index && s.weekSelected,
                      ]}
                    >
                      <CalendarBinding />
                      <Text style={[s.weekNumber, s.leafCopy]}>
                        第{index + 1}週{week === index ? " · 選択中" : ""}
                      </Text>
                      <Text numberOfLines={4} style={[s.weekTopic, s.leafCopy]}>
                        {w.titleJa}
                      </Text>
                      <Text
                        style={[
                          s.weekStatus,
                          s.leafCopy,
                          count === w.sessionIds.length && s.completeStatus,
                        ]}
                      >
                        {count}/{w.sessionIds.length} 学習済み
                        {count === w.sessionIds.length ? " ✓" : ""}
                      </Text>
                      <View style={s.weekProgress}>
                        <View
                          style={[
                            s.weekProgressFill,
                            {
                              width: `${(count / w.sessionIds.length) * 100}%`,
                            },
                          ]}
                        />
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </CourseSurface>
  );
}
function CourseMode({ learner, level, field, language, onBack }: {
  learner: string; level: Level; field: Field; language: string; onBack: () => void;
}) {
  const [mode, setMode] = useState<{ subject: Subject; view: "study" | "test" } | null>(null);
  if (mode?.view === "study") return (
    <Calendar key={`${learner}:${level}:${field}:${mode.subject}`} learner={learner} level={level}
      field={field} language={language} subject={mode.subject} onBack={() => setMode(null)} />
  );
  if (mode?.view === "test") return (
    <KensetsuReviewTests key={`${learner}:${level}:${field}:${mode.subject}:tests`} learner={learner}
      level={level} field={field} subject={mode.subject} getSourceLesson={id => sessionForScope(id, level, field, mode.subject) ?? sessionForScope(id, level, field, "theory")}
      onBack={() => setMode(null)} />
  );
  return (
    <CourseSurface><View style={s.root}>
      <TokuteiHeader title={`建設 · ${level}号`} subtitle={fields.find(f => f.id === field)?.title} onBack={onBack} />
      <ScrollView testID="kensetsu-mode-selector" contentContainerStyle={s.content}>
        {(level === "2" ? ["theory", "practical", "foreman"] as const : ["theory", "practical"] as const).map(subject => {
          const available = weeksForScope(level, field, subject).length > 0;
          return <RoyalContentPanel key={subject} style={s.paper}>
            <Text style={s.heading}>{subjectLabels[subject]}</Text>
            <Text style={s.body}>{subject === "foreman" ? "職長の役割、現場管理、安全衛生、図面、建設業を学びます。三分野で同じ教材を使用します。" : subject === "theory" ? "三分野に共通する学科を学習します。1号・2号で同じ教材を使用します。" :
              available ? `${fields.find(f => f.id === field)?.title}の実技を学習します。` : "この分野の実技教材は準備中です。"}</Text>
            <Action title={`${subjectLabels[subject]} 学習カレンダー`} testID={`kensetsu-mode-${subject}-study`}
              disabled={!available} onPress={() => setMode({ subject, view: "study" })} />
            {subject !== "foreman" && <Action title={`${subjectLabels[subject]} 確認テスト`} testID={`kensetsu-mode-${subject}-tests`}
              disabled={!available} onPress={() => setMode({ subject, view: "test" })} />}
          </RoyalContentPanel>;
        })}
      </ScrollView>
    </View></CourseSurface>
  );
}
function KensetsuFlow({
  learner,
  onBack,
  language = "ja",
}: {
  learner: string;
  onBack: () => void;
  language?: string;
}) {
  const [level, setLevel] = useState<Level>("1"),
    [field, setField] = useState<Field | null>(null);
  if (field)
    return (
      <CourseMode
        key={`${learner}:${level}:${field}`}
        learner={learner}
        level={level}
        field={field}
        language={language}
        onBack={() => setField(null)}
      />
    );
  return (
    <CourseSurface>
      <View style={s.root}>
        <TokuteiHeader title="建設" onBack={onBack} />
        <ScrollView contentContainerStyle={s.content}>
          <RoyalExplanationPanel style={s.info}>
            <Text style={s.light}>
              学科は三分野共通です。実技は分野ごとに学習します。1号・2号で学科と実技の教材を共有し、学習記録は別々に保存します。2号の職長教材は三分野共通です。
            </Text>
          </RoyalExplanationPanel>
          <View style={s.row}>
            {(["1", "2"] as const).map((l) => (
              <Action
                key={l}
                title={`特定技能${l}号`}
                selected={level === l}
                testID={`kensetsu-level-${l}`}
                onPress={() => setLevel(l)}
              />
            ))}
          </View>
          {fields.map((f) => (
            <RoyalContentPanel key={f.id} style={s.paper}>
              <Text style={s.heading}>{f.title}</Text>
              <Action
                title="学習・確認テスト"
                testID={`kensetsu-field-${f.id}`}
                onPress={() => setField(f.id)}
              />
            </RoyalContentPanel>
          ))}
        </ScrollView>
      </View>
    </CourseSurface>
  );
}
const s=StyleSheet.create({leafCopy:{marginHorizontal:10},dayStatus:{fontSize:11,lineHeight:18,color:'#64717d',marginHorizontal:4},completeStatus:{color:'#238445',fontWeight:'700'},weekProgress:{height:4,backgroundColor:'#e3e4d9',borderRadius:2,marginHorizontal:10,marginTop:10,overflow:'hidden'},weekProgressFill:{height:'100%',backgroundColor:'#238445'},headerSubtitle:{fontSize:15,lineHeight:24,color:'#536575'},translationNotice:{padding:12,backgroundColor:'#eaf0f5',borderRadius:10,marginBottom:12},translationText:{fontSize:16,lineHeight:26,color:'#345977',padding:12,backgroundColor:'#edf3f7',borderRadius:8,marginBottom:10},dayCalendar:{flexDirection:'row',flexWrap:'wrap',gap:8,marginVertical:12},calendarDay:{minWidth:48,paddingBottom:8,alignItems:'center',borderRadius:10,borderWidth:1,borderColor:'#d6c39d',backgroundColor:'#fffdf6',overflow:'hidden'},calendarDayDone:{backgroundColor:'#edf7ee',borderColor:'#80b28c'},dayMark:{fontSize:24,lineHeight:32,color:'#8795a2'},doneMark:{color:'#238445',fontWeight:'700'},calendarSurface:{backgroundColor:'transparent'},calendarContent:{padding:18,paddingBottom:40,alignItems:'center'},calendarArticle:{width:'100%',maxWidth:900},group:{paddingHorizontal:8,paddingVertical:10,minHeight:48,minWidth:80,flexBasis:80,flexGrow:1,maxWidth:160,borderRadius:10,backgroundColor:'#e9edf0',borderWidth:1,borderColor:'#ccd5dc'},groupSelected:{backgroundColor:'#1b3153',borderColor:'#1b3153'},groupText:{fontSize:14,lineHeight:22,color:'#26364c'},groupTextSelected:{color:'#fff3cf'},weekTile:{paddingBottom:10,minHeight:168,borderRadius:12,borderWidth:1,borderColor:'#d6c39d',backgroundColor:'#fffdf6',flexShrink:0,overflow:'hidden'},weekSelected:{backgroundColor:'#e8f0f7',borderColor:'#355d87',borderWidth:1},weekNumber:{fontSize:16,lineHeight:24,fontWeight:'700',color:'#173a60'},weekTopic:{fontSize:14,lineHeight:22,color:'#26364c',marginVertical:6},weekStatus:{fontSize:13,lineHeight:21,color:'#4a6174'},schedule:{marginTop:8,paddingHorizontal:16,paddingVertical:12,borderRadius:14,backgroundColor:'#fff'},dayLink:{fontSize:15,lineHeight:24,color:'#245a89',marginTop:6},imageViewer:{alignItems:'center',paddingBottom:32,gap:16},readingSurface:{backgroundColor:STUDY_IVORY},readingContent:{paddingHorizontal:16,paddingTop:22,paddingBottom:40,alignItems:'center'},article:{width:'100%',maxWidth:760},articleTitle:{fontFamily:ROYAL_FONT.heading,fontSize:24,lineHeight:35,color:'#172b3e',marginBottom:14},readingSection:{paddingTop:22,marginTop:10},readingText:{fontFamily:ROYAL_FONT.body,fontSize:18,lineHeight:29,color:'#253749',marginVertical:8},caption:{fontFamily:ROYAL_FONT.body,fontSize:13,lineHeight:21,color:'#64717d',marginVertical:4},figure:{width:'100%',alignItems:'center',marginVertical:18},imageModal:{flex:1,backgroundColor:'#08101a',padding:24,paddingTop:48,paddingBottom:48},reflectionText:{fontFamily:ROYAL_FONT.body,fontSize:16,lineHeight:27,color:'#26364c',marginVertical:9},root:{flex:1},header:{flexDirection:'row',alignItems:'center',gap:14,paddingHorizontal:18,paddingVertical:12},title:{fontFamily:ROYAL_FONT.heading,fontSize:25,color:'#173a60'},content:{padding:18,paddingBottom:40},paper:{paddingHorizontal:26,paddingVertical:24,marginBottom:16},info:{paddingHorizontal:26,paddingVertical:24,marginBottom:16},heading:{fontFamily:ROYAL_FONT.heading,fontSize:20,lineHeight:30,color:'#142335',marginVertical:8},japanese:{fontFamily:ROYAL_FONT.body,fontSize:19,lineHeight:32,color:'#142335',marginVertical:7},body:{fontFamily:ROYAL_FONT.body,fontSize:16,lineHeight:26,color:'#26364c'},meta:{fontFamily:ROYAL_FONT.body,fontSize:14,lineHeight:23,color:'#43536b',marginVertical:7},light:{fontFamily:ROYAL_FONT.body,fontSize:16,lineHeight:25,color:'#fff3cf'},button:{backgroundColor:'#1b3153',borderWidth:1,borderColor:'#c99c51',borderRadius:10,padding:12,marginVertical:6,minHeight:48},selected:{backgroundColor:'#395477',borderWidth:2},buttonText:{fontFamily:ROYAL_FONT.body,fontSize:16,lineHeight:24,color:'#fff3cf',textAlign:'center'},row:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:12},section:{borderTopWidth:1,borderTopColor:'#dbc99c',paddingTop:16,marginTop:16},reflection:{paddingTop:8},day:{paddingVertical:12,borderBottomWidth:1,borderBottomColor:'#dbc99c'},tick:{color:'#238445',fontSize:23,fontWeight:'700'},image:{width:'100%',aspectRatio:1672/941,marginVertical:12,borderRadius:10},error:{paddingHorizontal:18}});

export function KensetsuCourse(props: Parameters<typeof KensetsuFlow>[0]) {
  return (
    <StudyAppearanceProvider>
      <KensetsuFlow {...props} />
    </StudyAppearanceProvider>
  );
}
