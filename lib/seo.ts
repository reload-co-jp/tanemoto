import type { Metadata } from "next"
import type {
  Article,
  Character,
  Figure,
  Mythology,
  Work,
} from "./content/schema"
import { absoluteUrl, paths, site } from "./site"

type MetaInput = {
  title?: string
  description?: string
  /** サイト内パス（canonical） */
  path: string
  type?: "website" | "article"
  image?: string
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  noindex?: boolean
}

/** ページごとのメタデータ（title / description / canonical / OGP / Twitter Card） */
export const buildMetadata = ({
  title,
  description = site.description,
  path,
  type = "website",
  image = site.defaultOgImage,
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
}: MetaInput): Metadata => {
  const url = absoluteUrl(path)
  const fullTitle = title
    ? `${title}｜${site.name}`
    : `${site.name}｜${site.tagline}`
  const imageUrl = absoluteUrl(image)
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": absoluteUrl(paths.feed()) },
    },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      ...(type === "article" ? { publishedTime, modifiedTime, tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  }
}

/**
 * meta description 用に文章を切り詰める。検索結果で省略されにくい長さに収めるため、
 * 上限を超える場合は上限内の最後の句点で切り、句点がなければ末尾を「…」にする。
 */
export const metaDescription = (text: string, max = 120) => {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  const head = t.slice(0, max)
  const cut = head.lastIndexOf("。")
  return cut >= max / 2 ? head.slice(0, cut + 1) : `${head.slice(0, max - 1)}…`
}

// --- 構造化データ（JSON-LD） ---------------------------------------------------

const organizationId = `${absoluteUrl("/")}#organization`
const websiteId = `${absoluteUrl("/")}#website`

export const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: site.publisher.name,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon-512.png"),
})

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  name: site.name,
  alternateName: site.nameEn,
  description: site.description,
  url: absoluteUrl("/"),
  inLanguage: "ja",
  publisher: { "@id": organizationId },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${absoluteUrl(paths.search())}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
})

export const breadcrumbJsonLd = (items: { name: string; href: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.href),
  })),
})

const publisherJsonLd = () => ({
  "@type": "Organization",
  "@id": organizationId,
  name: site.publisher.name,
  url: absoluteUrl("/"),
  logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png") },
})

const uniq = (xs: (string | undefined)[]) => [
  ...new Set(xs.filter((x): x is string => !!x)),
]

/** 神話上の人物・怪物を表すエンティティ（about / mentions 用） */
const figureEntity = (figure: Figure, mythologies: Mythology[] = []) => ({
  "@type": "Thing",
  "@id": `${absoluteUrl(paths.figure(figure.slug))}#entity`,
  name: figure.name,
  alternateName: uniq([
    figure.originalName,
    figure.romanized,
    ...figure.alternativeNames,
  ]),
  description: figure.description,
  url: absoluteUrl(paths.figure(figure.slug)),
  ...(mythologies.length > 0
    ? { subjectOf: mythologies.map((m) => mythologyEntity(m)) }
    : {}),
})

const mythologyEntity = (myth: Mythology) => ({
  "@type": "Thing",
  "@id": `${absoluteUrl(paths.mythology(myth.slug))}#entity`,
  name: myth.name,
  url: absoluteUrl(paths.mythology(myth.slug)),
})

const workTypeSchema: Record<Work["type"], string> = {
  manga: "ComicSeries",
  anime: "TVSeries",
  game: "VideoGame",
  novel: "Book",
  film: "Movie",
}

/** 作品（アニメ・漫画など）を表すエンティティ */
const workEntity = (work: Work) => ({
  "@type": workTypeSchema[work.type],
  "@id": `${absoluteUrl(paths.work(work.slug))}#entity`,
  name: work.title,
  url: absoluteUrl(paths.work(work.slug)),
})

type PageInput = {
  name: string
  description: string
  path: string
  type?: "WebPage" | "CollectionPage"
  about?: object | object[]
  mentions?: object[]
}

/** 詳細ページ・一覧ページ用の WebPage（about で主題を示す） */
export const webPageJsonLd = ({
  name,
  description,
  path,
  type = "WebPage",
  about,
  mentions,
}: PageInput) => ({
  "@context": "https://schema.org",
  "@type": type,
  "@id": absoluteUrl(path),
  url: absoluteUrl(path),
  name,
  description,
  inLanguage: "ja",
  isPartOf: { "@id": websiteId },
  publisher: publisherJsonLd(),
  ...(about ? { about } : {}),
  ...(mentions && mentions.length > 0 ? { mentions } : {}),
})

export const figureJsonLd = (figure: Figure, mythologies: Mythology[]) =>
  webPageJsonLd({
    name: `${figure.name}とは`,
    description: figure.description,
    path: paths.figure(figure.slug),
    about: figureEntity(figure, mythologies),
  })

export const mythologyJsonLd = (myth: Mythology, figures: Figure[]) =>
  webPageJsonLd({
    name: myth.name,
    description: myth.description,
    path: paths.mythology(myth.slug),
    type: "CollectionPage",
    about: { ...mythologyEntity(myth), description: myth.description },
    mentions: figures.map((f) => figureEntity(f)),
  })

export const workJsonLd = (work: Work, characters: Character[]) =>
  webPageJsonLd({
    name: `『${work.title}』キャラクターの元ネタ`,
    description: work.description,
    path: paths.work(work.slug),
    type: "CollectionPage",
    about: {
      ...workEntity(work),
      description: work.description,
      ...(characters.length > 0
        ? { character: characters.map((c) => characterEntity(c)) }
        : {}),
    },
  })

const characterEntity = (character: Character) => ({
  "@type": "Person",
  "@id": `${absoluteUrl(paths.character(character.slug))}#entity`,
  name: character.name,
  ...(character.alternativeNames.length > 0
    ? { alternateName: character.alternativeNames }
    : {}),
  url: absoluteUrl(paths.character(character.slug)),
})

export const characterJsonLd = (
  character: Character,
  work: Work | undefined,
  figures: Figure[],
  description: string
) =>
  webPageJsonLd({
    name: `${character.name}の元ネタ`,
    description,
    path: paths.character(character.slug),
    about: work
      ? [{ ...characterEntity(character), subjectOf: workEntity(work) }]
      : [characterEntity(character)],
    mentions: figures.map((f) => figureEntity(f)),
  })

export const articleJsonLd = (
  article: Article,
  imagePath?: string,
  figures: Figure[] = []
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  isPartOf: { "@id": websiteId },
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  inLanguage: "ja",
  mainEntityOfPage: absoluteUrl(paths.article(article.slug)),
  image: [absoluteUrl(imagePath ?? site.defaultOgImage)],
  keywords: article.tags.join(","),
  author: publisherJsonLd(),
  publisher: publisherJsonLd(),
  ...(figures.length > 0 ? { about: figures.map((f) => figureEntity(f)) } : {}),
})

/** 一覧ページ用 */
export const itemListJsonLd = (items: { name: string; href: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    url: absoluteUrl(item.href),
  })),
})
