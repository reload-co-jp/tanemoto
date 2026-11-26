import { describe, expect, it } from "vitest"
import { readContent } from "../content/load"
import { articleSchema, characterSchema, sourceSchema } from "../content/schema"
import { ContentData, validateContent } from "../content/validate"

const source = sourceSchema.parse({
  id: "theogony",
  title: "神統記",
  author: "ヘシオドス",
  type: "primary",
  publishedPeriod: "古代ギリシャ",
})

const baseArticle = (overrides: Record<string, unknown> = {}) =>
  articleSchema.parse({
    id: "medusa-origin",
    slug: "medusa-origin",
    title: "メデューサとは何者か？",
    description: "説明",
    category: "monsters",
    publishedAt: "2026-11-20",
    updatedAt: "2026-11-20",
    status: "published",
    sourceIds: ["theogony"],
    body: [
      { type: "heading", level: 2, text: "見出し" },
      { type: "paragraph", text: "本文", claimIds: ["claim-1"] },
    ],
    claims: [
      {
        id: "claim-1",
        text: "メデューサはゴルゴンの一人である。",
        classification: "fact",
        sourceIds: ["theogony"],
        sourceLocation: "276-286",
        verificationStatus: "verified",
      },
    ],
    ...overrides,
  })

const data = (overrides: Partial<ContentData> = {}): ContentData => ({
  articles: [baseArticle()],
  figures: [],
  mythologies: [],
  stories: [],
  works: [],
  characters: [],
  topics: [],
  categories: [
    {
      id: "monsters",
      slug: "monsters",
      name: "怪物",
      description: "d",
      order: 1,
    },
  ],
  sources: [source],
  images: [],
  home: { featuredArticleIds: [], popularArticleIds: [] },
  ...overrides,
})

const errors = (d: ContentData) =>
  validateContent(d)
    .filter((i) => i.level === "error")
    .map((i) => i.message)

describe("validateContent", () => {
  it("passes valid content", () => {
    expect(errors(data())).toEqual([])
  })

  it("detects missing related IDs", () => {
    const result = errors(
      data({ articles: [baseArticle({ figureIds: ["nobody"] })] })
    )
    expect(result.some((m) => m.includes("nobody"))).toBe(true)
  })

  it("detects a fact claim without sources", () => {
    const article = baseArticle({
      claims: [
        {
          id: "claim-1",
          text: "x",
          classification: "fact",
          sourceIds: [],
          verificationStatus: "verified",
        },
      ],
    })
    expect(
      errors(data({ articles: [article] })).some((m) =>
        m.includes("出典がありません")
      )
    ).toBe(true)
  })

  it("rejects unverified claims in published articles but allows them in drafts", () => {
    const claims = [
      {
        id: "claim-1",
        text: "x",
        classification: "fact",
        sourceIds: ["theogony"],
        sourceLocation: "1",
        verificationStatus: "unverified",
      },
    ]
    expect(
      errors(data({ articles: [baseArticle({ claims })] })).length
    ).toBeGreaterThan(0)
    expect(
      errors(data({ articles: [baseArticle({ claims, status: "draft" })] }))
    ).toEqual([])
  })

  it("detects body references to unknown claims", () => {
    const article = baseArticle({
      body: [
        { type: "heading", level: 2, text: "h" },
        { type: "paragraph", text: "p", claimIds: ["missing"] },
      ],
    })
    expect(
      errors(data({ articles: [article] })).some((m) => m.includes("missing"))
    ).toBe(true)
  })

  it("requires claim sources to be listed on the article", () => {
    const article = baseArticle({ sourceIds: [] })
    expect(
      errors(data({ articles: [article] })).some((m) =>
        m.includes("sourceIds に含まれていません")
      )
    ).toBe(true)
  })

  it("rejects reserved slugs and duplicate ids", () => {
    const a = baseArticle({ id: "page", slug: "page" })
    const result = errors(data({ articles: [a, a] }))
    expect(result.some((m) => m.includes("予約語"))).toBe(true)
    expect(result.some((m) => m.includes("重複"))).toBe(true)
  })
})

describe("validateContent: characters", () => {
  const work = {
    id: "w",
    slug: "w",
    title: "作品",
    type: "manga" as const,
    mediaTypes: [],
    author: "作者",
    description: "d",
    highlights: [],
    imageIds: [],
    mythologyIds: [],
    articleIds: [],
    sourceIds: [],
  }
  const character = (overrides: Record<string, unknown> = {}) =>
    characterSchema.parse({
      id: "c",
      slug: "c",
      name: "キャラ",
      workId: "w",
      description: { text: "作中の設定", claimIds: ["c-work"] },
      motifs: [
        {
          aspect: "name",
          label: "メデューサ",
          inWork: { text: "作品では", claimIds: ["c-work"] },
          inMyth: { text: "原典では", claimIds: ["c-myth"] },
        },
      ],
      claims: [
        {
          id: "c-work",
          text: "w",
          classification: "creative",
          sourceIds: [],
          verificationStatus: "verified",
        },
        {
          id: "c-myth",
          text: "m",
          classification: "fact",
          sourceIds: ["theogony"],
          sourceLocation: "1",
          verificationStatus: "verified",
        },
      ],
      sourceIds: ["theogony"],
      ...overrides,
    })

  it("passes a valid character", () => {
    expect(errors(data({ works: [work], characters: [character()] }))).toEqual(
      []
    )
  })

  it("requires a sourced claim for the myth side of a motif", () => {
    const c = character({
      motifs: [
        {
          aspect: "name",
          label: "メデューサ",
          inWork: { text: "作品では", claimIds: ["c-work"] },
          inMyth: { text: "原典では", claimIds: ["c-work"] },
        },
      ],
    })
    expect(
      errors(data({ works: [work], characters: [c] })).some((m) =>
        m.includes("原典の説明")
      )
    ).toBe(true)
  })

  it("detects unknown works and motif figures", () => {
    const c = character({
      workId: "missing",
      motifs: [
        {
          aspect: "name",
          figureId: "nobody",
          label: "x",
          inWork: { text: "作品では", claimIds: ["c-work"] },
        },
      ],
    })
    const result = errors(data({ works: [work], characters: [c] }))
    expect(result.some((m) => m.includes("missing"))).toBe(true)
    expect(result.some((m) => m.includes("nobody"))).toBe(true)
  })
})

describe("repository content", () => {
  it("the content directory passes validation", () => {
    const { data: content, issues } = readContent()
    const all = [...issues, ...validateContent(content)]
    expect(all.filter((i) => i.level === "error")).toEqual([])
  })
})
