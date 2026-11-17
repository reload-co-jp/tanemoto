import type { MetadataRoute } from "next"
import {
  getArticles,
  getArticlesForFigure,
  getArticlesForTopic,
  getArticlesForWork,
  getCategories,
  getCharacters,
  getCharactersForWork,
  getArticlesByCategory,
  getFigures,
  getMythologies,
  getTopics,
  getWorks,
} from "@/lib/content/repository"
import { paginate } from "@/components/article/ArticlesIndex"
import { absoluteUrl, paths } from "@/lib/site"

export const dynamic = "force-static"

/** XMLサイトマップ。noindex のページ（検索・タグ・関連記事のない詳細ページ）は含めない */
const sitemap = (): MetadataRoute.Sitemap => {
  const articles = getArticles()
  const latest = articles
    .map((a) => a.updatedAt)
    .sort()
    .at(-1)
  const entry = (path: string, lastModified?: string, priority = 0.5) => ({
    url: absoluteUrl(path),
    lastModified,
    priority,
  })
  const { total } = paginate(articles, 1)
  return [
    entry(paths.home(), latest, 1),
    entry(paths.articles(), latest, 0.8),
    ...Array.from({ length: total - 1 }, (_, i) =>
      entry(paths.articlesPage(i + 2), latest, 0.3)
    ),
    ...articles.map((a) => entry(paths.article(a.slug), a.updatedAt, 0.9)),
    ...getCategories()
      .filter((c) => getArticlesByCategory(c.id).length > 0)
      .map((c) => entry(paths.category(c.slug), latest, 0.6)),
    entry(paths.mythologies(), latest, 0.6),
    ...getMythologies()
      .filter((m) => !m.comingSoon)
      .map((m) => entry(paths.mythology(m.slug), latest, 0.7)),
    entry(paths.figures(), latest, 0.6),
    ...getFigures()
      .filter((f) => getArticlesForFigure(f).length > 0 || f.body.length > 0)
      .map((f) => entry(paths.figure(f.slug), latest, 0.6)),
    entry(paths.topics(), latest, 0.5),
    ...getTopics()
      .filter((t) => getArticlesForTopic(t).length > 0)
      .map((t) => entry(paths.topic(t.slug), latest, 0.5)),
    entry(paths.characters(), latest, 0.8),
    entry(paths.origins(), latest, 0.7),
    ...getCharacters().map((c) => entry(paths.character(c.slug), latest, 0.8)),
    entry(paths.works(), latest, 0.6),
    ...getWorks()
      .filter(
        (w) =>
          getCharactersForWork(w).length > 0 || getArticlesForWork(w).length > 0
      )
      .map((w) => entry(paths.work(w.slug), latest, 0.5)),
    entry(paths.about(), undefined, 0.2),
    entry(paths.editorialPolicy(), undefined, 0.3),
    entry(paths.references(), latest, 0.3),
  ]
}

export default sitemap
