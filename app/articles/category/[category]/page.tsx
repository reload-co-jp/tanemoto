import { notFound } from "next/navigation"
import { ArticlesIndex } from "@/components/article/ArticlesIndex"
import {
  getArticlesByCategory,
  getCategories,
  getCategory,
} from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

type Props = { params: Promise<{ category: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getCategories().map((c) => ({ category: c.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const category = getCategory((await params).category)
  if (!category) return {}
  return buildMetadata({
    title: `${category.name}の記事一覧`,
    description: `${category.description}${getArticlesByCategory(category.id)
      .slice(0, 3)
      .map((a) => a.title.split(/[？｜]/)[0])
      .join(
        "、"
      )}など${getArticlesByCategory(category.id).length}本の記事を掲載。`.slice(
      0,
      120
    ),
    path: paths.category(category.slug),
    noindex: getArticlesByCategory(category.id).length === 0,
  })
}

const Page = async ({ params }: Props) => {
  const category = getCategory((await params).category)
  if (!category) notFound()
  const articles = getArticlesByCategory(category.id)
  return (
    <ArticlesIndex
      articles={articles}
      page={1}
      perPage={Math.max(articles.length, 1)}
      pageHref={() => paths.category(category.slug)}
      title={category.name}
      eyebrow={category.nameEn ?? "Category"}
      description={category.description}
      currentCategory={category.id}
      crumbs={[
        { name: "記事一覧", href: paths.articles() },
        { name: category.name, href: paths.category(category.slug) },
      ]}
    />
  )
}

export default Page
