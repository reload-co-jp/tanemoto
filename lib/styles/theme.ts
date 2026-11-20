/**
 * デザイントークン。色・書体・余白はすべてここから参照する。
 * アニメや創作作品が好きな人向けの、明るくポップなデザインを基調とする。
 * （くっきりした輪郭線・オフセットの影・丸みのある書体・ビビッドなアクセント）
 */
export const color = {
  /** メイン：インク（見出し・輪郭線・濃色面） */
  ink: "#2b2045",
  inkDeep: "#1c1530",
  /** 本文寄りの濃色 */
  charcoal: "#3a3150",
  /** 背景：クリーム / 紙面 */
  cream: "#fff7ea",
  paper: "#ffffff",
  /** アクセント：ポップピンク（装飾用） */
  accent: "#ff4f8b",
  /** アクセント：本文中で使う濃いピンク（コントラスト確保用） */
  accentDeep: "#c3185c",
  accentPale: "#ffe0eb",
  /** サブアクセント（装飾用） */
  yellow: "#ffd23f",
  yellowPale: "#fff1b8",
  mint: "#34c6b5",
  mintPale: "#d6f5f0",
  sky: "#5aa9ff",
  violet: "#8b6cff",
  violetPale: "#ebe5ff",
  /** 本文 */
  text: "#2e2840",
  muted: "#635d73",
  border: "#eadfcd",
  borderStrong: "#2b2045",
  link: "#5b3fd6",
} as const

/** カード等に使うオフセット影（漫画のコマ風） */
export const shadow = {
  sm: "3px 3px 0 #2b2045",
  md: "5px 5px 0 #2b2045",
  lg: "8px 8px 0 #2b2045",
} as const

export const radius = {
  sm: "8px",
  md: "14px",
  lg: "22px",
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
  // 丸みのある和文書体（Google Fonts）。欧文は Fredoka で表示する
  display:
    '"Fredoka", "Zen Maru Gothic", "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Noto Sans JP", sans-serif',
  sans: '"Zen Maru Gothic", "Hiragino Maru Gothic ProN", "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Noto Sans CJK JP", "Yu Gothic", YuGothic, Meiryo, sans-serif',
  pop: '"Fredoka", "Zen Maru Gothic", "Arial Rounded MT Bold", sans-serif',
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
