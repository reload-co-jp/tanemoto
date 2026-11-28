import type { Metadata } from "next"
import type {
  Article,
  Character,
  Figure,
  Image,
  Mythology,
  Work,
} from "./content/schema"
import { kindsLabel } from "./entryKind"
import { absoluteUrl, paths, site } from "./site"

type MetaInput = {
  title?: string
  description?: string
  /** サイト内パス（canonical） */
  path: string
  type?: "website" | "article"
  /** OGP 画像。Image を渡すと実寸と alt も出力する（省略時はサイト既定画像） */
  image?: string | Image
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
  image,
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
}: MetaInput): Metadata => {
  const url = absoluteUrl(path)
  const fullTitle = title
    ? `${title}｜${site.name}`
    : `${site.name}｜${site.tagline}`
  const ogImage =
    typeof image === "object"
      ? {
          url: absoluteUrl(image.src),
          width: image.width,
          height: image.height,
          alt: image.alt,
        }
      : image
        ? { url: absoluteUrl(image) }
        : { url: absoluteUrl(site.defaultOgImage), width: 1200, height: 630 }
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
      images: [ogImage],
      ...(type === "article" ? { publishedTime, modifiedTime, tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
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
  url: site.publisher.url,
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
  url: site.publisher.url,
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
  drama: "TVSeries",
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
  image?: Image
}

/** 詳細ページ・一覧ページ用の WebPage（about で主題を示す） */
export const webPageJsonLd = ({
  name,
  description,
  path,
  type = "WebPage",
  about,
  mentions,
  image,
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
  ...(image ? { primaryImageOfPage: imageObjectJsonLd(image) } : {}),
  ...(about ? { about } : {}),
  ...(mentions && mentions.length > 0 ? { mentions } : {}),
})

/** 画像の ImageObject（出典・ライセンス表記つき） */
export const imageObjectJsonLd = (image: Image) => ({
  "@type": "ImageObject",
  contentUrl: absoluteUrl(image.src),
  url: absoluteUrl(image.src),
  width: image.width,
  height: image.height,
  caption: image.alt,
  creditText: image.credit,
  ...(isKnownAuthor(image.author)
    ? { creator: { "@type": "Person", name: image.author } }
    : {}),
  ...(licenseUrl(image.license) ? { license: licenseUrl(image.license) } : {}),
})

const isKnownAuthor = (author: string) =>
  !/^(不明|作者不詳|unknown|anonymous)/i.test(author.trim())

/** ライセンス表記（例: "CC BY-SA 4.0"、"Public domain"）→ ライセンスの URL */
export const licenseUrl = (license: string): string | undefined => {
  const l = license.trim()
  if (/^https?:\/\//.test(l)) return l
  if (/^public domain$/i.test(l))
    return "https://creativecommons.org/publicdomain/mark/1.0/"
  if (/^CC0/i.test(l))
    return "https://creativecommons.org/publicdomain/zero/1.0/"
  const m = l.match(
    /^CC (BY(?:-SA|-ND|-NC|-NC-SA|-NC-ND)?) (\d\.\d)(?: ([a-z]{2}))?$/i
  )
  if (!m) return undefined
  const [, kind, version, port] = m
  return `https://creativecommons.org/licenses/${kind.toLowerCase()}/${version}/${port ? `${port.toLowerCase()}/` : ""}`
}

export const figureJsonLd = (
  figure: Figure,
  mythologies: Mythology[],
  image?: Image
) =>
  webPageJsonLd({
    name: `${figure.name}とは`,
    description: figure.description,
    path: paths.figure(figure.slug),
    about: figureEntity(figure, mythologies),
    image,
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

export const workJsonLd = (
  work: Work,
  characters: Character[],
  image?: Image
) => {
  const persons = characters.filter((c) => c.kind === "character")
  return webPageJsonLd({
    name: `『${work.title}』${kindsLabel(characters)}の元ネタ`,
    description: work.description,
    path: paths.work(work.slug),
    type: "CollectionPage",
    image,
    about: {
      ...workEntity(work),
      description: work.description,
      ...(persons.length > 0
        ? { character: persons.map((c) => characterEntity(c)) }
        : {}),
    },
  })
}

/** キャラクターは Person、事件は Event、設定は Thing として表す */
const entityTypes = {
  character: "Person",
  setting: "Thing",
  event: "Event",
} as const

const characterEntity = (character: Character) => ({
  "@type": entityTypes[character.kind],
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
  description: string,
  image?: Image
) =>
  webPageJsonLd({
    name: `${character.name}の元ネタ`,
    description,
    path: paths.character(character.slug),
    image,
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
