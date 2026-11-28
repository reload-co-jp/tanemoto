import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { OriginSummary } from "@/components/character/OriginSummary"
import { AdSlot } from "@/components/common/AdSlot"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { ImageFigure } from "@/components/common/ImageFigure"
import { InfoTable } from "@/components/common/InfoTable"
import { Link } from "@/components/common/Link"
import { ChipList, PageHeader, Section } from "@/components/common/PageParts"
import { SourceRefs } from "@/components/common/SourceRefs"
import { workTypes } from "@/lib/content/schema"
import {
  getArticles,
  getArticlesForWork,
  getCharactersForWork,
  getImage,
  getWorkImage,
  getMotifFigures,
  getMythologiesByIds,
  getWork,
  getWorks,
} from "@/lib/content/repository"
import { JsonLd } from "@/components/seo/JsonLd"
import { buildMetadata, workJsonLd } from "@/lib/seo"
import { groupByKind, kindsLabel } from "@/lib/entryKind"
import { paths, site } from "@/lib/site"
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
    title: `『${work.title}』${kindsLabel(characters)}の元ネタ一覧｜神話・伝承のモチーフ`,
    description: `『${work.title}』に登場する${characters
      .slice(0, 4)
      .map((c) => c.name)
      .join(
        "・"
      )}などの${kindsLabel(characters)}の元ネタ・モチーフを、原典の神話とあわせて解説します。`.slice(
      0,
      160
    ),
    path: paths.work(work.slug),
    image: getWorkImage(work),
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
  .t-work-visual {
    max-width: 520px;
    margin: 0 auto 32px;
  }
  .t-work-text p + p {
    margin-top: 1em;
  }
  .t-highlights {
    display: grid;
    gap: 16px;
    counter-reset: highlight;
  }
  .t-highlights h3 {
    font-size: 1.05rem;
    margin-bottom: 4px;
  }
  .t-highlights h3::before {
    counter-increment: highlight;
    content: counter(highlight) ". ";
    color: ${color.accentDeep};
  }
  .t-gallery {
    display: grid;
    gap: 20px;
  }
  @media ${bp.md} {
    .t-gallery {
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
  // 作品の画像 → キャラクターの画像 → 元ネタ人物の画像の順に、重複なしで掲載する
  const visuals = [
    ...work.imageIds.map((id) => ({ id, caption: undefined })),
    ...characters.map((c) => ({ id: c.imageId, caption: c.name })),
    ...motifFigures.map((f) => ({
      id: f.imageId,
      caption: `元ネタ：${f.name}`,
    })),
  ]
    .filter((v, i, a) => a.findIndex((x) => x.id === v.id) === i)
    .flatMap(({ id, caption }) => {
      const image = getImage(id)
      return image ? [{ image, caption }] : []
    })
  const [keyVisual, ...gallery] = visuals
  return (
    <>
      <Style id="work">{styles}</Style>
      <JsonLd data={workJsonLd(work, characters, getWorkImage(work))} />
      <Breadcrumbs
        items={[
          { name: "作品", href: paths.works() },
          { name: `『${work.title}』`, href: paths.work(work.slug) },
        ]}
      />
      <PageHeader
        eyebrow={`${workTypes[work.type]} · Works`}
        title={`『${work.title}』${kindsLabel(characters)}の元ネタ`}
        description={work.description}
      />
      {keyVisual && (
        <div className="t-work-visual">
          <ImageFigure {...keyVisual} eager />
        </div>
      )}
      {work.world && (
        <Section title="世界観" en="World" id="world">
          <Paragraphs text={work.world} />
        </Section>
      )}
      {work.synopsis && (
        <Section title="あらすじ" en="Story" id="story">
          <Paragraphs text={work.synopsis} />
        </Section>
      )}

      <AdSlot slot={site.adSlots.inArticle} variant="in-article" />

      {characters.length > 0 ? (
        groupByKind(characters).map((group, i, groups) => (
          <Section
            key={group.kind}
            title={`${group.label}と元ネタ`}
            en={`${group.en}s`}
            id={group.kind === "character" ? "characters" : `${group.kind}s`}
          >
            <div className="t-origin-grid">
              {group.entries.map((c) => (
                <OriginSummary key={c.id} character={c} />
              ))}
            </div>
            {i === groups.length - 1 && (
              <p className="t-disclaimer">
                ※
                作品内の設定（CREATIVE）と神話・伝承の内容は別のものです。各ページで、作品の設定と原典の内容を区別して解説しています。
              </p>
            )}
          </Section>
        ))
      ) : (
        <Section title="キャラクターと元ネタ" en="Characters" id="characters">
          <p className="t-empty">キャラクターの元ネタ解説は準備中です。</p>
        </Section>
      )}

      {work.highlights.length > 0 && (
        <Section title="みどころ" en="Highlights" id="highlights">
          <div className="t-highlights">
            {work.highlights.map((h) => (
              <div key={h.title}>
                <h3>{h.title}</h3>
                <Paragraphs text={h.text} />
              </div>
            ))}
          </div>
        </Section>
      )}
      {gallery.length > 0 && (
        <Section title="画像で見る元ネタ" en="Gallery" id="gallery">
          <div className="t-gallery">
            {gallery.map((v) => (
              <ImageFigure key={v.image.id} {...v} />
            ))}
          </div>
        </Section>
      )}

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

/** 空行区切りの段落 */
const Paragraphs = ({ text }: { text: string }) => (
  <div className="t-work-text">
    {text.split(/\n{2,}/).map((p, i) => (
      <p key={i}>{p}</p>
    ))}
  </div>
)

export default Page
