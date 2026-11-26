/**
 * コンテンツ検証スクリプト
 *   pnpm validate
 *
 * - JSON の構文・スキーマ（必須項目・型）
 * - 存在しない関連ID
 * - 出典のない主要な主張（fact / scholarship / variant）
 * - 公開記事に含まれる未検証の主張
 * などを検出する。エラーがある場合は終了コード 1 を返す（prebuild でも実行）。
 */
import { readContent } from "../lib/content/load"
import { publicFileExists } from "../lib/content/repository"
import { validateContent } from "../lib/content/validate"

const { data, issues } = readContent()
const all = [
  ...issues,
  ...validateContent(data, { fileExists: publicFileExists }),
]
const errors = all.filter((i) => i.level === "error")
const warnings = all.filter((i) => i.level === "warning")

const published = data.articles.filter((a) => a.status === "published").length
const drafts = data.articles.length - published

console.log("タネトモ コンテンツ検証")
console.log(
  `  記事 ${data.articles.length}件（公開 ${published} / 下書き ${drafts}）` +
    ` 人物・怪物 ${data.figures.length} 神話 ${data.mythologies.length}` +
    ` 作品 ${data.works.length} キャラクター・設定・事件 ${data.characters.length} テーマ ${data.topics.length}` +
    ` 出典 ${data.sources.length} 主張 ${[...data.articles, ...data.characters].reduce((n, a) => n + a.claims.length, 0)}`
)

const print = (label: string, list: typeof all) => {
  if (list.length === 0) return
  console.log(`\n${label} (${list.length})`)
  for (const issue of list) console.log(`  ${issue.file}: ${issue.message}`)
}
print("⚠ 警告", warnings)
print("✖ エラー", errors)

if (errors.length > 0) {
  console.error(`\n検証に失敗しました（エラー ${errors.length}件）`)
  process.exit(1)
}
console.log("\n✔ 検証に成功しました")
