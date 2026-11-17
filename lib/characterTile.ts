import type { Tile } from "@/components/common/PageParts"
import { motifAspects, type Character } from "./content/schema"
import { getWorksByIds } from "./content/repository"
import { paths } from "./site"

/** キャラクター一覧用のタイル（「元ネタ：〜」を主役にする） */
export const characterTile = (character: Character): Tile => {
  const work = getWorksByIds([character.workId])[0]
  const [main, ...rest] = character.motifs
  return {
    href: paths.character(character.slug),
    title: character.name,
    eyebrow: work ? `『${work.title}』` : undefined,
    description: `元ネタ：${main.label}${rest.length > 0 ? ` ほか${rest.length}件` : ""}`,
    meta: [
      ...new Set(character.motifs.map((m) => motifAspects[m.aspect])),
    ].join("・"),
  }
}
