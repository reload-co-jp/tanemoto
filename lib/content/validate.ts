import type {
  Article,
  Block,
  Category,
  Character,
  Claim,
  Figure,
  Home,
  Image,
  Mythology,
  Source,
  Story,
  Topic,
  Work,
} from "./schema"

export type WithFile<T> = T & { __file?: string }

export type ContentData = {
  articles: WithFile<Article>[]
  figures: WithFile<Figure>[]
  mythologies: WithFile<Mythology>[]
  stories: WithFile<Story>[]
  works: WithFile<Work>[]
  characters: WithFile<Character>[]
  topics: WithFile<Topic>[]
  categories: WithFile<Category>[]
  sources: WithFile<Source>[]
  images: WithFile<Image>[]
  home: Home
}

export type ValidationIssue = {
  level: "error" | "warning"
  file: string
  message: string
}

/** 記事 slug として使えない値（/articles/ 以下の固定パスと衝突するため） */
export const RESERVED_ARTICLE_SLUGS = ["page", "category", "tag"]

/** 出典が必須の情報区分 */
const SOURCE_REQUIRED: Claim["classification"][] = [
  "fact",
  "scholarship",
  "variant",
]

type Options = {
  /** 画像ファイルの存在確認（public/ 以下のパスを受け取る） */
  fileExists?: (publicPath: string) => boolean
}

const blockClaimIds = (block: Block): string[] =>
  "claimIds" in block ? block.claimIds : []

/**
 * コンテンツ全体の整合性を検証する。
 * スキーマ検証（load.ts）を通過したデータに対して、ID の参照整合性や
 * 出典の有無など、ファイルをまたぐルールを確認する。
 */
export const validateContent = (
  data: ContentData,
  options: Options = {}
): ValidationIssue[] => {
  const issues: ValidationIssue[] = []
  const error = (file: string | undefined, message: string) =>
    issues.push({ level: "error", file: file ?? "(unknown)", message })
  const warn = (file: string | undefined, message: string) =>
    issues.push({ level: "warning", file: file ?? "(unknown)", message })

  // --- ID 重複チェック -------------------------------------------------------
  const indexOf = <T extends { id: string; __file?: string }>(
    name: string,
    items: T[]
  ) => {
    const map = new Map<string, T>()
    for (const item of items) {
      if (map.has(item.id)) {
        error(item.__file, `${name} の id が重複しています: ${item.id}`)
      }
      map.set(item.id, item)
    }
    return map
  }
  const articles = indexOf("article", data.articles)
  const figures = indexOf("figure", data.figures)
  const mythologies = indexOf("mythology", data.mythologies)
  const stories = indexOf("story", data.stories)
  const works = indexOf("work", data.works)
  const characters = indexOf("character", data.characters)
  const topics = indexOf("topic", data.topics)
  const categories = indexOf("category", data.categories)
  const sources = indexOf("source", data.sources)
  const images = indexOf("image", data.images)

  const slugCheck = <T extends { slug: string; __file?: string }>(
    name: string,
    items: T[]
  ) => {
    const seen = new Set<string>()
    for (const item of items) {
      if (seen.has(item.slug))
        error(item.__file, `${name} の slug が重複しています: ${item.slug}`)
      seen.add(item.slug)
    }
  }
  slugCheck("article", data.articles)
  slugCheck("figure", data.figures)
  slugCheck("mythology", data.mythologies)
  slugCheck("work", data.works)
  slugCheck("character", data.characters)
  slugCheck("topic", data.topics)
  slugCheck("category", data.categories)

  // --- 参照チェック用ヘルパー ------------------------------------------------
  const refs = (
    file: string | undefined,
    label: string,
    values: string[],
    target: Map<string, unknown>,
    targetName: string
  ) => {
    for (const value of values) {
      if (!target.has(value))
        error(file, `${label}: 存在しない ${targetName} ID「${value}」`)
    }
  }

  // --- 主張（記事・キャラクター共通） ---------------------------------------
  const globalClaimIds = new Map<string, string>()
  const checkClaims = (
    f: string | undefined,
    owner: { id: string; claims: Claim[]; sourceIds: string[] },
    published: boolean
  ): Set<string> => {
    const claimIds = new Set<string>()
    for (const claim of owner.claims) {
      if (globalClaimIds.has(claim.id))
        error(
          f,
          `claim id「${claim.id}」が重複しています（${globalClaimIds.get(claim.id)}）`
        )
      globalClaimIds.set(claim.id, f ?? owner.id)
      claimIds.add(claim.id)
      refs(
        f,
        `claims.${claim.id}.sourceIds`,
        claim.sourceIds,
        sources,
        "source"
      )
      if (SOURCE_REQUIRED.includes(claim.classification)) {
        if (claim.sourceIds.length === 0)
          error(
            f,
            `claim「${claim.id}」(${claim.classification}) に出典がありません`
          )
        else if (!claim.sourceLocation)
          warn(
            f,
            `claim「${claim.id}」に該当箇所（sourceLocation）がありません`
          )
      }
      if (claim.classification === "creative" && claim.sourceIds.length === 0)
        warn(f, `claim「${claim.id}」(creative) に対象作品の出典がありません`)
      for (const sourceId of claim.sourceIds) {
        if (!owner.sourceIds.includes(sourceId))
          error(
            f,
            `claim「${claim.id}」の出典「${sourceId}」が sourceIds に含まれていません`
          )
      }
      if (published && claim.verificationStatus === "unverified")
        error(f, `公開データに未検証の claim「${claim.id}」があります`)
      if (claim.verificationStatus === "disputed" && !claim.note)
        warn(f, `claim「${claim.id}」は disputed ですが note がありません`)
    }
    return claimIds
  }

  // --- 記事 -----------------------------------------------------------------
  for (const article of data.articles) {
    const f = article.__file
    const published = article.status === "published"

    if (article.id !== article.slug)
      warn(f, "id と slug は一致させることを推奨します")
    if (RESERVED_ARTICLE_SLUGS.includes(article.slug))
      error(f, `slug「${article.slug}」は予約語のため使用できません`)
    if (!categories.has(article.category))
      error(f, `category: 存在しないカテゴリー「${article.category}」`)
    refs(f, "figureIds", article.figureIds, figures, "figure")
    refs(f, "mythologyIds", article.mythologyIds, mythologies, "mythology")
    refs(f, "storyIds", article.storyIds, stories, "story")
    refs(f, "workIds", article.workIds, works, "work")
    refs(f, "characterIds", article.characterIds, characters, "character")
    refs(f, "topicIds", article.topicIds, topics, "topic")
    refs(f, "sourceIds", article.sourceIds, sources, "source")
    refs(f, "relatedArticleIds", article.relatedArticleIds, articles, "article")
    if (article.thumbnail && !images.has(article.thumbnail))
      error(f, `thumbnail: 存在しない画像「${article.thumbnail}」`)
    if (article.updatedAt < article.publishedAt)
      error(f, "updatedAt が publishedAt より前になっています")

    // 主張
    const claimIds = checkClaims(f, article, article.status === "published")

    // 本文
    const usedClaims = new Set<string>()
    const anchors = new Set<string>()
    let seenH2 = false
    article.body.forEach((block, i) => {
      const at = `body[${i}]`
      for (const claimId of blockClaimIds(block)) {
        if (!claimIds.has(claimId))
          error(
            f,
            `${at}: 記事内に存在しない claim「${claimId}」を参照しています`
          )
        usedClaims.add(claimId)
      }
      if (block.type === "heading") {
        if (block.level === 2) seenH2 = true
        else if (!seenH2) warn(f, `${at}: h2 より前に h3 があります`)
        if (block.anchor) {
          if (anchors.has(block.anchor))
            error(f, `${at}: 見出しアンカー「${block.anchor}」が重複しています`)
          anchors.add(block.anchor)
        }
      }
      if (block.type === "quote") {
        if (!sources.has(block.sourceId))
          error(f, `${at}: 存在しない出典「${block.sourceId}」`)
        else if (!article.sourceIds.includes(block.sourceId))
          error(
            f,
            `${at}: 引用元「${block.sourceId}」が記事の sourceIds に含まれていません`
          )
        if (!block.location) warn(f, `${at}: 引用に該当箇所がありません`)
      }
      if (block.type === "image" && !images.has(block.imageId))
        error(f, `${at}: 存在しない画像「${block.imageId}」`)
      if (
        block.type === "note" &&
        SOURCE_REQUIRED.includes(block.classification) &&
        block.claimIds.length === 0
      )
        error(
          f,
          `${at}: ${block.classification} の囲み記事には根拠となる claimIds が必要です`
        )
    })
    for (const claimId of claimIds) {
      if (!usedClaims.has(claimId))
        warn(f, `claim「${claimId}」が本文から参照されていません`)
    }

    if (published) {
      if (article.body.length === 0) error(f, "公開記事の本文が空です")
      if (article.sourceIds.length === 0)
        error(f, "公開記事に出典（sourceIds）がありません")
      if (
        !article.claims.some((c) => SOURCE_REQUIRED.includes(c.classification))
      )
        error(
          f,
          "公開記事に出典付きの主張（fact/scholarship/variant）がありません"
        )
      if (!article.body.some((b) => b.type === "heading" && b.level === 2))
        warn(f, "h2 見出しがありません（目次が生成されません）")
    }
  }

  // --- 人物・怪物 -------------------------------------------------------------
  for (const figure of data.figures) {
    const f = figure.__file
    refs(f, "mythologyIds", figure.mythologyIds, mythologies, "mythology")
    refs(f, "relatedFigureIds", figure.relatedFigureIds, figures, "figure")
    refs(f, "relatedStoryIds", figure.relatedStoryIds, stories, "story")
    refs(f, "articleIds", figure.articleIds, articles, "article")
    refs(f, "sourceIds", figure.sourceIds, sources, "source")
    if (figure.imageId && !images.has(figure.imageId))
      error(f, `imageId: 存在しない画像「${figure.imageId}」`)
    if (figure.sourceIds.length === 0)
      error(f, "人物・怪物データに出典（sourceIds）がありません")
    if (figure.relatedFigureIds.includes(figure.id))
      warn(f, "relatedFigureIds に自分自身が含まれています")

    // 本文と主張
    const figureClaimIds = checkClaims(f, figure, true)
    const usedFigureClaims = new Set<string>()
    figure.body.forEach((block, i) => {
      const at = `body[${i}]`
      for (const claimId of blockClaimIds(block)) {
        if (!figureClaimIds.has(claimId))
          error(f, `${at}: 存在しない claim「${claimId}」を参照しています`)
        usedFigureClaims.add(claimId)
      }
      if (block.type === "quote" && !figure.sourceIds.includes(block.sourceId))
        error(
          f,
          `${at}: 引用元「${block.sourceId}」が sourceIds に含まれていません`
        )
      if (block.type === "image" && !images.has(block.imageId))
        error(f, `${at}: 存在しない画像「${block.imageId}」`)
      if (
        block.type === "paragraph" &&
        figure.claims.length > 0 &&
        block.claimIds.length === 0
      )
        warn(f, `${at}: 根拠となる claimIds がありません`)
    })
    for (const claimId of figureClaimIds) {
      if (!usedFigureClaims.has(claimId))
        warn(f, `claim「${claimId}」が本文から参照されていません`)
    }
  }

  for (const myth of data.mythologies) {
    const f = myth.__file
    refs(f, "figureIds", myth.figureIds, figures, "figure")
    refs(f, "storyIds", myth.storyIds, stories, "story")
    refs(f, "sourceIds", myth.sourceIds, sources, "source")
  }

  for (const story of data.stories) {
    const f = story.__file
    refs(
      f,
      `stories.${story.id}.mythologyIds`,
      story.mythologyIds,
      mythologies,
      "mythology"
    )
    refs(f, `stories.${story.id}.figureIds`, story.figureIds, figures, "figure")
    refs(f, `stories.${story.id}.sourceIds`, story.sourceIds, sources, "source")
    if (story.sourceIds.length === 0)
      error(f, `story「${story.id}」に出典がありません`)
  }

  for (const work of data.works) {
    const f = work.__file
    refs(f, "mythologyIds", work.mythologyIds, mythologies, "mythology")
    refs(f, "articleIds", work.articleIds, articles, "article")
    refs(f, "sourceIds", work.sourceIds, sources, "source")
    refs(f, "imageIds", work.imageIds, images, "image")
  }

  // --- キャラクター -----------------------------------------------------------
  for (const character of data.characters) {
    const f = character.__file
    if (!works.has(character.workId))
      error(f, `workId: 存在しない作品「${character.workId}」`)
    refs(f, "sourceIds", character.sourceIds, sources, "source")
    refs(f, "articleIds", character.articleIds, articles, "article")
    if (character.imageId && !images.has(character.imageId))
      error(f, `imageId: 存在しない画像「${character.imageId}」`)
    const claimIds = checkClaims(f, character, true)
    const used = new Set<string>()
    const checkEvidence = (
      label: string,
      e: { claimIds: string[] } | undefined,
      required: boolean
    ) => {
      if (!e) return
      if (required && e.claimIds.length === 0)
        error(f, `${label}: 根拠となる claimIds が必要です`)
      for (const claimId of e.claimIds) {
        used.add(claimId)
        if (!claimIds.has(claimId))
          error(f, `${label}: 存在しない claim「${claimId}」を参照しています`)
      }
    }
    checkEvidence("description", character.description, true)
    checkEvidence("nameOrigin", character.nameOrigin, true)
    character.motifs.forEach((motif, i) => {
      if (motif.figureId && !figures.has(motif.figureId))
        error(
          f,
          `motifs[${i}].figureId: 存在しない figure「${motif.figureId}」`
        )
      checkEvidence(`motifs[${i}].inWork`, motif.inWork, true)
      checkEvidence(`motifs[${i}].inMyth`, motif.inMyth, true)
      // 原典側の説明には出典付きの主張（fact 等）が必要
      if (
        motif.inMyth &&
        !motif.inMyth.claimIds.some((id) =>
          character.claims.some(
            (c) => c.id === id && SOURCE_REQUIRED.includes(c.classification)
          )
        )
      )
        error(f, `motifs[${i}].inMyth: 原典の説明に出典付きの主張がありません`)
    })
    character.comparison.forEach((c, i) =>
      checkEvidence(`comparison[${i}]`, c, true)
    )
    for (const claimId of claimIds)
      if (!used.has(claimId)) warn(f, `claim「${claimId}」が参照されていません`)
  }

  for (const topic of data.topics) {
    const f = topic.__file
    refs(f, "figureIds", topic.figureIds, figures, "figure")
    refs(f, "storyIds", topic.storyIds, stories, "story")
  }

  for (const image of data.images) {
    if (options.fileExists && !options.fileExists(image.src))
      error(image.__file, `画像ファイルが存在しません: public${image.src}`)
  }

  // --- トップページ設定 --------------------------------------------------------
  for (const key of ["featuredArticleIds", "popularArticleIds"] as const) {
    for (const articleId of data.home[key]) {
      const article = articles.get(articleId)
      if (!article) error("home.json", `${key}: 存在しない記事「${articleId}」`)
      else if (article.status !== "published")
        warn("home.json", `${key}: 未公開記事「${articleId}」は表示されません`)
    }
  }

  return issues
}
