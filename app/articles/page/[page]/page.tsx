import { notFound } from "next/navigation"
import { ArticlesIndex, paginate } from "@/components/article/ArticlesIndex"
import { getArticles } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

type Props = { params: Promise<{ page: string }> }

export const dynamicParams = false

export const generateStaticParams = () => {
  const { total } = paginate(getArticles(), 1)
  // 2ページ目以降のみ（1ページ目は /articles/）。静的出力のため最低1件は必要
  const pages = Array.from({ length: Math.max(total - 1, 0) }, (_, i) => ({
    page: String(i + 2),
  }))
  return pages.length > 0 ? pages : [{ page: "2" }]
}

export const generateMetadata = async ({ params }: Props) => {
  const { page } = await params
  return buildMetadata({
    title: `記事一覧（${page}ページ目）`,
    description: `トモタネの記事一覧（${page}ページ目）。${paginate(
      getArticles(),
      Number(page)
    )
      .items.slice(0, 3)
      .map((a) => a.title.split(/[？｜]/)[0])
      .join("、")}など、神話・伝承の解説記事を掲載しています。`.slice(0, 120),
    path: paths.articlesPage(Number(page)),
  })
}

const Page = async ({ params }: Props) => {
  const page = Number((await params).page)
  const { total } = paginate(getArticles(), 1)
  if (!Number.isInteger(page) || page < 2 || page > total) notFound()
  return (
    <ArticlesIndex
      articles={getArticles()}
      page={page}
      pageHref={paths.articlesPage}
      title="記事一覧"
      crumbs={[
        { name: "記事一覧", href: paths.articles() },
        { name: `${page}ページ目`, href: paths.articlesPage(page) },
      ]}
    />
  )
}

export default Page
