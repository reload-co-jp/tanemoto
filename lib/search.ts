import type { SearchEntry } from "./searchIndex"

/**
 * 検索用の正規化：全角英数→半角、カタカナ→ひらがな、小文字化、
 * 長音・中黒・空白の除去（「メドゥーサ」「メドゥサ」などの表記ゆれ対策）
 */
export const normalize = (text: string) =>
  text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .replace(/[ー－‐・\s]/g, "")

export type SearchResult = SearchEntry & { score: number }

/** スペース区切りのAND検索。タイトル・別名・タグ・本文の順に重み付けする */
export const search = (
  entries: SearchEntry[],
  query: string
): SearchResult[] => {
  const terms = query
    .split(/[\s\u3000]+/)
    .map(normalize)
    .filter(Boolean)
  if (terms.length === 0) return []
  const kindBonus: Record<SearchEntry["kind"], number> = {
    figure: 2,
    mythology: 2,
    work: 2,
    topic: 1,
    article: 0,
  }
  return entries
    .map((entry) => {
      const title = normalize(entry.title)
      const keywords = entry.keywords.map(normalize)
      const description = normalize(entry.description)
      const body = normalize(entry.body)
      let score = 0
      for (const term of terms) {
        let s = 0
        if (title === term) s += 30
        if (title.includes(term)) s += 12
        if (keywords.some((k) => k === term)) s += 10
        else if (keywords.some((k) => k.includes(term))) s += 6
        if (description.includes(term)) s += 4
        if (body.includes(term)) s += Math.min(5, body.split(term).length - 1)
        if (s === 0) return { ...entry, score: 0 }
        score += s
      }
      return { ...entry, score: score + kindBonus[entry.kind] }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
}

/** 本文中の一致箇所の前後を抜き出す */
export const excerpt = (
  text: string,
  query: string,
  length = 80
): string | null => {
  const term = query.split(/[\s\u3000]+/).filter(Boolean)[0]
  if (!term || !text) return null
  const index = text.toLowerCase().indexOf(term.toLowerCase())
  if (index < 0) return null
  const start = Math.max(0, index - Math.floor((length - term.length) / 2))
  return `${start > 0 ? "…" : ""}${text.slice(start, start + length)}${start + length < text.length ? "…" : ""}`
}
