import type { Article } from "@/lib/content/schema"
import {
  getCategory,
  getFiguresByIds,
  getImage,
} from "@/lib/content/repository"

/** 記事のアイキャッチに使う画像・テキストを決める */
export const articleVisual = (article: Article) => {
  const figure = getFiguresByIds(article.figureIds)[0]
  const category = getCategory(article.category)
  return {
    image: getImage(article.thumbnail),
    word:
      article.eyecatchText ??
      figure?.name ??
      article.shortTitle ??
      article.title,
    eyebrow: figure?.romanized ?? category?.nameEn,
  }
}
