import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoyalPositioning } from '@/components/ui/RoyalPositioning';
import { RoyalBackButton } from '@/components/ui/RoyalSurface';

import { organizationPortals, type PortalBranch, type PortalKind, type PortalMetric, type PortalWorkspace } from '@/data/organization-portals';

const TONES = {
  blue: { bg: '#e9f6fb', fg: '#2f82a7' }, green: { bg: '#e9f7f0', fg: '#338466' },
  amber: { bg: '#fff4df', fg: '#a76a20' }, rose: { bg: '#fff0f2', fg: '#bd5368' },
} as const;

function MetricCard({ metric, wide }: { metric: PortalMetric; wide: boolean }) {
  const tone = TONES[metric.tone];
  return (
    <View style={[styles.metric, { backgroundColor: tone.bg }, wide && styles.metricWide]}>
      <View style={[styles.metricDot, { backgroundColor: tone.fg }]} />
      <Text style={styles.metricLabel}>{metric.label}</Text>
      <Text style={[styles.metricValue, { color: tone.fg }]}>{metric.value}</Text>
      <Text style={styles.metricNote}>{metric.note}</Text>
    </View>
  );
}

function BranchRow({ branch, color, last }: { branch: PortalBranch; color: string; last: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={branch.title}
      onPress={() => Alert.alert(branch.title, `${branch.description}\n\n詳細画面は次の設計段階で実装します。`)}
      style={({ pressed }) => [styles.branchRow, !last && styles.branchDivider, pressed && styles.pressed]}
    >
      <View style={[styles.branchIcon, { backgroundColor: `${color}18`, borderColor: `${color}45` }]}>
        <Text style={[styles.branchIconText, { color }]}>{branch.icon}</Text>
      </View>
      <View style={styles.branchCopy}>
        <View style={styles.branchTitleRow}>
          <Text style={styles.branchTitle}>{branch.title}</Text>
          {branch.badge ? <Text style={[styles.badge, branch.alert && styles.badgeAlert]}>{branch.badge}</Text> : null}
        </View>
        <Text style={styles.branchDescription}>{branch.description}</Text>
      </View>
      <Text style={[styles.chevron, { color }]}>›</Text>
    </Pressable>
  );
}

function WorkspaceCard({ workspace, expanded, onToggle, wide }: { workspace: PortalWorkspace; expanded: boolean; onToggle: () => void; wide: boolean }) {
  return (
    <View style={[styles.workspace, wide && styles.workspaceWide, expanded && { borderColor: `${workspace.color}72` }]}>
      <Pressable onPress={onToggle} style={({ pressed }) => [styles.workspaceHeader, pressed && styles.pressed]}>
        <View style={[styles.workspaceIcon, { backgroundColor: workspace.color, borderBottomColor: `${workspace.color}99` }]}>
          <Text style={styles.workspaceIconText}>{workspace.icon}</Text>
        </View>
        <View style={styles.workspaceCopy}>
          <Text style={styles.workspaceTitle}>{workspace.title}</Text>
          <Text style={styles.workspaceDescription}>{workspace.description}</Text>
          <Text style={[styles.childCount, { color: workspace.color }]}>{workspace.branches.length}ページ</Text>
        </View>
        <View style={[styles.expandButton, expanded && { backgroundColor: `${workspace.color}18` }]}>
          <Text style={[styles.expandText, { color: workspace.color }]}>{expanded ? '−' : '＋'}</Text>
        </View>
      </Pressable>
      {expanded ? (
        <View style={styles.branchList}>
          {workspace.branches.map((branch, index) => (
            <BranchRow key={branch.id} branch={branch} color={workspace.color} last={index === workspace.branches.length - 1} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

export function OrganizationDashboard({ kind }: { kind: PortalKind }) {
  const config = organizationPortals[kind];
  const { width } = useRoyalPositioning();
  const wide = width >= 820;
  const [expanded, setExpanded] = useState<string[]>([config.workspaces[0].id]);

  function toggle(id: string) {
    setExpanded((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <View style={[styles.screen, { backgroundColor: `${config.accent}10` }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.topBar}>
          <RoyalBackButton onPress={() => router.back()} />
        </View>

        <ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, { borderLeftColor: config.accent, borderBottomColor: config.accentDark }]}>
            <Text style={[styles.eyebrow, { color: config.accentDark }]}>{config.eyebrow}</Text>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.summary}>{config.summary}</Text>
          </View>

          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>本日の概要</Text><Text style={styles.updated}>09:30 更新</Text></View>
          <View style={[styles.metrics, wide && styles.rowWrap]}>{config.metrics.map((metric) => <MetricCard key={metric.label} metric={metric} wide={wide} />)}</View>

          <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>すぐに行う</Text></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
            {config.quickActions.map((action) => (
              <Pressable key={action.title} onPress={() => Alert.alert(action.title, 'この操作画面は次の設計段階で実装します。')} style={({ pressed }) => [styles.quickAction, { borderBottomColor: config.accentDark }, pressed && styles.pressed]}>
                <View style={[styles.quickIcon, { backgroundColor: `${config.accent}1f` }]}><Text style={[styles.quickIconText, { color: config.accentDark }]}>{action.icon}</Text></View>
                <Text style={styles.quickTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <View><Text style={styles.sectionTitle}>業務スペース</Text><Text style={styles.sectionHint}>大項目を開くと関連ページが表示されます</Text></View>
            <Text style={styles.workspaceCount}>{config.workspaces.length}項目</Text>
          </View>
          <View style={[styles.workspaceGrid, wide && styles.rowWrap]}>
            {config.workspaces.map((workspace) => <WorkspaceCard key={workspace.id} workspace={workspace} expanded={expanded.includes(workspace.id)} onToggle={() => toggle(workspace.id)} wide={wide} />)}
          </View>

          <View style={styles.securityNote}><Text style={styles.securityText}>🔒 役割と担当範囲に応じて、表示・編集できる情報を自動的に制限します。</Text></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, safeArea: { flex: 1 },
  topBar: { minHeight: 58, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(232,226,214,0.82)' },
  backButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center' }, backArrow: { marginRight: 5, color: '#244e61', fontSize: 34, lineHeight: 36 }, backText: { color: '#244e61', fontSize: 16, fontWeight: '900' },
  searchBar: { height: 34, flex: 1, maxWidth: 440, marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 11, borderRadius: 10, backgroundColor: '#edf3f5' },
  searchIcon: { marginRight: 7, color: '#607c88', fontSize: 16 }, searchText: { color: '#7c919a', fontSize: 16, fontWeight: '700' },
  userBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, height: 29, borderRadius: 15, backgroundColor: '#eef6f8' }, userDot: { width: 7, height: 7, marginRight: 5, borderRadius: 4 }, userText: { color: '#466878', fontSize: 15, fontWeight: '900' },
  content: { padding: 15, paddingBottom: 36 }, contentWide: { width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 28 },
  hero: { padding: 18, borderRadius: 20, borderLeftWidth: 5, borderBottomWidth: 5, backgroundColor: 'rgba(232,226,214,0.96)', shadowColor: '#17465b', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 7 } },
  eyebrow: { fontSize: 16, fontWeight: '900', letterSpacing: 1 }, title: { marginTop: 8, color: '#173f53', fontSize: 25, lineHeight: 31, fontWeight: '900' }, summary: { marginTop: 9, color: '#496875', fontSize: 16, lineHeight: 16, fontWeight: '700' },
  sectionHeader: { marginTop: 23, marginBottom: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }, sectionTitle: { color: '#1f485b', fontSize: 15, fontWeight: '900' }, sectionHint: { marginTop: 3, color: '#7c929b', fontSize: 15, fontWeight: '700' }, updated: { color: '#879aa2', fontSize: 15, fontWeight: '700' }, workspaceCount: { color: '#80949c', fontSize: 15, fontWeight: '900' },
  metrics: { gap: 9 }, rowWrap: { flexDirection: 'row', flexWrap: 'wrap' }, metric: { padding: 13, borderRadius: 15, borderWidth: 1, borderColor: 'rgba(32,81,102,0.07)' }, metricWide: { width: '23.8%', minWidth: 190, flexGrow: 1 }, metricDot: { width: 7, height: 7, borderRadius: 4, position: 'absolute', top: 13, right: 13 }, metricLabel: { color: '#31596b', fontSize: 16, fontWeight: '900' }, metricValue: { marginTop: 7, fontSize: 24, fontWeight: '900' }, metricNote: { marginTop: 2, color: '#728893', fontSize: 15, fontWeight: '700' },
  quickRow: { gap: 9, paddingRight: 20 }, quickAction: { width: 142, minHeight: 68, padding: 10, gap: 9, flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderBottomWidth: 4, backgroundColor: '#e8e2d6' }, quickIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }, quickIconText: { fontSize: 17, fontWeight: '900' }, quickTitle: { flex: 1, color: '#244c5f', fontSize: 16, lineHeight: 15, fontWeight: '900' },
  workspaceGrid: { gap: 11 }, workspace: { width: '100%', overflow: 'hidden', borderRadius: 18, borderWidth: 1, borderBottomWidth: 4, borderColor: 'rgba(35,77,95,0.12)', backgroundColor: '#e8e2d6', shadowColor: '#204c5f', shadowOpacity: 0.07, shadowRadius: 9, shadowOffset: { width: 0, height: 5 } }, workspaceWide: { width: '48.8%', flexGrow: 1, maxWidth: '49.5%', alignSelf: 'flex-start' },
  workspaceHeader: { minHeight: 104, padding: 14, flexDirection: 'row', alignItems: 'center' }, workspaceIcon: { width: 50, height: 50, marginRight: 12, borderRadius: 15, borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center' }, workspaceIconText: { color: '#fff', fontSize: 20, fontWeight: '900' }, workspaceCopy: { flex: 1 }, workspaceTitle: { color: '#183f52', fontSize: 15, fontWeight: '900' }, workspaceDescription: { marginTop: 4, color: '#607984', fontSize: 16, lineHeight: 13, fontWeight: '700' }, childCount: { marginTop: 5, fontSize: 15, fontWeight: '900' }, expandButton: { width: 31, height: 31, marginLeft: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, expandText: { fontSize: 19, fontWeight: '700' },
  branchList: { borderTopWidth: 1, borderTopColor: 'rgba(38,76,92,0.10)', paddingHorizontal: 13, backgroundColor: '#fbfdfe' }, branchRow: { minHeight: 76, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' }, branchDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(38,76,92,0.08)' }, branchIcon: { width: 35, height: 35, marginRight: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, branchIconText: { fontSize: 16, fontWeight: '900' }, branchCopy: { flex: 1 }, branchTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }, branchTitle: { flexShrink: 1, color: '#244b5d', fontSize: 16, fontWeight: '900' }, branchDescription: { marginTop: 3, color: '#6c828c', fontSize: 15, lineHeight: 12, fontWeight: '700' }, badge: { paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden', borderRadius: 7, color: '#526f7b', backgroundColor: '#edf4f6', fontSize: 15, fontWeight: '900' }, badgeAlert: { color: '#ad4058', backgroundColor: '#ffe9ed' }, chevron: { marginLeft: 7, fontSize: 23, lineHeight: 23, fontWeight: '700' },
  securityNote: { marginTop: 20, padding: 13, borderRadius: 13, borderWidth: 1, borderColor: 'rgba(47,89,107,0.12)', backgroundColor: 'rgba(236,246,249,0.9)' }, securityText: { color: '#456674', fontSize: 16, fontWeight: '800', textAlign: 'center' }, pressed: { opacity: 0.7, transform: [{ scale: 0.992 }] },
});
