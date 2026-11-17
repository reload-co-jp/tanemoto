import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { OriginSummary } from "@/components/character/OriginSummary"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { InfoTable } from "@/components/common/InfoTable"
import { Link } from "@/components/common/Link"
import { ChipList, PageHeader, Section } from "@/components/common/PageParts"
import { SourceRefs } from "@/components/common/SourceRefs"
import { workTypes } from "@/lib/content/schema"
import {
  getArticles,
  getArticlesForWork,
  getCharactersForWork,
  getMotifFigures,
  getMythologiesByIds,
  getWork,
  getWorks,
} from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color } from "@/lib/styles/theme"

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
  const characters = getCharactersForWork(work)
  return buildMetadata({
    title: `『${work.title}』キャラクターの元ネタ一覧｜神話・伝承のモチーフ`,
    description: `『${work.title}』に登場する${characters
      .slice(0, 4)
      .map((c) => c.name)
      .join(
        "・"
      )}などのキャラクターの元ネタ・モチーフを、原典の神話とあわせて解説します。`.slice(
      0,
      160
    ),
    path: paths.work(work.slug),
    noindex: characters.length === 0 && getArticlesForWork(work).length === 0,
  })
}

const styles = css`
  .t-origin-grid {
    display: grid;
    gap: 16px;
  }
  @media ${bp.md} {
    .t-origin-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
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
  const characters = getCharactersForWork(work)
  const direct = getArticlesForWork(work)
  const motifFigures = [...new Set(characters.flatMap(getMotifFigures))]
  const motifArticles = getArticles().filter(
    (a) =>
      !direct.includes(a) &&
      a.figureIds.some((id) => motifFigures.some((f) => f.id === id))
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
        title={`『${work.title}』キャラクターの元ネタ`}
        description={work.description}
      />

      <Section title="キャラクターと元ネタ" en="Characters" id="characters">
        {characters.length > 0 ? (
          <>
            <div className="t-origin-grid">
              {characters.map((c) => (
                <OriginSummary key={c.id} character={c} />
              ))}
            </div>
            <p className="t-disclaimer">
              ※
              作品内の設定（CREATIVE）と神話・伝承の内容は別のものです。各キャラクターのページで、作品の設定と原典の内容を区別して解説しています。
            </p>
          </>
        ) : (
          <p className="t-empty">キャラクターの元ネタ解説は準備中です。</p>
        )}
      </Section>

      {motifArticles.length > 0 && (
        <Section
          title="元ネタの神話を解説した記事"
          en="Background"
          id="background"
        >
          <ArticleList articles={motifArticles} columns={2} />
        </Section>
      )}
      {direct.length > 0 && (
        <Section title="この作品に関する記事" en="Articles" id="articles">
          <ArticleList articles={direct} columns={2} />
        </Section>
      )}
      {motifFigures.length > 0 && (
        <Section title="元ネタになった人物・怪物" en="Figures" id="figures">
          <ChipList
            items={motifFigures.map((f) => ({
              href: paths.figure(f.slug),
              label: f.name,
            }))}
          />
        </Section>
      )}

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
      <SourceRefs sourceIds={work.sourceIds} />
    </>
  )
}

export default Page
