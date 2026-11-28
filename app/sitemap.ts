import type { MetadataRoute } from "next"
import {
  getArticles,
  getArticlesForTopic,
  getArticlesForWork,
  getCategories,
  getCharacters,
  getCharactersForWork,
  getArticlesByCategory,
  getFigures,
  getImage,
  getMythologies,
  getTopics,
  getWorks,
  isFigureIndexable,
} from "@/lib/content/repository"
import { paginate } from "@/components/article/ArticlesIndex"
import type { Article } from "@/lib/content/schema"
import { absoluteUrl, paths } from "@/lib/site"

export const dynamic = "force-static"

/** 記事群の最終更新日 */
const lastUpdated = (articles: Article[]) =>
  articles
    .map((a) => a.updatedAt)
    .sort()
    .at(-1)

/** 画像 ID → 画像の絶対 URL（画像サイトマップ用） */
const imageUrls = (ids: (string | undefined)[]) =>
  ids.flatMap((id) => {
    const image = getImage(id)
    return image ? [absoluteUrl(image.src)] : []
  })

/**
 * XMLサイトマップ。noindex のページ（検索・タグ・関連記事のない詳細ページ）は含めない。
 * lastmod は正確な日付がわかるページ（記事と、記事を一覧するページ）にだけ付ける。
 * 更新日を持たない人物・キャラクター・作品ページに記事の日付を流用すると
 * 実際の更新と食い違い、検索エンジンに lastmod 全体を信用されなくなるため。
 */
const sitemap = (): MetadataRoute.Sitemap => {
  const articles = getArticles()
  const latest = lastUpdated(articles)
  const entry = (
    path: string,
    lastModified?: string,
    priority = 0.5,
    images: string[] = []
  ) => ({
    url: absoluteUrl(path),
    lastModified,
    priority,
    ...(images.length > 0 ? { images } : {}),
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
      .map((c) =>
        entry(
          paths.category(c.slug),
          lastUpdated(getArticlesByCategory(c.id)),
          0.6
        )
      ),
    entry(paths.mythologies(), undefined, 0.6),
    ...getMythologies()
      .filter((m) => !m.comingSoon)
      .map((m) => entry(paths.mythology(m.slug), undefined, 0.7)),
    entry(paths.figures(), undefined, 0.6),
    ...getFigures()
      .filter(isFigureIndexable)
      .map((f) =>
        entry(paths.figure(f.slug), undefined, 0.6, imageUrls([f.imageId]))
      ),
    entry(paths.topics(), latest, 0.5),
    ...getTopics()
      .filter((t) => getArticlesForTopic(t).length > 0)
      .map((t) =>
        entry(paths.topic(t.slug), lastUpdated(getArticlesForTopic(t)), 0.5)
      ),
    entry(paths.characters(), undefined, 0.8),
    entry(paths.origins(), undefined, 0.7),
    ...getCharacters().map((c) =>
      entry(paths.character(c.slug), undefined, 0.8, imageUrls([c.imageId]))
    ),
    entry(paths.works(), undefined, 0.6),
    ...getWorks()
      .filter(
        (w) =>
          getCharactersForWork(w).length > 0 || getArticlesForWork(w).length > 0
      )
      .map((w) =>
        entry(paths.work(w.slug), undefined, 0.5, imageUrls(w.imageIds))
      ),
    entry(paths.about(), undefined, 0.2),
    entry(paths.editorialPolicy(), undefined, 0.3),
    entry(paths.references(), undefined, 0.3),
  ]
}

export default sitemap
