import { Breadcrumbs, Crumb } from "@/components/common/Breadcrumbs"
import { ChipList, PageHeader } from "@/components/common/PageParts"
import { Pagination } from "@/components/common/Pagination"
import type { Article } from "@/lib/content/schema"
import { getArticles, getCategories, getTags } from "@/lib/content/repository"
import { paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { winCss } from "@/lib/styles/global"
import { color } from "@/lib/styles/theme"
import { ArticleList } from "./ArticleCard"

const styles = css`
  ${winCss(".t-filters")}
  .t-filters {
    display: grid;
    gap: 14px;
    margin-bottom: 32px;
    padding: 16px;
    padding-top: 44px;
  }
  .t-filters__label {
    font-size: 0.75rem;
    color: ${color.muted};
    letter-spacing: 0.1em;
    margin-bottom: 6px;
  }
`

export const paginate = <T,>(
  items: T[],
  page: number,
  perPage: number = site.articlesPerPage
) => ({
  items: items.slice((page - 1) * perPage, page * perPage),
  total: Math.max(1, Math.ceil(items.length / perPage)),
})

/** 記事一覧（全件・カテゴリー別・タグ別で共通） */
export const ArticlesIndex = ({
  articles,
  page,
  pageHref,
  title,
  eyebrow = "Articles",
  description,
  crumbs,
  currentCategory,
  currentTag,
  perPage = site.articlesPerPage as number,
}: {
  articles: Article[]
  page: number
  pageHref: (page: number) => string
  title: string
  eyebrow?: string
  description?: string
  crumbs: Crumb[]
  currentCategory?: string
  currentTag?: string
  /** 1ページあたりの件数（カテゴリー・タグ一覧では全件表示） */
  perPage?: number
}) => {
  const { items, total } = paginate(articles, page, perPage)
  const allCount = getArticles().length
  return (
    <>
      <Style id="filters">{styles}</Style>
      <Breadcrumbs items={crumbs} />
      <PageHeader eyebrow={eyebrow} title={title} description={description}>
        <p className="t-meta" style={{ marginTop: 8 }}>
          {articles.length}件の記事{total > 1 && `（${page} / ${total}ページ）`}
        </p>
      </PageHeader>
      <div className="t-filters" data-title="Filter.txt">
        <div>
          <p className="t-filters__label">カテゴリーで絞り込む</p>
          <ChipList
            label="カテゴリー"
            items={[
              {
                href: paths.articles(),
                label: "すべて",
                sub: String(allCount),
                current: !currentCategory && !currentTag,
              },
              ...getCategories().map((c) => ({
                href: paths.category(c.slug),
                label: c.name,
                sub: String(
                  getArticles().filter((a) => a.category === c.id).length
                ),
                current: currentCategory === c.id,
              })),
            ]}
          />
        </div>
        <div>
          <p className="t-filters__label">タグで絞り込む</p>
          <ChipList
            label="タグ"
            items={getTags().map((t) => ({
              href: paths.tag(t.name),
              label: `#${t.name}`,
              sub: String(t.count),
              current: currentTag === t.name,
            }))}
          />
        </div>
      </div>
      <ArticleList articles={items} layout="row" headingLevel={2} />
      <Pagination current={page} total={total} href={pageHref} />
    </>
  )
}
