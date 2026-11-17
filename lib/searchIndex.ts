import { figureTypes, workTypes } from "./content/schema"
import {
  getArticles,
  getCategory,
  getFigures,
  getFiguresByIds,
  getMythologies,
  getTopics,
  getWorks,
} from "./content/repository"
import { blocksToPlainText } from "./content/text"
import { paths } from "./site"

export type SearchKind = "article" | "figure" | "work" | "mythology" | "topic"

export type SearchEntry = {
  kind: SearchKind
  title: string
  /** 表示用の補足（カテゴリー・種別など） */
  label: string
  href: string
  description: string
  /** 重み付き検索用フィールド */
  keywords: string[]
  body: string
}

/** 静的検索インデックスを生成する（/search-index.json としてビルド時に出力） */
export const buildSearchIndex = (): SearchEntry[] => [
  ...getArticles().map((a) => ({
    kind: "article" as const,
    title: a.title,
    label: getCategory(a.category)?.name ?? "記事",
    href: paths.article(a.slug),
    description: a.description,
    // 記事に登場する人物の別名でも記事を見つけられるようにする
    keywords: [
      ...a.tags,
      ...getFiguresByIds(a.figureIds.slice(0, 1)).flatMap((f) => [
        f.name,
        ...f.alternativeNames,
      ]),
    ],
    body: blocksToPlainText(a.body),
  })),
  ...getFigures().map((f) => ({
    kind: "figure" as const,
    title: f.name,
    label: figureTypes[f.type],
    href: paths.figure(f.slug),
    description: f.description,
    keywords: [
      f.reading,
      ...f.alternativeNames,
      f.originalName ?? "",
      f.romanized ?? "",
      ...f.roles,
    ].filter(Boolean),
    body: blocksToPlainText(f.body),
  })),
  ...getWorks().map((w) => ({
    kind: "work" as const,
    title: `『${w.title}』`,
    label: workTypes[w.type],
    href: paths.work(w.slug),
    description: w.description,
    keywords: [
      w.title,
      w.reading ?? "",
      w.author,
      ...w.characters.map((c) => c.name),
    ].filter(Boolean),
    body: "",
  })),
  ...getMythologies()
    .filter((m) => !m.comingSoon)
    .map((m) => ({
      kind: "mythology" as const,
      title: m.name,
      label: "神話体系",
      href: paths.mythology(m.slug),
      description: m.description,
      keywords: [m.reading ?? "", m.region].filter(Boolean),
      body: blocksToPlainText(m.body),
    })),
  ...getTopics().map((t) => ({
    kind: "topic" as const,
    title: t.name,
    label: "テーマ",
    href: paths.topic(t.slug),
    description: t.description,
    keywords: [],
    body: "",
  })),
]
