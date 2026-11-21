import { describe, expect, it } from "vitest"
import { metaDescription } from "../seo"

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
