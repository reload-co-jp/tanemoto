/**
 * サイト全体の設定。公開URLなどは環境変数で上書きできる。
 *
 *   NEXT_PUBLIC_SITE_URL       公開URL（末尾スラッシュなし。basePath を含む）
 *   NEXT_PUBLIC_BASE_PATH      basePath（サブパスで公開する場合のみ）
 *   NEXT_PUBLIC_GA_ID          GA4 測定ID（G-XXXX）。未設定なら計測タグを出力しない
 *   NEXT_PUBLIC_ADSENSE_CLIENT AdSense クライアントID（ca-pub-XXXX）。未設定なら広告を出力しない
 *   NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE / NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR 広告ユニットID
 *   NEXT_PUBLIC_GSC_VERIFICATION Google Search Console の所有権確認トークン
 */
export const site = {
  name: "トモタネ",
  nameEn: "Tomotane",
  tagline: "物語、キャラクターの元をたどる。",
  description:
    "アニメ・漫画を入口に、キャラクターや設定の背景にある神話・伝承を、原典と研究にもとづいて解説する知識メディア。",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL || "https://tanetomo.reload.co.jp"
  ).replace(/\/$/, ""),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  locale: "ja_JP",
  publisher: {
    name: "トモタネ編集部",
  },
  defaultOgImage: "/og-default.png",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
  /** AdSense 広告ユニットのスロットID */
  adSlots: {
    articleBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "",
  },
  gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  articlesPerPage: 12,
} as const

/** サイト内パス → 絶対URL（canonical・OGP・sitemap 用） */
export const absoluteUrl = (pathname: string) => {
  const origin = new URL(site.url).origin
  const base = new URL(site.url).pathname.replace(/\/$/, "")
  return `${origin}${base}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
}

/** public/ 以下の静的ファイルへのパス（basePath を付与） */
export const assetPath = (pathname: string) => `${site.basePath}${pathname}`

export const paths = {
  home: () => "/",
  articles: () => "/articles/",
  articlesPage: (page: number) =>
    page <= 1 ? "/articles/" : `/articles/page/${page}/`,
  article: (slug: string) => `/articles/${slug}/`,
  category: (slug: string) => `/articles/category/${slug}/`,
  tag: (tag: string) => `/articles/tag/${encodeURIComponent(tag)}/`,
  works: () => "/works/",
  work: (slug: string) => `/works/${slug}/`,
  mythologies: () => "/mythologies/",
  mythology: (slug: string) => `/mythologies/${slug}/`,
  figures: () => "/figures/",
  figure: (slug: string) => `/figures/${slug}/`,
  topics: () => "/topics/",
  topic: (slug: string) => `/topics/${slug}/`,
  search: () => "/search/",
  about: () => "/about/",
  editorialPolicy: () => "/about/editorial-policy/",
  references: () => "/about/references/",
}
