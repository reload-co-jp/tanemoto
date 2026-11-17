import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { ClassificationLabel } from "@/components/common/ClassificationLabel"
import { InfoTable } from "@/components/common/InfoTable"
import { Link } from "@/components/common/Link"
import { ChipList, PageHeader, Section } from "@/components/common/PageParts"
import { SourceRefs } from "@/components/common/SourceRefs"
import { workTypes } from "@/lib/content/schema"
import {
  getArticles,
  getArticlesForWork,
  getFiguresByIds,
  getMythologiesByIds,
  getWork,
  getWorks,
} from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => {
  const works = getWorks()
  // 静的出力では最低1件のパラメータが必要（作品0件の初期状態でもビルドできるように）
  return works.length > 0
    ? works.map((w) => ({ slug: w.slug }))
    : [{ slug: "_" }]
}

export const generateMetadata = async ({ params }: Props) => {
  const work = getWork((await params).slug)
  if (!work) return {}
  return buildMetadata({
    title: `『${work.title}』に登場する神話・伝承の元ネタ`,
    description: work.description,
    path: paths.work(work.slug),
    noindex: getArticlesForWork(work).length === 0,
  })
}

const styles = css`
  .t-chars {
    list-style: none;
    border-top: 1px solid ${color.border};
  }
  .t-chars li {
    padding: 14px 0;
    border-bottom: 1px solid ${color.border};
    display: grid;
    gap: 4px;
  }
  .t-chars__name {
    font-family: ${font.serif};
    font-weight: 600;
    color: ${color.navy};
  }
  .t-chars__motif {
    font-size: 0.88rem;
  }
  .t-chars__note {
    font-size: 0.85rem;
    color: ${color.muted};
    display: flex;
    gap: 8px;
    align-items: baseline;
  }
  .t-disclaimer {
    font-size: 0.8rem;
    color: ${color.muted};
    margin-top: 12px;
  }
`

const Page = async ({ params }: Props) => {
  const work = getWork((await params).slug)
  if (!work) notFound()
  const mythologies = getMythologiesByIds(work.mythologyIds)
  const direct = getArticlesForWork(work)
  // 作品のキャラクターのモチーフとなった人物を扱う記事
  const motifFigureIds = work.characters.flatMap((c) =>
    c.figureId ? [c.figureId] : []
  )
  const motifArticles = getArticles().filter(
    (a) =>
      !direct.includes(a) &&
      a.figureIds.some((id) => motifFigureIds.includes(id))
  )
  return (
    <>
      <Style id="work">{styles}</Style>
      <Breadcrumbs
        items={[
          { name: "作品", href: paths.works() },
          { name: `『${work.title}』`, href: paths.work(work.slug) },
        ]}
      />
      <PageHeader
        eyebrow={`${workTypes[work.type]} · Works`}
        title={`『${work.title}』`}
        description={work.description}
      />
      <Section title="作品概要" en="About" id="about">
        <InfoTable
          rows={[
            ["作品名", `『${work.title}』`],
            ["作者", work.author],
            [
              "媒体",
              [work.type, ...work.mediaTypes]
                .map((t) => workTypes[t])
                .filter((v, i, a) => a.indexOf(v) === i)
                .join("・"),
            ],
            ["期間", work.period],
            [
              "関連する神話",
              mythologies.map((m, i) => (
                <span key={m.id}>
                  {i > 0 && "、"}
                  <Link href={paths.mythology(m.slug)}>{m.name}</Link>
                </span>
              )),
            ],
          ]}
        />
      </Section>
      {work.characters.length > 0 && (
        <Section
          title="神話・伝承に由来するキャラクター"
          en="Characters"
          id="characters"
        >
          <ul className="t-chars">
            {work.characters.map((c) => {
              const figure = c.figureId
                ? getFiguresByIds([c.figureId])[0]
                : undefined
              return (
                <li key={c.name}>
                  <span className="t-chars__name">{c.name}</span>
                  {figure && (
                    <span className="t-chars__motif">
                      神話上のモチーフ：
                      <Link href={paths.figure(figure.slug)}>
                        {figure.name}
                      </Link>
                    </span>
                  )}
                  {c.note && (
                    <span className="t-chars__note">
                      <ClassificationLabel classification="creative" />
                      {c.note}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="t-disclaimer">
            ※
            作品内の設定（CREATIVE）と神話・伝承の内容は別のものです。神話上の人物の詳細は各人物ページをご覧ください。
          </p>
        </Section>
      )}
      <Section title="この作品に関する記事" en="Articles" id="articles">
        <ArticleList articles={direct} columns={2} />
      </Section>
      {motifArticles.length > 0 && (
        <Section
          title="モチーフとなった神話の解説記事"
          en="Background"
          id="background"
        >
          <ArticleList articles={motifArticles} columns={2} />
        </Section>
      )}
      {motifFigureIds.length > 0 && (
        <Section title="モチーフとなった人物・怪物" en="Figures" id="figures">
          <ChipList
            items={getFiguresByIds(motifFigureIds).map((f) => ({
              href: paths.figure(f.slug),
              label: f.name,
            }))}
          />
        </Section>
      )}
      <SourceRefs sourceIds={work.sourceIds} />
    </>
  )
}

export default Page
