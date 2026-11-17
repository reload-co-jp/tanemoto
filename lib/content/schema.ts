import { z } from "zod"

/**
 * コンテンツデータの型定義とバリデーションスキーマ。
 * content/ 以下の JSON はすべてここで定義したスキーマで検証される。
 */

const id = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "id/slug は半角英小文字・数字・ハイフンのみ"
  )
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "日付は YYYY-MM-DD 形式")
const ids = z.array(id).default([])

/** 情報区分 */
export const classifications = [
  "fact",
  "scholarship",
  "variant",
  "creative",
  "editorial",
] as const
export const classificationSchema = z.enum(classifications)
export type Classification = z.infer<typeof classificationSchema>

// ---------------------------------------------------------------------------
// 記事本文ブロック
// ---------------------------------------------------------------------------

const claimRefs = { claimIds: ids }

export const blockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1),
    /** 目次・アンカー用ID。省略時は自動採番 */
    anchor: id.optional(),
  }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string().min(1),
    ...claimRefs,
  }),
  z.object({
    type: z.literal("list"),
    ordered: z.boolean().default(false),
    items: z.array(z.string().min(1)).min(1),
    ...claimRefs,
  }),
  z.object({
    type: z.literal("quote"),
    text: z.string().min(1),
    /** 引用元（Source ID） */
    sourceId: id,
    /** 該当箇所（行番号・巻章など） */
    location: z.string().optional(),
    /** 訳者・訳文についての注記（例: 「拙訳」） */
    translationNote: z.string().optional(),
    ...claimRefs,
  }),
  z.object({
    type: z.literal("note"),
    /** 情報区分。囲み記事として区分ラベル付きで表示する */
    classification: classificationSchema,
    title: z.string().optional(),
    text: z.string().min(1),
    ...claimRefs,
  }),
  z.object({
    type: z.literal("image"),
    imageId: id,
    caption: z.string().optional(),
  }),
])
export type Block = z.infer<typeof blockSchema>

// ---------------------------------------------------------------------------
// 主張（Claim）
// ---------------------------------------------------------------------------

export const claimSchema = z.object({
  id,
  text: z.string().min(1),
  classification: classificationSchema,
  sourceIds: ids,
  /** 該当箇所。sourceIds が複数の場合は「出典ID: 箇所」の形で書いてもよい */
  sourceLocation: z.string().optional(),
  verificationStatus: z.enum(["verified", "unverified", "disputed"]),
  /** 補足（解釈の幅、異説など） */
  note: z.string().optional(),
})
export type Claim = z.infer<typeof claimSchema>

// ---------------------------------------------------------------------------
// 記事
// ---------------------------------------------------------------------------

export const articleSchema = z.object({
  id,
  slug: id,
  title: z.string().min(1),
  /** 一覧・カードで使う短いタイトル（省略時は title） */
  shortTitle: z.string().optional(),
  /** 画像がない場合のアイキャッチに表示する語（省略時は主な人物名） */
  eyecatchText: z.string().optional(),
  description: z.string().min(1).max(160, "description は160字以内"),
  /** リード文（省略時は description） */
  lead: z.string().optional(),
  category: id,
  tags: z.array(z.string().min(1)).default([]),
  publishedAt: isoDate,
  updatedAt: isoDate,
  status: z.enum(["published", "draft"]),
  thumbnail: id.optional().describe("Image ID"),
  featured: z.boolean().default(false),
  body: z.array(blockSchema).default([]),
  claims: z.array(claimSchema).default([]),
  figureIds: ids,
  mythologyIds: ids,
  storyIds: ids,
  workIds: ids,
  topicIds: ids,
  sourceIds: ids,
  /** 明示的に関連付けたい記事（自動算出の関連記事より優先表示） */
  relatedArticleIds: ids,
})
export type Article = z.infer<typeof articleSchema>

// ---------------------------------------------------------------------------
// 人物・怪物
// ---------------------------------------------------------------------------

export const figureTypes = {
  god: "神",
  titan: "ティタン",
  hero: "英雄",
  human: "人間",
  monster: "怪物",
  creature: "幻獣",
  nymph: "ニンフ",
  personification: "擬人化された存在",
} as const
export const figureSchema = z.object({
  id,
  slug: id,
  name: z.string().min(1),
  reading: z.string().min(1),
  /** 原語表記（例: ギリシャ語） */
  originalName: z.string().optional(),
  /** 原語のラテン文字転写 */
  romanized: z.string().optional(),
  alternativeNames: z.array(z.string()).default([]),
  type: z.enum(Object.keys(figureTypes) as [keyof typeof figureTypes]),
  /** 属性・役割 */
  roles: z.array(z.string()).default([]),
  mythologyIds: ids,
  description: z.string().min(1),
  /** 詳細ページ用の本文（任意） */
  body: z.array(blockSchema).default([]),
  relatedFigureIds: ids,
  relatedStoryIds: ids,
  /** 明示的な記事紐付け（記事側の figureIds からも自動で関連付く） */
  articleIds: ids,
  sourceIds: ids,
  imageId: id.optional(),
})
export type Figure = z.infer<typeof figureSchema>

// ---------------------------------------------------------------------------
// 神話体系
// ---------------------------------------------------------------------------

export const mythologySchema = z.object({
  id,
  slug: id,
  name: z.string().min(1),
  reading: z.string().optional(),
  region: z.string().min(1),
  period: z.string().optional(),
  description: z.string().min(1),
  body: z.array(blockSchema).default([]),
  figureIds: ids,
  storyIds: ids,
  sourceIds: ids,
  /** 準備中（記事なし）の神話体系 */
  comingSoon: z.boolean().default(false),
  order: z.number().default(100),
})
export type Mythology = z.infer<typeof mythologySchema>

// ---------------------------------------------------------------------------
// 物語（エピソード）
// ---------------------------------------------------------------------------

export const storySchema = z.object({
  id,
  title: z.string().min(1),
  mythologyIds: ids,
  figureIds: ids,
  summary: z.string().min(1),
  sourceIds: ids,
  sourceLocation: z.string().optional(),
})
export type Story = z.infer<typeof storySchema>

// ---------------------------------------------------------------------------
// 作品
// ---------------------------------------------------------------------------

export const workTypes = {
  manga: "漫画",
  anime: "アニメ",
  game: "ゲーム",
  novel: "小説",
  film: "映画",
} as const
export const workSchema = z.object({
  id,
  slug: id,
  title: z.string().min(1),
  reading: z.string().optional(),
  type: z.enum(Object.keys(workTypes) as [keyof typeof workTypes]),
  mediaTypes: z
    .array(z.enum(Object.keys(workTypes) as [keyof typeof workTypes]))
    .default([]),
  author: z.string().min(1),
  /** 連載・放送期間など */
  period: z.string().optional(),
  description: z.string().min(1),
  /** 作品に登場するキャラクターと、モチーフとなった神話上の存在 */
  characters: z
    .array(
      z.object({
        name: z.string().min(1),
        figureId: id.optional(),
        /** 作品内での位置づけ（creative 情報として表示） */
        note: z.string().optional(),
      })
    )
    .default([]),
  mythologyIds: ids,
  articleIds: ids,
  sourceIds: ids,
})
export type Work = z.infer<typeof workSchema>

// ---------------------------------------------------------------------------
// テーマ
// ---------------------------------------------------------------------------

export const topicSchema = z.object({
  id,
  slug: id,
  name: z.string().min(1),
  description: z.string().min(1),
  figureIds: ids,
  storyIds: ids,
  order: z.number().default(100),
})
export type Topic = z.infer<typeof topicSchema>

// ---------------------------------------------------------------------------
// カテゴリー
// ---------------------------------------------------------------------------

export const categorySchema = z.object({
  id,
  slug: id,
  name: z.string().min(1),
  nameEn: z.string().optional(),
  description: z.string().min(1),
  order: z.number().default(100),
})
export type Category = z.infer<typeof categorySchema>

// ---------------------------------------------------------------------------
// 出典
// ---------------------------------------------------------------------------

export const sourceTypes = {
  primary: "一次資料",
  translation: "翻訳",
  secondary: "二次資料（研究書・論文）",
  reference: "事典・参考図書",
  work: "エンタメ作品",
  web: "Webリソース",
} as const
export const sourceSchema = z.object({
  id,
  title: z.string().min(1),
  originalTitle: z.string().optional(),
  author: z.string().min(1),
  /** 翻訳者・編者 */
  translator: z.string().optional(),
  type: z.enum(Object.keys(sourceTypes) as [keyof typeof sourceTypes]),
  /** 成立年代（古典）または出版年 */
  publishedPeriod: z.string().min(1),
  publisher: z.string().optional(),
  url: z.union([z.literal(""), z.url()]).default(""),
  urlLabel: z.string().optional(),
  notes: z.string().optional(),
})
export type Source = z.infer<typeof sourceSchema>

// ---------------------------------------------------------------------------
// 画像
// ---------------------------------------------------------------------------

export const imageSchema = z.object({
  id,
  /** public/ 以下のパス（例: /images/articles/medusa.jpg） */
  src: z.string().startsWith("/"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1),
  /** 出典（所蔵館・URL など） */
  source: z.string().min(1),
  sourceUrl: z.union([z.literal(""), z.url()]).default(""),
  author: z.string().min(1),
  license: z.string().min(1),
  credit: z.string().min(1),
  /** AI生成画像の場合 true（実在の史料と誤認されないよう表示する） */
  aiGenerated: z.boolean().default(false),
})
export type Image = z.infer<typeof imageSchema>

// ---------------------------------------------------------------------------
// サイト設定（トップページの注目・人気記事など）
// ---------------------------------------------------------------------------

export const homeSchema = z.object({
  featuredArticleIds: ids,
  popularArticleIds: ids,
})
export type Home = z.infer<typeof homeSchema>
