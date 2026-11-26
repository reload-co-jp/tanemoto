import { notFound } from "next/navigation"
import { ArticlesIndex } from "@/components/article/ArticlesIndex"
import { getArticlesByTag, getTags } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

type Props = { params: Promise<{ tag: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getTags().map((t) => ({ tag: t.name }))

const decode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const generateMetadata = async ({ params }: Props) => {
  const tag = decode((await params).tag)
  return buildMetadata({
    title: `「${tag}」の記事一覧`,
    description: `「${tag}」に関するタネトモの記事一覧です。`,
    path: paths.tag(tag),
    // タグページは重複コンテンツになりやすいため noindex（リンクは辿らせる）
    noindex: true,
  })
}

const Page = async ({ params }: Props) => {
  const tag = decode((await params).tag)
  const articles = getArticlesByTag(tag)
  if (articles.length === 0) notFound()
  return (
    <ArticlesIndex
      articles={articles}
      page={1}
      perPage={articles.length}
      pageHref={() => paths.tag(tag)}
      title={`#${tag}`}
      eyebrow="Tag"
      currentTag={tag}
      crumbs={[
        { name: "記事一覧", href: paths.articles() },
        { name: `#${tag}`, href: paths.tag(tag) },
      ]}
    />
  )
}

export default Page
