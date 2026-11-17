import type { Figure } from "./content/schema"
import { figureTypes } from "./content/schema"
import { getArticlesForFigure } from "./content/repository"
import { paths } from "./site"
import type { Tile } from "@/components/common/PageParts"

export const figureTile = (figure: Figure): Tile => {
  const count = getArticlesForFigure(figure).length
  return {
    href: paths.figure(figure.slug),
    title: figure.name,
    eyebrow: `${figureTypes[figure.type]}${figure.romanized ? ` · ${figure.romanized}` : ""}`,
    description: figure.description,
    meta: count > 0 ? `関連記事 ${count}件` : undefined,
  }
}
