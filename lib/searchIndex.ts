import { figureTypes, workTypes } from "./content/schema"
import {
  getArticles,
  getCategory,
  getCharacters,
  getCharactersForWork,
  getFigures,
  getMotifFigures,
  getWorksByIds,
  getFiguresByIds,
  getMythologies,
  getTopics,
  getWorks,
} from "./content/repository"
import { blocksToPlainText, stripInline } from "./content/text"
import { paths } from "./site"

export type SearchKind =
  "character" | "article" | "figure" | "work" | "mythology" | "topic"

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
      ...getCharactersForWork(w).map((c) => c.name),
    ].filter(Boolean),
    body: "",
  })),
  // キャラクター名・作品名・元ネタ名のどれからでも見つけられるようにする
  ...getCharacters().map((c) => {
    const work = getWorksByIds([c.workId])[0]
    return {
      kind: "character" as const,
      title: c.name,
      label: work ? `『${work.title}』` : "キャラクター",
      href: paths.character(c.slug),
      description: `元ネタ：${c.motifs.map((m) => m.label).join("、")}。${stripInline(c.description.text)}`,
      keywords: [
        c.reading ?? "",
        ...c.alternativeNames,
        work?.title ?? "",
        ...c.motifs.map((m) => m.label),
        ...getMotifFigures(c).flatMap((f) => [f.name, ...f.alternativeNames]),
      ].filter(Boolean),
      body: [
        c.nameOrigin?.text ?? "",
        ...c.motifs.flatMap((m) => [m.inWork.text, m.inMyth?.text ?? ""]),
        ...c.comparison.map((x) => x.text),
      ]
        .map(stripInline)
        .join("\n"),
    }
  }),
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
