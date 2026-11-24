import type { Tile } from "@/components/common/PageParts"
import { motifAspects, type Character } from "./content/schema"
import { getWorksByIds } from "./content/repository"
import { kindLabel } from "./entryKind"
import { paths } from "./site"

/** キャラクター・設定・事件の一覧用タイル（「元ネタ：〜」を主役にする） */
export const characterTile = (character: Character): Tile => {
  const work = getWorksByIds([character.workId])[0]
  const [main, ...rest] = character.motifs
  const workLabel = work ? `『${work.title}』` : undefined
  return {
    href: paths.character(character.slug),
    title: character.name,
    eyebrow:
      character.kind === "character"
        ? workLabel
        : [workLabel, kindLabel(character)].filter(Boolean).join(" ・ "),
    description: `元ネタ：${main.label}${rest.length > 0 ? ` ほか${rest.length}件` : ""}`,
    meta: [
      ...new Set(character.motifs.map((m) => motifAspects[m.aspect])),
    ].join("・"),
  }
}
