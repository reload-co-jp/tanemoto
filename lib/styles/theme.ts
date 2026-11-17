/**
 * デザイントークン。色・書体・余白はすべてここから参照する。
 * 落ち着いた書籍・雑誌のような editorial デザインを基調とする。
 */
export const color = {
  /** メイン：濃紺 */
  navy: "#1d2a3f",
  navyDeep: "#141d2c",
  /** メイン：チャコール */
  charcoal: "#2e3238",
  /** 背景：アイボリー / オフホワイト */
  ivory: "#f6f1e6",
  paper: "#fcfaf5",
  /** アクセント：アンティークゴールド（装飾用） */
  gold: "#b08d4a",
  /** アクセント：本文中で使う濃いゴールド（コントラスト確保用） */
  goldDeep: "#7d6128",
  goldPale: "#efe4cb",
  /** 本文 */
  text: "#2f3237",
  muted: "#61656c",
  border: "#e1d9c7",
  borderStrong: "#cbbfa5",
  link: "#24456e",
} as const

/** 情報区分ラベルの色（控えめなトーン） */
export const classificationColor = {
  fact: { fg: "#2c4a6b", bg: "#e7edf3" },
  scholarship: { fg: "#4b3f6b", bg: "#ece8f3" },
  variant: { fg: "#6b4a22", bg: "#f4ecdf" },
  creative: { fg: "#2f5b4a", bg: "#e5f0ea" },
  editorial: { fg: "#5a5d63", bg: "#ecebe8" },
} as const

export const font = {
  // 欧文・ギリシャ文字は欧文フォントで表示する（和文フォントだと全角幅になるため）
  serif:
    'Georgia, "Times New Roman", "Hiragino Mincho ProN", "Yu Mincho", YuMincho, "Noto Serif JP", "Noto Serif CJK JP", serif',
  sans: '"Helvetica Neue", Arial, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", "Noto Sans CJK JP", "Yu Gothic", YuGothic, Meiryo, sans-serif',
  latin: 'Garamond, "Times New Roman", serif',
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
