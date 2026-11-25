import fs from "node:fs"
import path from "node:path"
import { readContent } from "./load"
import type {
  Article,
  Category,
  Character,
  Figure,
  Image,
  Mythology,
  Source,
  Story,
  Topic,
  Work,
} from "./schema"
import { ContentData, validateContent } from "./validate"

/**
 * ビルド時にコンテンツを読み込み、ページから使うアクセサを提供する。
 * 整合性エラーがある場合はビルドを失敗させる。
 */

let cache: ContentData | null = null

export const publicFileExists = (publicPath: string) =>
  fs.existsSync(path.join(process.cwd(), "public", publicPath))

const content = (): ContentData => {
  if (cache) return cache
  const { data, issues } = readContent()
  const all = [
    ...issues,
    ...validateContent(data, { fileExists: publicFileExists }),
  ]
  const errors = all.filter((i) => i.level === "error")
  if (errors.length > 0) {
    throw new Error(
      `コンテンツの検証に失敗しました:\n${errors
        .map((e) => `  ${e.file}: ${e.message}`)
        .join("\n")}\n\`pnpm validate\` で詳細を確認してください。`
    )
  }
  cache = data
  return data
}

const byId = <T extends { id: string }>(items: T[], id: string) =>
  items.find((item) => item.id === id)
const pick = <T extends { id: string }>(items: T[], ids: string[]): T[] =>
  ids.flatMap((id) => {
    const found = byId(items, id)
    return found ? [found] : []
  })
const uniq = <T>(values: T[]) => [...new Set(values)]

const newestFirst = (a: Article, b: Article) =>
  b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title)

// --- 記事 -------------------------------------------------------------------

/** 公開済み記事（新しい順） */
export const getArticles = (): Article[] =>
  content()
    .articles.filter((a) => a.status === "published")
    .sort(newestFirst)

/** 下書きも含む全記事（企画一覧・検証用） */
export const getAllArticlesIncludingDrafts = (): Article[] => content().articles

export const getArticle = (slug: string) =>
  getArticles().find((a) => a.slug === slug)

export const getArticlesByIds = (ids: string[]) => pick(getArticles(), ids)

export const getArticlesByCategory = (categoryId: string) =>
  getArticles().filter((a) => a.category === categoryId)

export const getArticlesByTag = (tag: string) =>
  getArticles().filter((a) => a.tags.includes(tag))

export const getTags = (): { name: string; count: number }[] => {
  const counts = new Map<string, number>()
  for (const article of getArticles())
    for (const tag of article.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "ja"))
}

/**
 * 関連記事を算出する。
 * 明示指定（relatedArticleIds）を優先し、残りは共有する人物・テーマ・作品・
 * 神話体系・カテゴリー・タグの重み付きスコアで並べる。
 */
export const getRelatedArticles = (article: Article, limit = 4): Article[] => {
  const explicit = pick(getArticles(), article.relatedArticleIds)
  const overlap = (a: string[], b: string[]) =>
    a.filter((v) => b.includes(v)).length
  const scored = getArticles()
    .filter((a) => a.id !== article.id && !explicit.includes(a))
    .map((a) => ({
      article: a,
      score:
        overlap(a.figureIds, article.figureIds) * 3 +
        overlap(a.storyIds, article.storyIds) * 3 +
        overlap(a.topicIds, article.topicIds) * 2 +
        overlap(a.workIds, article.workIds) * 2 +
        overlap(a.mythologyIds, article.mythologyIds) +
        overlap(a.tags, article.tags) +
        (a.category === article.category ? 1 : 0),
    }))
    .filter((s) => s.score > 0)
    .sort((x, y) => y.score - x.score || newestFirst(x.article, y.article))
    .map((s) => s.article)
  return [...explicit, ...scored].slice(0, limit)
}

// --- カテゴリー ---------------------------------------------------------------

export const getCategories = (): Category[] =>
  [...content().categories].sort((a, b) => a.order - b.order)
export const getCategory = (idOrSlug: string) =>
  getCategories().find((c) => c.id === idOrSlug || c.slug === idOrSlug)

// --- 人物・怪物 ---------------------------------------------------------------

export const getFigures = (): Figure[] =>
  [...content().figures].sort((a, b) =>
    a.reading.localeCompare(b.reading, "ja")
  )
export const getFigure = (slug: string) =>
  getFigures().find((f) => f.slug === slug)
export const getFiguresByIds = (ids: string[]) => pick(getFigures(), ids)

export const getArticlesForFigure = (figure: Figure): Article[] =>
  getArticles().filter(
    (a) => a.figureIds.includes(figure.id) || figure.articleIds.includes(a.id)
  )

/** 関連人物（明示指定 + 同じ物語に登場する人物） */
export const getRelatedFigures = (figure: Figure): Figure[] => {
  const viaStories = content()
    .stories.filter(
      (s) =>
        s.figureIds.includes(figure.id) || figure.relatedStoryIds.includes(s.id)
    )
    .flatMap((s) => s.figureIds)
  return getFiguresByIds(
    uniq([...figure.relatedFigureIds, ...viaStories]).filter(
      (id) => id !== figure.id
    )
  )
}

export const getWorksForFigure = (figure: Figure): Work[] => {
  const workIds = getCharactersForFigure(figure).map((c) => c.workId)
  return getWorks().filter((w) => workIds.includes(w.id))
}

// --- 神話体系 ---------------------------------------------------------------

export const getMythologies = (): Mythology[] =>
  [...content().mythologies].sort((a, b) => a.order - b.order)
export const getMythology = (slug: string) =>
  getMythologies().find((m) => m.slug === slug)
export const getMythologiesByIds = (ids: string[]) =>
  pick(getMythologies(), ids)

export const getArticlesForMythology = (mythology: Mythology) =>
  getArticles().filter((a) => a.mythologyIds.includes(mythology.id))

/** 神話体系に属する人物（明示指定 + figure.mythologyIds） */
export const getFiguresForMythology = (mythology: Mythology): Figure[] => {
  const explicit = getFiguresByIds(mythology.figureIds)
  const rest = getFigures().filter(
    (f) => f.mythologyIds.includes(mythology.id) && !explicit.includes(f)
  )
  return [...explicit, ...rest]
}

export const getStoriesForMythology = (mythology: Mythology): Story[] => {
  const all = content().stories
  return uniq([
    ...pick(all, mythology.storyIds),
    ...all.filter((s) => s.mythologyIds.includes(mythology.id)),
  ])
}

// --- 物語 -------------------------------------------------------------------

export const getStoriesByIds = (ids: string[]) => pick(content().stories, ids)
export const getStoriesForFigure = (figure: Figure): Story[] =>
  uniq([
    ...pick(content().stories, figure.relatedStoryIds),
    ...content().stories.filter((s) => s.figureIds.includes(figure.id)),
  ])

// --- 作品 -------------------------------------------------------------------

export const getWorks = (): Work[] =>
  [...content().works].sort((a, b) =>
    (a.reading ?? a.title).localeCompare(b.reading ?? b.title, "ja")
  )
export const getWork = (slug: string) => getWorks().find((w) => w.slug === slug)
export const getWorksByIds = (ids: string[]) => pick(getWorks(), ids)

export const getArticlesForWork = (work: Work) =>
  getArticles().filter(
    (a) => a.workIds.includes(work.id) || work.articleIds.includes(a.id)
  )

// --- テーマ -----------------------------------------------------------------

export const getTopics = (): Topic[] =>
  [...content().topics].sort((a, b) => a.order - b.order)
export const getTopic = (slug: string) =>
  getTopics().find((t) => t.slug === slug)
export const getTopicsByIds = (ids: string[]) => pick(getTopics(), ids)

export const getArticlesForTopic = (topic: Topic) =>
  getArticles().filter((a) => a.topicIds.includes(topic.id))

/** テーマに関連する人物（明示指定 + テーマ記事に登場する人物） */
export const getFiguresForTopic = (topic: Topic): Figure[] =>
  getFiguresByIds(
    uniq([
      ...topic.figureIds,
      ...getArticlesForTopic(topic).flatMap((a) => a.figureIds),
    ])
  )

export const getStoriesForTopic = (topic: Topic): Story[] =>
  uniq([
    ...pick(content().stories, topic.storyIds),
    ...pick(
      content().stories,
      getArticlesForTopic(topic).flatMap((a) => a.storyIds)
    ),
  ])

// --- 出典・画像 ---------------------------------------------------------------

export const getSources = (): Source[] => content().sources
export const getSource = (id: string) => byId(content().sources, id)
export const getSourcesByIds = (ids: string[]) => pick(content().sources, ids)

/** 出典を参照している公開記事 */
export const getArticlesForSource = (source: Source) =>
  getArticles().filter((a) => a.sourceIds.includes(source.id))

export const getImage = (id: string | undefined): Image | undefined =>
  id ? byId(content().images, id) : undefined

// --- トップページ --------------------------------------------------------------

export const getFeaturedArticles = (limit = 3): Article[] => {
  const configured = getArticlesByIds(content().home.featuredArticleIds)
  const flagged = getArticles().filter(
    (a) => a.featured && !configured.includes(a)
  )
  return [...configured, ...flagged].slice(0, limit)
}

export const getPopularArticles = (limit = 5): Article[] =>
  getArticlesByIds(content().home.popularArticleIds).slice(0, limit)

// --- キャラクター --------------------------------------------------------------

export const getCharacters = (): Character[] =>
  [...content().characters].sort((a, b) =>
    (a.reading ?? a.name).localeCompare(b.reading ?? b.name, "ja")
  )
export const getCharacter = (slug: string) =>
  getCharacters().find((c) => c.slug === slug)
export const getCharactersByIds = (ids: string[]) => pick(getCharacters(), ids)

export const getCharactersForWork = (work: Work): Character[] =>
  getCharacters().filter((c) => c.workId === work.id)

/** その人物・怪物をモチーフ（元ネタ）にしたキャラクター */
export const getCharactersForFigure = (figure: Figure): Character[] =>
  getCharacters().filter((c) => c.motifs.some((m) => m.figureId === figure.id))

/**
 * 人物・怪物ページを検索エンジンにインデックスさせるか。
 * 関連記事・本文・元ネタとして参照するキャラクターのいずれもないページは
 * 薄いコンテンツになりやすいため noindex にし、サイトマップからも除く。
 */
export const isFigureIndexable = (figure: Figure): boolean =>
  getArticlesForFigure(figure).length > 0 ||
  figure.body.length > 0 ||
  getCharactersForFigure(figure).length > 0

/** キャラクターの元ネタとなった人物・怪物（主な元ネタ順） */
export const getMotifFigures = (character: Character): Figure[] =>
  getFiguresByIds(
    uniq(character.motifs.flatMap((m) => (m.figureId ? [m.figureId] : [])))
  )

/** キャラクターを直接扱う記事 */
export const getArticlesForCharacter = (character: Character): Article[] =>
  getArticles().filter(
    (a) =>
      a.characterIds.includes(character.id) ||
      character.articleIds.includes(a.id)
  )

/** 元ネタ（モチーフの人物・怪物）を解説する記事 */
export const getOriginArticlesForCharacter = (
  character: Character
): Article[] => {
  const figureIds = getMotifFigures(character).map((f) => f.id)
  const direct = getArticlesForCharacter(character)
  return getArticles().filter(
    (a) =>
      !direct.includes(a) && a.figureIds.some((id) => figureIds.includes(id))
  )
}

/**
 * 記事に関係するキャラクター。
 * 記事の characterIds で明示したもの＋記事の主題（figureIds の先頭）をモチーフにしたもの。
 */
export const getCharactersForArticle = (article: Article): Character[] => {
  const explicit = getCharactersByIds(article.characterIds)
  const subject = article.figureIds[0]
  const viaFigure = getCharacters().filter(
    (c) =>
      !explicit.includes(c) &&
      (c.articleIds.includes(article.id) ||
        (subject !== undefined && c.motifs.some((m) => m.figureId === subject)))
  )
  return [...explicit, ...viaFigure]
}

/** 同じ人物・怪物を元ネタにした、ほかのキャラクター */
export const getCharactersWithSameMotif = (
  character: Character
): Character[] => {
  const figureIds = getMotifFigures(character).map((f) => f.id)
  return getCharacters().filter(
    (c) =>
      c.id !== character.id &&
      c.motifs.some((m) => m.figureId && figureIds.includes(m.figureId))
  )
}
