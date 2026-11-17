import { ArticlesIndex } from "@/components/article/ArticlesIndex"
import { getArticles } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

export const metadata = buildMetadata({
  title: "記事一覧",
  description:
    "トモタネの記事一覧。神話・伝承に登場する神々や怪物、物語の背景を原典にもとづいて解説します。",
  path: paths.articles(),
})

const Page = () => (
  <ArticlesIndex
    articles={getArticles()}
    page={1}
    pageHref={paths.articlesPage}
    title="記事一覧"
    crumbs={[{ name: "記事一覧", href: paths.articles() }]}
  />
)

export default Page
