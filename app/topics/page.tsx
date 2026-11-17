import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { PageHeader, TileList } from "@/components/common/PageParts"
import { getArticlesForTopic, getTopics } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

export const metadata = buildMetadata({
  title: "テーマから探す",
  description:
    "冥界、怪物、石化、英雄の冒険など、神話に繰り返し現れるテーマから記事を探せます。",
  path: paths.topics(),
})

const Page = () => (
  <>
    <Breadcrumbs items={[{ name: "テーマ", href: paths.topics() }]} />
    <PageHeader
      eyebrow="Topics"
      title="テーマから探す"
      description="神話に繰り返し現れるモチーフやテーマごとに、人物・物語・記事をまとめています。"
    />
    <TileList
      items={getTopics().map((t) => ({
        href: paths.topic(t.slug),
        title: t.name,
        description: t.description,
        meta: `記事 ${getArticlesForTopic(t).length}件`,
      }))}
    />
  </>
)

export default Page
