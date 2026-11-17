import fs from "node:fs"
import path from "node:path"
import { ZodType } from "zod"
import {
  articleSchema,
  categorySchema,
  characterSchema,
  figureSchema,
  homeSchema,
  imageSchema,
  mythologySchema,
  sourceSchema,
  storySchema,
  topicSchema,
  workSchema,
} from "./schema"
import type { ContentData, ValidationIssue } from "./validate"

export const CONTENT_DIR = path.join(process.cwd(), "content")

/** コレクション名とディレクトリ・スキーマの対応 */
export const collections = {
  articles: articleSchema,
  figures: figureSchema,
  mythologies: mythologySchema,
  stories: storySchema,
  works: workSchema,
  characters: characterSchema,
  topics: topicSchema,
  categories: categorySchema,
  sources: sourceSchema,
  images: imageSchema,
} as const

type CollectionName = keyof typeof collections

const listJsonFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) return listJsonFiles(full)
      return entry.name.endsWith(".json") ? [full] : []
    })
    .sort()
}

const readCollection = <T>(
  name: CollectionName,
  schema: ZodType<T>,
  baseDir: string,
  issues: ValidationIssue[]
): T[] => {
  const dir = path.join(baseDir, name)
  const items: T[] = []
  for (const file of listJsonFiles(dir)) {
    const rel = path.relative(baseDir, file)
    let json: unknown
    try {
      json = JSON.parse(fs.readFileSync(file, "utf8"))
    } catch (e) {
      issues.push({
        level: "error",
        file: rel,
        message: `JSON の構文エラー: ${(e as Error).message}`,
      })
      continue
    }
    // 1ファイルに1件（オブジェクト）または複数件（配列）を記述できる
    const entries = Array.isArray(json) ? json : [json]
    entries.forEach((entry, index) => {
      const result = schema.safeParse(entry)
      if (!result.success) {
        for (const issue of result.error.issues) {
          issues.push({
            level: "error",
            file: rel,
            message: `${Array.isArray(json) ? `[${index}].` : ""}${issue.path.join(".")}: ${issue.message}`,
          })
        }
        return
      }
      const value = result.data as T & { slug?: string }
      // 1ファイル1件の場合、ファイル名と slug を一致させる（URL の永続性のため）
      if (
        !Array.isArray(json) &&
        typeof value.slug === "string" &&
        path.basename(file, ".json") !== value.slug
      ) {
        issues.push({
          level: "error",
          file: rel,
          message: `ファイル名と slug が一致しません（slug: ${value.slug}）`,
        })
      }
      items.push(Object.assign(value, { __file: rel }))
    })
  }
  return items
}

/** content/ ディレクトリから全データを読み込み、スキーマ検証する */
export const readContent = (
  baseDir: string = CONTENT_DIR
): { data: ContentData; issues: ValidationIssue[] } => {
  const issues: ValidationIssue[] = []
  const read = <K extends CollectionName>(name: K) =>
    readCollection(name, collections[name] as ZodType, baseDir, issues)

  let home = {
    featuredArticleIds: [],
    popularArticleIds: [],
  } as ContentData["home"]
  const homeFile = path.join(baseDir, "home.json")
  if (fs.existsSync(homeFile)) {
    const result = homeSchema.safeParse(
      JSON.parse(fs.readFileSync(homeFile, "utf8"))
    )
    if (result.success) home = result.data
    else
      result.error.issues.forEach((issue) =>
        issues.push({
          level: "error",
          file: "home.json",
          message: `${issue.path.join(".")}: ${issue.message}`,
        })
      )
  }

  const data: ContentData = {
    articles: read("articles"),
    figures: read("figures"),
    mythologies: read("mythologies"),
    stories: read("stories"),
    works: read("works"),
    characters: read("characters"),
    topics: read("topics"),
    categories: read("categories"),
    sources: read("sources"),
    images: read("images"),
    home,
  } as ContentData
  return { data, issues }
}
