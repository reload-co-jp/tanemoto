import type { Block } from "./schema"

/**
 * 本文テキスト内で使えるインライン記法
 *   **強調**            → <strong>
 *   [テキスト](URL)     → リンク（/ から始まる場合は内部リンク）
 *   『作品名』などはそのまま表示
 */
export type InlineNode =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "link"; value: string; href: string }

const INLINE_PATTERN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g

export const parseInline = (text: string): InlineNode[] => {
  const nodes: InlineNode[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0
    if (index > last)
      nodes.push({ type: "text", value: text.slice(last, index) })
    if (match[1] !== undefined) nodes.push({ type: "strong", value: match[1] })
    else nodes.push({ type: "link", value: match[2], href: match[3] })
    last = index + match[0].length
  }
  if (last < text.length) nodes.push({ type: "text", value: text.slice(last) })
  return nodes
}

/** インライン記法を取り除いたプレーンテキスト */
export const stripInline = (text: string): string =>
  parseInline(text)
    .map((n) => n.value)
    .join("")

export type TocItem = { id: string; text: string; level: 2 | 3 }

/** 見出しブロックのアンカーIDを決定する（未指定なら連番） */
export const headingAnchors = (blocks: Block[]): Map<number, string> => {
  const map = new Map<number, string>()
  let n = 0
  blocks.forEach((block, i) => {
    if (block.type !== "heading") return
    n += 1
    map.set(i, block.anchor ?? `section-${n}`)
  })
  return map
}

export const buildToc = (blocks: Block[]): TocItem[] => {
  const anchors = headingAnchors(blocks)
  return blocks.flatMap((block, i) =>
    block.type === "heading"
      ? [
          {
            id: anchors.get(i)!,
            text: stripInline(block.text),
            level: block.level,
          },
        ]
      : []
  )
}

/** 本文ブロックをプレーンテキスト化（検索インデックス・文字数計算用） */
export const blocksToPlainText = (blocks: Block[]): string =>
  blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
        case "quote":
          return stripInline(block.text)
        case "note":
          return [block.title ?? "", stripInline(block.text)].join(" ")
        case "list":
          return block.items.map(stripInline).join(" ")
        case "image":
          return block.caption ?? ""
      }
    })
    .join("\n")
    .trim()

/** 日本語の読了時間（目安: 1分あたり500字） */
export const readingMinutes = (blocks: Block[]): number =>
  Math.max(1, Math.round(blocksToPlainText(blocks).length / 500))
