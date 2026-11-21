/**
 * デザイントークン。色・書体・余白はすべてここから参照する。
 * マスコット（フェレットの案内人）のキャラクターシートのカラーパレット
 * 「深緑 #324b4a／セージ #7c8d67／金 #edb24d／クリーム #f9e0c2／茶 #664c43」を基調とする。
 * 冒険の書のような、生成り紙×深緑のマント×金の羅針盤のトーン。
 * （方眼の背景・斜めストライプの枠・レトロOS風ウィンドウ・吹き出し）
 */
export const palette = {
  green: "#324b4a",
  sage: "#7c8d67",
  gold: "#edb24d",
  cream: "#f9e0c2",
  brown: "#664c43",
} as const

export const color = {
  /** 見出し・濃色テキスト（深緑） */
  ink: "#2c4241",
  inkDeep: "#1f3130",
  charcoal: "#4a4540",
  /** 背景（生成り） */
  cream: "#fbf6ec",
  paper: "#fffdf8",
  /** アクセント：マントの深緑（装飾・見出し） */
  accent: palette.green,
  /** アクセント：本文中で使う濃い深緑（コントラスト確保用） */
  accentDeep: "#243837",
  accentPale: "#e7ece6",
  /** サブアクセント：セージ */
  mint: palette.sage,
  mintDeep: "#4d5e3a",
  mintPale: "#eef0e4",
  /** 金（羅針盤） */
  yellow: palette.gold,
  yellowPale: "#fbeed2",
  /** 空・茶 */
  sky: "#9db8c4",
  violet: "#a3806e",
  violetPale: "#f6e9dc",
  /** 本文 */
  text: "#3d3a36",
  muted: "#6b645c",
  /** 罫線（生成りの縁） */
  border: "#ecdcc0",
  borderStrong: "#c9ad7f",
  /** パネルの輪郭線 */
  line: "#c9ad7f",
  /** パネルの影（金） */
  glow: "rgba(237, 178, 77, 0.5)",
  link: "#4d5e3a",
} as const

/** パネルのずらし影（金） */
export const shadow = {
  sm: "3px 3px 0 rgba(237, 178, 77, 0.5)",
  md: "5px 5px 0 rgba(237, 178, 77, 0.5)",
  lg: "8px 8px 0 rgba(237, 178, 77, 0.5)",
} as const

export const radius = {
  sm: "6px",
  md: "12px",
  lg: "18px",
} as const

/** 背景パターン */
export const pattern = {
  /** 方眼 */
  grid: (line = "rgba(124, 141, 103, 0.14)", size = 24) =>
    `linear-gradient(${line} 1px, transparent 1px) 0 0 / ${size}px ${size}px, linear-gradient(90deg, ${line} 1px, transparent 1px) 0 0 / ${size}px ${size}px`,
  /** 斜めストライプ */
  stripe: (a = "#324b4a", b = "#3e5a58", w = 8) =>
    `repeating-linear-gradient(-45deg, ${a} 0 ${w}px, ${b} ${w}px ${w * 2}px)`,
} as const

/** 情報区分ラベルの色（ポップだが判別しやすいトーン） */
export const classificationColor = {
  fact: { fg: "#1f4f9e", bg: "#dfeaff" },
  scholarship: { fg: "#5a2fb8", bg: "#ece4ff" },
  variant: { fg: "#8a4a00", bg: "#fff0c9" },
  creative: { fg: "#0d6b5f", bg: "#d4f5ee" },
  editorial: { fg: "#a8174f", bg: "#ffe1ec" },
} as const

export const font = {
  // 和文見出し：M PLUS 1 の極太
  display:
    '"M PLUS 1", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
  sans: '"M PLUS 1", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Noto Sans CJK JP", "Yu Gothic", YuGothic, Meiryo, sans-serif',
  // 欧文の装飾見出し：まるっとしたポップ書体
  pop: '"Cherry Bomb One", "M PLUS 1", "Arial Rounded MT Bold", sans-serif',
} as const

/** ブレークポイント（モバイルファースト：min-width） */
export const bp = {
  sm: "(min-width: 600px)",
  md: "(min-width: 800px)",
  lg: "(min-width: 1080px)",
} as const

export const layout = {
  maxWidth: "1180px",
  /** 本文の最適な行長（全角 約38字） */
  measure: "40em",
  gutter: "20px",
} as const
