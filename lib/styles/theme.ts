/**
 * デザイントークン。色・書体・余白はすべてここから参照する。
 * アニメ公式サイトのような、パステル（ピンク×ミント×イエロー）の
 * ゆめかわ系ポップデザインを基調とする。
 * （方眼の背景・斜めストライプの枠・レトロOS風ウィンドウ・吹き出し）
 */
export const color = {
  /** 見出し・濃色テキスト（くすみプラム） */
  ink: "#4b3552",
  inkDeep: "#3a2840",
  charcoal: "#55475e",
  /** 背景 */
  cream: "#fff8fb",
  paper: "#ffffff",
  /** アクセント：パステルピンク（装飾用） */
  accent: "#ff78a6",
  /** アクセント：本文中で使う濃いピンク（コントラスト確保用） */
  accentDeep: "#cf2f6a",
  accentPale: "#ffe4ee",
  /** サブアクセント */
  mint: "#63d8dd",
  mintDeep: "#0b7a84",
  mintPale: "#dcf6f6",
  yellow: "#ffe27a",
  yellowPale: "#fff6d2",
  sky: "#8cc8ff",
  violet: "#b79cff",
  violetPale: "#f1eaff",
  /** 本文 */
  text: "#4a3f55",
  muted: "#77697f",
  /** 罫線（ピンク系） */
  border: "#ffd3e2",
  borderStrong: "#ff9dc0",
  /** パネルの輪郭線 */
  line: "#ff9dc0",
  /** パネルの影（ミント） */
  glow: "rgba(99, 216, 221, 0.55)",
  link: "#0b7a84",
} as const

/** パネルのずらし影（パステル） */
export const shadow = {
  sm: "3px 3px 0 rgba(99, 216, 221, 0.55)",
  md: "5px 5px 0 rgba(99, 216, 221, 0.55)",
  lg: "8px 8px 0 rgba(99, 216, 221, 0.55)",
} as const

export const radius = {
  sm: "6px",
  md: "12px",
  lg: "18px",
} as const

/** 背景パターン */
export const pattern = {
  /** 方眼 */
  grid: (line = "rgba(255, 157, 192, 0.18)", size = 24) =>
    `linear-gradient(${line} 1px, transparent 1px) 0 0 / ${size}px ${size}px, linear-gradient(90deg, ${line} 1px, transparent 1px) 0 0 / ${size}px ${size}px`,
  /** 斜めストライプ */
  stripe: (a = "#ff8db5", b = "#ffa9c8", w = 8) =>
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
