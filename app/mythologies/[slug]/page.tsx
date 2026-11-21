import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { ArticleBody } from "@/components/article/ArticleBody"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { InfoTable } from "@/components/common/InfoTable"
import { PageHeader, Section, TileList } from "@/components/common/PageParts"
import { SourceRefs } from "@/components/common/SourceRefs"
import { StoryList } from "@/components/common/StoryList"
import {
  getArticlesForMythology,
  getFiguresForMythology,
  getMythologies,
  getMythology,
  getStoriesForMythology,
} from "@/lib/content/repository"
import { figureTile } from "@/lib/figureTile"
import { JsonLd } from "@/components/seo/JsonLd"
import { buildMetadata, metaDescription, mythologyJsonLd } from "@/lib/seo"
import { paths } from "@/lib/site"

const kindEyebrow = {
  myth: "Mythology",
  legend: "Legend",
  history: "History",
} as const

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getMythologies()
    .filter((m) => !m.comingSoon)
    .map((m) => ({ slug: m.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const myth = getMythology((await params).slug)
  if (!myth) return {}
  return buildMetadata({
    title: `${myth.name}とは？${myth.kind === "myth" ? "主な神々" : "主な人物"}・物語と解説記事`,
    description: metaDescription(myth.description),
    path: paths.mythology(myth.slug),
  })
}

const Page = async ({ params }: Props) => {
  const myth = getMythology((await params).slug)
  if (!myth || myth.comingSoon) notFound()
  const figures = getFiguresForMythology(myth)
  const articles = getArticlesForMythology(myth)
  const stories = getStoriesForMythology(myth)
  return (
    <>
      <JsonLd data={mythologyJsonLd(myth, figures)} />
      <Breadcrumbs
        items={[
          { name: "神話", href: paths.mythologies() },
          { name: myth.name, href: paths.mythology(myth.slug) },
        ]}
      />
      <PageHeader
        eyebrow={kindEyebrow[myth.kind]}
        title={myth.name}
        description={myth.description}
      />
      <Section title="概要" en="Overview" id="overview">
        <InfoTable
          rows={[
            ["地域", myth.region],
            ["時期", myth.period],
            ["記事数", `${articles.length}件`],
          ]}
        />
        {myth.body.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <ArticleBody
              blocks={myth.body}
              claims={[]}
              sources={[]}
              images={[]}
            />
          </div>
        )}
      </Section>
      <Section
        title={myth.kind === "myth" ? "主な神々・英雄・怪物" : "主な人物"}
        en="Figures"
        id="figures"
        more={{ href: paths.figures(), label: "すべて見る" }}
      >
        <TileList items={figures.map(figureTile)} />
      </Section>
      {stories.length > 0 && (
        <Section title="主な物語" en="Stories" id="stories">
          <StoryList stories={stories} />
        </Section>
      )}
      <Section title={`${myth.name}の記事`} en="Articles" id="articles">
        <ArticleList articles={articles} />
      </Section>
      <SourceRefs sourceIds={myth.sourceIds} />
    </>
  )
}

export default Page
