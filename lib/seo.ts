import type { Metadata } from "next"
import type { Article } from "./content/schema"
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
    alternates: { canonical: url },
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

export const articleJsonLd = (article: Article, imagePath?: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  datePublished: article.publishedAt,
  dateModified: article.updatedAt,
  inLanguage: "ja",
  mainEntityOfPage: absoluteUrl(paths.article(article.slug)),
  image: [absoluteUrl(imagePath ?? site.defaultOgImage)],
  keywords: article.tags.join(","),
  author: {
    "@type": "Organization",
    name: site.publisher.name,
    url: absoluteUrl(paths.about()),
  },
  publisher: {
    "@type": "Organization",
    name: site.publisher.name,
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon-512.png") },
  },
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
