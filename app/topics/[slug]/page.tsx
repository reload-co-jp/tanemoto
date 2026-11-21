import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import {
  ChipList,
  PageHeader,
  Section,
  TileList,
} from "@/components/common/PageParts"
import { StoryList } from "@/components/common/StoryList"
import {
  getArticlesForTopic,
  getFiguresForTopic,
  getStoriesForTopic,
  getTopic,
  getTopics,
} from "@/lib/content/repository"
import { figureTile } from "@/lib/figureTile"
import { JsonLd } from "@/components/seo/JsonLd"
import { buildMetadata, webPageJsonLd } from "@/lib/seo"
import { absoluteUrl, paths } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getTopics().map((t) => ({ slug: t.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const topic = getTopic((await params).slug)
  if (!topic) return {}
  return buildMetadata({
    title: `「${topic.name}」をテーマにした神話・伝承`,
    description: topic.description,
    path: paths.topic(topic.slug),
    noindex: getArticlesForTopic(topic).length === 0,
  })
}

const Page = async ({ params }: Props) => {
  const topic = getTopic((await params).slug)
  if (!topic) notFound()
  const articles = getArticlesForTopic(topic)
  const figures = getFiguresForTopic(topic)
  const stories = getStoriesForTopic(topic)
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: `「${topic.name}」をテーマにした神話・伝承`,
          description: topic.description,
          path: paths.topic(topic.slug),
          type: "CollectionPage",
          mentions: articles.map((a) => ({
            "@type": "Article",
            headline: a.title,
            url: absoluteUrl(paths.article(a.slug)),
          })),
        })}
      />
      <Breadcrumbs
        items={[
          { name: "テーマ", href: paths.topics() },
          { name: topic.name, href: paths.topic(topic.slug) },
        ]}
      />
      <PageHeader
        eyebrow="Topic"
        title={topic.name}
        description={topic.description}
      />
      <Section title={`「${topic.name}」の記事`} en="Articles" id="articles">
        <ArticleList articles={articles} />
      </Section>
      {figures.length > 0 && (
        <Section title="関連する人物・怪物" en="Figures" id="figures">
          <TileList items={figures.map(figureTile)} />
        </Section>
      )}
      {stories.length > 0 && (
        <Section title="関連する物語" en="Stories" id="stories">
          <StoryList stories={stories} />
        </Section>
      )}
      <Section title="ほかのテーマ" en="Other Topics" id="other-topics">
        <ChipList
          items={getTopics()
            .filter((t) => t.id !== topic.id)
            .map((t) => ({ href: paths.topic(t.slug), label: t.name }))}
        />
      </Section>
    </>
  )
}

export default Page
