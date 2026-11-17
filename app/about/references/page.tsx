import { SourceList } from "@/components/article/SourceList"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { Link } from "@/components/common/Link"
import { PageHeader, Section } from "@/components/common/PageParts"
import { sourceTypes } from "@/lib/content/schema"
import { getArticlesForSource, getSources } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths, site } from "@/lib/site"

export const metadata = buildMetadata({
  title: "参考文献・情報源",
  description: `${site.name}の記事で参照している古典文献・研究書・Webリソースの一覧です。`,
  path: paths.references(),
})

const Page = () => {
  const sources = getSources()
  const groups = (Object.keys(sourceTypes) as (keyof typeof sourceTypes)[])
    .map((type) => ({ type, items: sources.filter((s) => s.type === type) }))
    .filter((g) => g.items.length > 0)
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "運営者情報", href: paths.about() },
          { name: "参考文献・情報源", href: paths.references() },
        ]}
      />
      <PageHeader
        eyebrow="References"
        title="参考文献・情報源"
        description={
          <>
            記事で参照している資料の一覧です。各記事の末尾にも、その記事で使用した出典を掲載しています。資料の扱い方については
            <Link href={paths.editorialPolicy()}>編集方針</Link>をご覧ください。
          </>
        }
      />
      {groups.map((group) => (
        <Section
          key={group.type}
          title={sourceTypes[group.type]}
          id={`type-${group.type}`}
        >
          <SourceList sources={group.items} />
          <p className="t-meta" style={{ marginTop: 12 }}>
            {group.items
              .map(
                (s) => `${s.title}：${getArticlesForSource(s).length}記事で参照`
              )
              .join(" ／ ")}
          </p>
        </Section>
      ))}
    </>
  )
}

export default Page
