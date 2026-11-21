import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { Link } from "@/components/common/Link"
import { ChipList, PageHeader, Section } from "@/components/common/PageParts"
import { JsonLd } from "@/components/seo/JsonLd"
import { figureTypes, motifAspects } from "@/lib/content/schema"
import {
  getArticlesForFigure,
  getCharactersForFigure,
  getFiguresForMythology,
  getMythologies,
  getWorksByIds,
} from "@/lib/content/repository"
import { buildMetadata, itemListJsonLd } from "@/lib/seo"
import { paths } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font } from "@/lib/styles/theme"

export const metadata = buildMetadata({
  title: "神話から逆引き｜この神・怪物が元ネタのキャラクター",
  description:
    "ギリシャ・北欧・日本・エジプト・ケルト・メソポタミア・インド・中国・アステカ・フィンランド・スラヴ・ポリネシアなど各地の神話の神々・英雄・怪物から、それを元ネタ・モチーフにしたアニメ・漫画のキャラクターを逆引きできます。",
  path: paths.origins(),
})

const styles = css`
  .t-rev {
    border-top: 1px solid ${color.border};
  }
  .t-rev__row {
    display: grid;
    gap: 10px;
    padding: 18px 0;
    border-bottom: 1px solid ${color.border};
  }
  @media ${bp.md} {
    .t-rev__row {
      grid-template-columns: 240px 1fr;
      gap: 24px;
    }
  }
  .t-rev__type {
    font-size: 0.75rem;
    color: ${color.accentDeep};
    letter-spacing: 0.06em;
  }
  .t-rev__name {
    font-family: ${font.display};
    font-size: 1.15rem;
    font-weight: 600;
    color: ${color.ink};
  }
  .t-rev__name a {
    color: inherit;
    text-decoration: none;
  }
  .t-rev__name a:hover {
    color: ${color.accentDeep};
    text-decoration: underline;
  }
  .t-rev__meta {
    font-size: 0.8rem;
    color: ${color.muted};
  }
  .t-rev__chars {
    display: grid;
    gap: 8px;
  }
  .t-rev__char {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    font-size: 0.92rem;
  }
  .t-rev__char a {
    font-weight: 600;
  }
  .t-rev__work {
    color: ${color.muted};
    font-size: 0.85rem;
  }
  .t-rev__aspect {
    font-size: 0.72rem;
    border: 1.5px solid ${color.line};
    padding: 0 8px;
    border-radius: 999px;
    color: ${color.muted};
  }
`

const Page = () => {
  const groups = getMythologies()
    .filter((m) => !m.comingSoon)
    .map((mythology) => {
      const figures = getFiguresForMythology(mythology)
      return {
        mythology,
        withCharacters: figures.filter(
          (f) => getCharactersForFigure(f).length > 0
        ),
        withoutCharacters: figures.filter(
          (f) =>
            getCharactersForFigure(f).length === 0 &&
            getArticlesForFigure(f).length > 0
        ),
      }
    })
  const listed = groups.flatMap((g) => g.withCharacters)
  return (
    <>
      <Style id="origins">{styles}</Style>
      <Breadcrumbs
        items={[{ name: "神話から逆引き", href: paths.origins() }]}
      />
      <JsonLd
        data={itemListJsonLd(
          listed.map((f) => ({ name: f.name, href: paths.figure(f.slug) }))
        )}
      />
      <PageHeader
        eyebrow="Reverse Lookup"
        title="神話から逆引き"
        description="神話の神々・英雄・怪物から、それを元ネタ（モチーフ）にしたキャラクターを探せます。キャラクター名をクリックすると、作品の設定と原典の神話を比べた解説ページに移動します。"
      />
      {groups.map(({ mythology, withCharacters, withoutCharacters }) => (
        <Section
          key={mythology.id}
          title={mythology.name}
          en="Mythology"
          id={`myth-${mythology.slug}`}
          more={{
            href: paths.mythology(mythology.slug),
            label: `${mythology.name}とは`,
          }}
        >
          {withCharacters.length === 0 ? (
            <p className="t-empty">キャラクターの登録は準備中です。</p>
          ) : (
            <div className="t-rev">
              {withCharacters.map((figure) => {
                const characters = getCharactersForFigure(figure)
                return (
                  <div key={figure.id} className="t-rev__row">
                    <div>
                      <p className="t-rev__type">
                        {figureTypes[figure.type]}
                        {figure.romanized && ` · ${figure.romanized}`}
                      </p>
                      <h3 className="t-rev__name">
                        <Link href={paths.figure(figure.slug)}>
                          {figure.name}
                        </Link>
                      </h3>
                      <p className="t-rev__meta">
                        元ネタのキャラクター {characters.length}
                        {getArticlesForFigure(figure).length > 0 &&
                          ` ・ 解説記事 ${getArticlesForFigure(figure).length}`}
                      </p>
                    </div>
                    <ul className="t-rev__chars">
                      {characters.map((c) => {
                        const work = getWorksByIds([c.workId])[0]
                        const motif = c.motifs.find(
                          (m) => m.figureId === figure.id
                        )
                        return (
                          <li key={c.id} className="t-rev__char">
                            <Link href={paths.character(c.slug)}>{c.name}</Link>
                            {work && (
                              <span className="t-rev__work">
                                『{work.title}』
                              </span>
                            )}
                            {motif && (
                              <span className="t-rev__aspect">
                                {motifAspects[motif.aspect]}
                              </span>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
          {withoutCharacters.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <p className="t-meta" style={{ marginBottom: 8 }}>
                解説記事のある神々・怪物（キャラクターは準備中）
              </p>
              <ChipList
                items={withoutCharacters.map((f) => ({
                  href: paths.figure(f.slug),
                  label: f.name,
                }))}
              />
            </div>
          )}
        </Section>
      ))}
    </>
  )
}

export default Page
