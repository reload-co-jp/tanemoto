import { entryKinds, type Character, type EntryKind } from "./content/schema"

/** 種類の表示名（キャラクター・設定・事件） */
export const kindLabel = (entry: Pick<Character, "kind">) =>
  entryKinds[entry.kind].label

/** 一覧に含まれる種類を「キャラクター・設定」のようにまとめた表示名 */
export const kindsLabel = (entries: Pick<Character, "kind">[]) => {
  const kinds = (Object.keys(entryKinds) as EntryKind[]).filter((k) =>
    entries.some((e) => e.kind === k)
  )
  return (kinds.length > 0 ? kinds : (["character"] as EntryKind[]))
    .map((k) => entryKinds[k].label)
    .join("・")
}

/** 種類ごとにまとめる（キャラクター → 設定 → 事件 の順。空の種類は除く） */
export const groupByKind = <T extends Pick<Character, "kind">>(entries: T[]) =>
  (Object.keys(entryKinds) as EntryKind[])
    .map((kind) => ({
      kind,
      ...entryKinds[kind],
      entries: entries.filter((e) => e.kind === kind),
    }))
    .filter((g) => g.entries.length > 0)
