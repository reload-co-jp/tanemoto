import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { ArticleBody } from "@/components/article/ArticleBody"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { InfoTable } from "@/components/common/InfoTable"
import { Link } from "@/components/common/Link"
import {
  ChipList,
  PageHeader,
  Section,
  TileList,
} from "@/components/common/PageParts"
import { SourceRefs } from "@/components/common/SourceRefs"
import { StoryList } from "@/components/common/StoryList"
import { figureTypes } from "@/lib/content/schema"
import {
  getArticlesForFigure,
  getFigure,
  getFigures,
  getMythologiesByIds,
  getRelatedFigures,
  getSourcesByIds,
  getStoriesForFigure,
  getWorksForFigure,
  getCharactersForFigure,
} from "@/lib/content/repository"
import { figureTile } from "@/lib/figureTile"
import { characterTile } from "@/lib/characterTile"
import { JsonLd } from "@/components/seo/JsonLd"
import { buildMetadata, figureJsonLd, metaDescription } from "@/lib/seo"
import { paths } from "@/lib/site"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getFigures().map((f) => ({ slug: f.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const figure = getFigure((await params).slug)
  if (!figure) return {}
  const mythology = getMythologiesByIds(figure.mythologyIds)[0]
  return buildMetadata({
    title: `${figure.name}（${mythology?.name ?? "神話"}）とは`,
    description: metaDescription(figure.description),
    path: paths.figure(figure.slug),
    // 関連記事がまだない人物ページは薄いコンテンツになりやすいため noindex
    noindex:
      getArticlesForFigure(figure).length === 0 && figure.body.length === 0,
  })
}

const Page = async ({ params }: Props) => {
  const figure = getFigure((await params).slug)
  if (!figure) notFound()
  const mythologies = getMythologiesByIds(figure.mythologyIds)
  const articles = getArticlesForFigure(figure)
  const related = getRelatedFigures(figure)
  const stories = getStoriesForFigure(figure)
  const works = getWorksForFigure(figure)
  const characters = getCharactersForFigure(figure)

  return (
    <>
      <JsonLd data={figureJsonLd(figure, mythologies)} />
      <Breadcrumbs
        items={[
          { name: "人物・怪物", href: paths.figures() },
          { name: figure.name, href: paths.figure(figure.slug) },
        ]}
      />
      <PageHeader
        eyebrow={`${figureTypes[figure.type]}${figure.romanized ? ` · ${figure.romanized}` : ""}`}
        title={figure.name}
        description={figure.description}
      />
      <div className="t-two-col">
        <div>
          {characters.length > 0 && (
            <Section
              title={`${figure.name}が元ネタのキャラクター`}
              en="Characters"
              id="characters"
            >
              <TileList items={characters.map(characterTile)} />
            </Section>
          )}

          <Section title="基本情報" en="Profile" id="profile">
            <InfoTable
              rows={[
                ["名前", figure.name],
                ["読み方", figure.reading],
                [
                  "原語表記",
                  figure.originalName &&
                    `${figure.originalName}${figure.romanized ? `（${figure.romanized}）` : ""}`,
                ],
                ["別名・表記ゆれ", figure.alternativeNames.join("、")],
                ["分類", figureTypes[figure.type]],
                [
                  "神話体系",
                  mythologies.length > 0 && (
                    <>
                      {mythologies.map((m, i) => (
                        <span key={m.id}>
                          {i > 0 && "、"}
                          <Link href={paths.mythology(m.slug)}>{m.name}</Link>
                        </span>
                      ))}
                    </>
                  ),
                ],
                ["属性・役割", figure.roles.join("、")],
                [
                  "主な出典",
                  getSourcesByIds(figure.sourceIds)
                    .map((s) => `${s.author}『${s.title}』`)
                    .join("、"),
                ],
              ]}
            />
          </Section>

          {figure.body.length > 0 && (
            <Section title="解説" en="Overview" id="overview">
              <ArticleBody
                blocks={figure.body}
                claims={[]}
                sources={[]}
                images={[]}
              />
            </Section>
          )}

          {stories.length > 0 && (
            <Section title="関係する神話・物語" en="Stories" id="stories">
              <StoryList stories={stories} />
            </Section>
          )}

          <Section
            title={`${figure.name}の関連記事`}
            en="Articles"
            id="articles"
          >
            <ArticleList articles={articles} columns={2} />
          </Section>

          {works.length > 0 && (
            <Section title="モチーフとして登場する作品" en="Works" id="works">
              <ChipList
                items={works.map((w) => ({
                  href: paths.work(w.slug),
                  label: `『${w.title}』`,
                }))}
              />
            </Section>
          )}

          <SourceRefs sourceIds={figure.sourceIds} />
        </div>
        <aside aria-label="関連する人物・怪物">
          {related.length > 0 && (
            <Section title="関連する人物・怪物" as="h2" id="related">
              <TileList
                items={related.map((f) => ({
                  ...figureTile(f),
                  description: undefined,
                }))}
              />
            </Section>
          )}
        </aside>
      </div>
    </>
  )
}

export default Page
