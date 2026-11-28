import { describe, expect, it } from "vitest"
import { buildMetadata, licenseUrl, metaDescription } from "../seo"

describe("metaDescription", () => {
  it("上限以内ならそのまま返す", () => {
    expect(metaDescription("短い説明。", 120)).toBe("短い説明。")
  })
  it("上限を超えると上限内の最後の句点で切る", () => {
    const text = `${"あ".repeat(70)}。${"い".repeat(70)}。`
    expect(metaDescription(text, 120)).toBe(`${"あ".repeat(70)}。`)
  })
  it("句点が前半にしかなければ末尾を省略記号にする", () => {
    const text = `あ。${"い".repeat(200)}`
    const out = metaDescription(text, 120)
    expect(out).toHaveLength(120)
    expect(out.endsWith("…")).toBe(true)
  })
})

describe("licenseUrl", () => {
  it("Public domain は PD Mark の URL にする", () => {
    expect(licenseUrl("Public domain")).toBe(
      "https://creativecommons.org/publicdomain/mark/1.0/"
    )
  })
  it("CC0 は CC0 1.0 の URL にする", () => {
    expect(licenseUrl("CC0")).toBe(
      "https://creativecommons.org/publicdomain/zero/1.0/"
    )
  })
  it("CC ライセンスはバージョン・移植版つきの URL にする", () => {
    expect(licenseUrl("CC BY-SA 4.0")).toBe(
      "https://creativecommons.org/licenses/by-sa/4.0/"
    )
    expect(licenseUrl("CC BY-SA 3.0 fr")).toBe(
      "https://creativecommons.org/licenses/by-sa/3.0/fr/"
    )
  })
  it("解釈できない表記は undefined", () => {
    expect(licenseUrl("独自ライセンス")).toBeUndefined()
  })
})

describe("buildMetadata", () => {
  it("画像を渡すと実寸と alt を OGP に出す", () => {
    const meta = buildMetadata({
      path: "/figures/zeus/",
      image: {
        id: "zeus",
        src: "/images/figures/zeus.webp",
        width: 800,
        height: 1000,
        alt: "ゼウス像",
        source: "s",
        sourceUrl: "",
        author: "a",
        license: "Public domain",
        credit: "c",
        aiGenerated: false,
      },
    })
    expect(meta.openGraph?.images).toEqual([
      {
        url: "https://tanetomo.reload.co.jp/images/figures/zeus.webp",
        width: 800,
        height: 1000,
        alt: "ゼウス像",
      },
    ])
  })
  it("画像を省略すると既定の OGP 画像（1200×630）を使う", () => {
    const meta = buildMetadata({ path: "/" })
    expect(meta.openGraph?.images).toEqual([
      {
        url: "https://tanetomo.reload.co.jp/og-default.jpg",
        width: 1200,
        height: 630,
      },
    ])
  })
})
