import { describe, expect, it } from "vitest"
import { buildToc, parseInline, stripInline } from "../content/text"
import { css } from "../styles/css"
import { excerpt, normalize, search } from "../search"
import type { SearchEntry } from "../searchIndex"

describe("parseInline", () => {
  it("parses strong and links", () => {
    expect(parseInline("a **b** [c](/d/) e")).toEqual([
      { type: "text", value: "a " },
      { type: "strong", value: "b" },
      { type: "text", value: " " },
      { type: "link", value: "c", href: "/d/" },
      { type: "text", value: " e" },
    ])
    expect(stripInline("**強調**と[リンク](/x/)")).toBe("強調とリンク")
  })
})

describe("buildToc", () => {
  it("uses explicit anchors or numbered fallbacks", () => {
    expect(
      buildToc([
        { type: "heading", level: 2, text: "一", anchor: "one" },
        { type: "paragraph", text: "p", claimIds: [] },
        { type: "heading", level: 3, text: "二" },
      ])
    ).toEqual([
      { id: "one", text: "一", level: 2 },
      { id: "section-2", text: "二", level: 3 },
    ])
  })
})

describe("search", () => {
  const entries: SearchEntry[] = [
    {
      kind: "figure",
      title: "メデューサ",
      label: "怪物",
      href: "/figures/medusa/",
      description: "ゴルゴン",
      keywords: ["メドゥーサ"],
      body: "",
    },
    {
      kind: "article",
      title: "ハデスとは",
      label: "記事",
      href: "/articles/hades/",
      description: "冥界の王",
      keywords: ["冥界"],
      body: "ハデスはメデューサとは関係ない",
    },
  ]

  it("normalizes katakana, width and long vowels", () => {
    expect(normalize("メドゥーサ")).toBe(normalize("めどぅさ"))
    expect(normalize("ＡＢＣ")).toBe("abc")
  })

  it("ranks title matches first and supports alternative names", () => {
    expect(search(entries, "メデューサ").map((r) => r.href)).toEqual([
      "/figures/medusa/",
      "/articles/hades/",
    ])
    expect(search(entries, "めどぅさ")[0].href).toBe("/figures/medusa/")
    expect(search(entries, "冥界 ハデス")).toHaveLength(1)
    expect(search(entries, "")).toEqual([])
  })

  it("builds excerpts", () => {
    expect(excerpt("あいうえおかきくけこ", "かき", 4)).toBe("…おかきく…")
  })
})

describe("css", () => {
  it("minifies and interpolates", () => {
    expect(css`
      .a {
        color: ${"red"};
      }
    `).toBe(".a{color:red;}")
  })
})
