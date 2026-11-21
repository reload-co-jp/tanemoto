import { getArticles } from "@/lib/content/repository"
import { absoluteUrl, paths, site } from "@/lib/site"

export const dynamic = "force-static"

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

/** 新着記事の RSS 2.0 フィード（最新 30 件） */
export const GET = () => {
  const articles = [...getArticles()]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 30)
  const items = articles
    .map((a) => {
      const url = absoluteUrl(paths.article(a.slug))
      return `    <item>
      <title>${escape(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(a.description)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
${a.tags.map((t) => `      <category>${escape(t)}</category>`).join("\n")}
    </item>`
    })
    .join("\n")
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${escape(site.description)}</description>
    <language>ja</language>
    <atom:link href="${absoluteUrl(paths.feed())}" rel="self" type="application/rss+xml" />
${articles[0] ? `    <lastBuildDate>${new Date(articles[0].updatedAt).toUTCString()}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
