export type PortalKind = 'education' | 'company' | 'support';

export type PortalMetric = { label: string; value: string; note: string; tone: 'blue' | 'green' | 'amber' | 'rose' };
export type PortalBranch = { id: string; icon: string; title: string; description: string; badge?: string; alert?: boolean; route?: '/portal/worker-progress' };
export type PortalWorkspace = { id: string; icon: string; title: string; description: string; color: string; branches: PortalBranch[] };
export type PortalDashboardConfig = {
  kind: PortalKind; eyebrow: string; title: string; accent: string; accentDark: string; summary: string;
  metrics: PortalMetric[]; quickActions: Array<{ icon: string; title: string }>; workspaces: PortalWorkspace[];
};

export const organizationPortals: Record<PortalKind, PortalDashboardConfig> = {
  education: {
    kind: 'education', eyebrow: '日本語教育機関', title: '教育・学習管理', accent: '#4aa8cf', accentDark: '#267a9f',
    summary: '授業・学生・クラス・教材・評価を、つながりのある一つの業務空間で管理します。',
    metrics: [
      { label: '在籍学生', value: '486', note: '今月 18名増', tone: 'blue' },
      { label: '本日の出席率', value: '94.2%', note: '欠席 12名', tone: 'green' },
      { label: '要支援学生', value: '23', note: '優先対応 7名', tone: 'rose' },
      { label: '本日の授業', value: '18', note: '次回 10:30', tone: 'amber' },
    ],
    quickActions: [{ icon: '▶', title: '授業を開始' }, { icon: '✓', title: '出席を登録' }, { icon: '＋', title: '教材を追加' }, { icon: '⌕', title: '学生を検索' }],
    workspaces: [
      { id: 'materials', icon: '本', title: '授業・学習資料', description: '教師がすぐ授業を始められる教材一式', color: '#4aa8cf', branches: [
        { id: 'level-materials', icon: '級', title: 'レベル別指導教材', description: 'N5・N4・N3・N2・N1の授業資料と到達目標', badge: 'N5〜N1' },
        { id: 'daily-plans', icon: '日', title: '毎日の授業案', description: '学習進度に合わせた日別の指導案・板書例・所要時間' },
        { id: 'student-tests', icon: '試', title: '学生用課題・確認テスト', description: '宿題・小テスト・模擬試験・自動採点・再学習' },
        { id: 'references', icon: '参', title: '専門資料・参考資料', description: '教師用専門資料と学生へ送れる補助・参考資料' },
      ]},
      { id: 'online-class', icon: '映', title: 'オンライン教室', description: 'Zoom型の授業・出席・共同学習をアプリ一つで実施', color: '#6c86d2', branches: [
        { id: 'class-room', icon: '室', title: 'ライブ教室を開始', description: '映像・音声・画面共有・招待・待機室・録画', badge: 'ライブ' },
        { id: 'collab-board', icon: '描', title: '共同ホワイトボード', description: '全員で描画・文字入力・蛍光ペン・囲み・PDF共有' },
        { id: 'live-attendance', icon: '出', title: '授業内の自動出席', description: '入退室時間・遅刻・途中退席・参加時間を自動記録' },
        { id: 'live-tools', icon: '具', title: '授業ツール', description: '挙手・小部屋・投票・チャット・教材配信・理解度確認' },
      ]},
      { id: 'classes', icon: '校', title: 'クラス・学生管理', description: 'クラス編成、予定、学生情報を一元管理', color: '#48a98a', branches: [
        { id: 'students', icon: '録', title: '学生カルテ', description: '個人情報・学習履歴・面談・支援計画', badge: '23件', alert: true },
        { id: 'schedule', icon: '暦', title: 'クラス・講師・時間割', description: 'クラス編成・担当講師・振替・年間予定' },
        { id: 'attendance', icon: '集', title: '出席集計', description: '対面とオンラインの出欠・遅刻・月次集計' },
      ]},
      { id: 'assessment', icon: '析', title: '成績・学習支援', description: '結果を分析し次の指導と支援につなげる', color: '#d49348', branches: [
        { id: 'analytics', icon: '能', title: '成績・強み弱み分析', description: '得点推移・技能別習熟度・苦手分野・学習提案' },
        { id: 'followup', icon: '支', title: '個別指導・再学習', description: '個別課題・面談・フォロー期限・対応履歴' },
        { id: 'reports', icon: '報', title: '学習・出席レポート', description: '企業や関係者へ共有する報告書の作成' },
      ]},
    ],
  },
  company: {
    kind: 'company', eyebrow: '受け入れ企業', title: '外国人材・育成管理', accent: '#df8756', accentDark: '#a95732',
    summary: '人材情報・在留期限・学習・連絡・評価を、人物を中心につないで管理します。',
    metrics: [
      { label: '在籍者', value: '128', note: '8部署', tone: 'blue' }, { label: '60日以内の期限', value: '9', note: '至急 3件', tone: 'rose' },
      { label: '学習継続率', value: '87%', note: '今月 4.5%増', tone: 'green' }, { label: '未読・要対応', value: '16', note: '本日期限 5件', tone: 'amber' },
    ],
    quickActions: [{ icon: '⌕', title: '人材を検索' }, { icon: '✉', title: '連絡を送る' }, { icon: '暦', title: '面談を予約' }, { icon: '!', title: '期限を確認' }],
    workspaces: [
      { id: 'overview', icon: '総', title: '外国人材の全体状況', description: '人数・所属・在留・学習・要対応を即座に把握', color: '#df8756', branches: [
        { id: 'headcount', icon: '数', title: '在籍人数・所属一覧', description: '全人数・部署・職種・入社日・就労状況を集計' },
        { id: 'alerts', icon: '注', title: '要対応・期限一覧', description: '在留期限・未読・未学習・面談・提出漏れ', badge: '16件', alert: true },
        { id: 'company-report', icon: '報', title: '会社全体レポート', description: '定着・学習・能力・支援状況の推移' },
      ]},
      { id: 'people', icon: '人', title: '個人情報・在留管理', description: '必要な情報を人物ページに集約', color: '#c86d4b', branches: [
        { id: 'profiles', icon: '録', title: '個人プロフィール', description: '履歴書・配属・雇用条件・連絡先・資格' },
        { id: 'residence', icon: '在', title: '在留カード・更新期限', description: 'カード画像・OCR・在留資格・必要書類', badge: '9件', alert: true },
        { id: 'timeline', icon: '歴', title: '個人履歴', description: '異動・面談・評価・連絡・支援の時系列記録' },
      ]},
      { id: 'worker-progress', icon: '育', title: '学習・能力評価', description: '企業と監理団体が同じ情報を共同確認', color: '#c88a45', branches: [
        { id: 'worker-progress', icon: '進', title: '学習・評価共同管理', description: '現在レベル・学習状況・停止期間・強み弱み・双方の評価', badge: '共通', route: '/portal/worker-progress' },
        { id: 'inactive', icon: '止', title: '学習停止・低下の検知', description: '未学習日数・成績低下・未完了課題を自動抽出', badge: '12名', alert: true },
        { id: 'reminders', icon: '促', title: '学習リマインド・育成計画', description: '個別目標・課題・期限・通知・対応結果' },
      ]},
      { id: 'communication', icon: '話', title: '面談・連絡・支援', description: '確認、通知、フォローを人物情報につなぐ', color: '#4b9d82', branches: [
        { id: 'messages', icon: '信', title: '個別・一斉連絡', description: '部署別配信・既読確認・定型文・緊急通知' },
        { id: 'meetings', icon: '会', title: '面談・評価面談', description: '日程・議事録・本人確認・次回対応' },
        { id: 'support', icon: '守', title: '安全・健康・生活支援', description: '安全教育・健康相談・生活課題・安否確認' },
      ]},
    ],
  },
  support: {
    kind: 'support', eyebrow: '監理団体・登録支援機関', title: '広域人材・支援業務管理', accent: '#8873c3', accentDark: '#5f4a9b',
    summary: '地域・企業・事業所・人材・担当者を階層化し、数千人規模でも迷わず管理します。',
    metrics: [
      { label: '管理対象者', value: '3,842', note: '27か国', tone: 'blue' }, { label: '受け入れ企業', value: '216', note: '38市区町村', tone: 'green' },
      { label: '高リスク案件', value: '31', note: '期限超過 8件', tone: 'rose' }, { label: '今月の期限', value: '147', note: '在留・報告', tone: 'amber' },
    ],
    quickActions: [{ icon: '⌕', title: '全体検索' }, { icon: '人', title: '担当を割当' }, { icon: '✉', title: '一括連絡' }, { icon: '!', title: '期限を確認' }],
    workspaces: [
      { id: 'directory', icon: '検', title: '企業・人材を検索', description: '数千人の中から会社名・氏名ですぐに特定', color: '#8873c3', branches: [
        { id: 'company-search', icon: '社', title: '企業から探す', description: '企業→事業所→所属人材→個人詳細の順に展開' },
        { id: 'worker-search', icon: '人', title: '人材から探す', description: '氏名・在留カード番号・社員番号・電話番号で検索' },
        { id: 'saved-views', icon: '保', title: '保存した検索・表示', description: 'よく使う条件と列構成を保存して再利用' },
      ]},
      { id: 'records', icon: '表', title: '統合管理台帳', description: 'Excel型フィルターで担当・地域・企業・人材を管理', color: '#6d8fc9', branches: [
        { id: 'hierarchy', icon: '層', title: '地域・企業・事業所・人材', description: '都道府県→市区町村→企業→事業所→個人' },
        { id: 'assignment', icon: '担', title: '担当者を含む一覧・絞り込み', description: '担当者・企業・地域・在留資格・期限・状態を複合フィルター' },
        { id: 'edit-records', icon: '編', title: '情報の追加・編集・削除', description: '個別・一括更新、変更履歴、削除前確認、復元' },
      ]},
      { id: 'worker-progress', icon: '育', title: '学習・能力評価', description: '受け入れ企業と同じ画面・同じデータで共同管理', color: '#c88a45', branches: [
        { id: 'worker-progress', icon: '進', title: '学習・評価共同管理', description: '現在レベル・学習状況・停止期間・強み弱み・双方の評価', badge: '共通', route: '/portal/worker-progress' },
        { id: 'inactive', icon: '止', title: '学習停止・要支援者', description: '未学習・成績低下・未完了課題・要面談を抽出', badge: '31名', alert: true },
        { id: 'followup', icon: '促', title: '共同フォロー・対応履歴', description: '企業・担当職員の評価、通知、面談、対応結果を共有' },
      ]},
      { id: 'operations', icon: '法', title: '支援・期限・監査', description: '担当業務と法定期限を漏れなく管理', color: '#4f9a85', branches: [
        { id: 'cases', icon: '相', title: '相談・支援ケース', description: '相談・訪問・面談・苦情・次回対応の履歴' },
        { id: 'deadlines', icon: '期', title: '在留・届出・定期報告', description: '更新・届出・面談・報告書期限を自動監視', badge: '147件', alert: true },
        { id: 'documents', icon: '書', title: '文書・監査・権限', description: '証明書・版管理・監査記録・操作ログ・アクセス制御' },
      ]},
    ],
  },
};
