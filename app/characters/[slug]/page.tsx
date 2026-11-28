import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { ClaimList, SourceList } from "@/components/article/SourceList"
import { EvidenceText } from "@/components/character/EvidenceText"
import { OriginSummary } from "@/components/character/OriginSummary"
import { AdSlot } from "@/components/common/AdSlot"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { Link } from "@/components/common/Link"
import { PageHeader, Section, TileList } from "@/components/common/PageParts"
import { StoryList } from "@/components/common/StoryList"
import {
  entryKinds,
  motifAspects,
  figureTypes,
  type Character,
  type Figure,
  type Work,
} from "@/lib/content/schema"
import {
  getArticlesForCharacter,
  getCharacter,
  getCharacterImage,
  getCharacters,
  getCharactersForWork,
  getCharactersWithSameMotif,
  getFiguresByIds,
  getMotifFigures,
  getMythologies,
  getOriginArticlesForCharacter,
  getSourcesByIds,
  getStoriesForFigure,
  getWorksByIds,
} from "@/lib/content/repository"
import { stripInline } from "@/lib/content/text"
import { characterTile } from "@/lib/characterTile"
import { kindLabel, kindsLabel } from "@/lib/entryKind"
import { JsonLd } from "@/components/seo/JsonLd"
import { buildMetadata, characterJsonLd } from "@/lib/seo"
import { paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { winCss } from "@/lib/styles/global"
import { bp, color, font } from "@/lib/styles/theme"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => {
  const characters = getCharacters()
  return characters.length > 0
    ? characters.map((c) => ({ slug: c.slug }))
    : [{ slug: "_" }]
}

export const generateMetadata = async ({ params }: Props) => {
  const character = getCharacter((await params).slug)
  if (!character) return {}
  const work = getWorksByIds([character.workId])[0]
  return buildMetadata({
    title: `${character.name}（${work ? `${work.title}` : "作品"}）の元ネタは？${character.motifs[0].label}の${mainOriginNoun(character)}`,
    description: characterDescription(character, work),
    path: paths.character(character.slug),
    image: getCharacterImage(character),
  })
}

/** 元ネタの人物が属する体系に応じた呼び方（神話・伝説・逸話・原作） */
const originNoun = (figure?: Figure) => {
  const kind =
    getMythologies().find((m) => figure?.mythologyIds.includes(m.id))?.kind ??
    "myth"
  return { myth: "神話", legend: "伝説", history: "逸話", literature: "原作" }[
    kind
  ]
}

const mainOriginNoun = (character: Character) => {
  const figureId = character.motifs[0].figureId
  return originNoun(figureId ? getFiguresByIds([figureId])[0] : undefined)
}

const characterDescription = (character: Character, work?: Work) => {
  const noun = mainOriginNoun(character)
  const labels = character.motifs.map((m) => m.label).join("・")
  const subject =
    character.kind === "character"
      ? character.name
      : `${kindLabel(character)}「${character.name}」`
  return `『${work?.title ?? ""}』の${subject}の元ネタ・モチーフ（${labels}）を、名前の由来から原典の${noun}まで解説。作品の設定と${noun}の内容を区別して紹介します。`.slice(
    0,
    160
  )
}

const styles = css`
  .t-char__lead {
    font-family: ${font.display};
    font-size: 1.05rem;
    line-height: 1.9;
    color: ${color.charcoal};
  }
  .t-char__lead strong {
    color: ${color.ink};
  }
  .t-char__block {
    max-width: 40em;
    line-height: 2;
  }
  .t-char__block + .t-char__block {
    margin-top: 12px;
  }
  ${winCss(".t-motif")}
  .t-motif {
    padding: 20px;
    padding-top: 48px;
  }
  .t-motif + .t-motif {
    margin-top: 20px;
  }
  .t-motif__aspect {
    font-size: 0.75rem;
    color: ${color.accentDeep};
    letter-spacing: 0.08em;
  }
  .t-motif__label {
    font-size: 1.15rem;
    margin: 2px 0 14px;
  }
  .t-motif__grid {
    display: grid;
    gap: 14px;
  }
  @media ${bp.md} {
    .t-motif__grid {
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
  }
  .t-motif__col h4 {
    font-family: ${font.sans};
    font-size: 0.8rem;
    color: ${color.muted};
    font-weight: 600;
    margin-bottom: 4px;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .t-motif__col p {
    font-size: 0.95rem;
    line-height: 1.9;
  }
  .t-motif__figure {
    margin-top: 14px;
    font-size: 0.85rem;
  }
  .t-compare {
    padding-left: 1.4em;
    max-width: 40em;
    line-height: 1.9;
  }
  .t-compare li + li {
    margin-top: 8px;
  }
`

const Page = async ({ params }: Props) => {
  const character = getCharacter((await params).slug)
  if (!character) notFound()
  const work = getWorksByIds([character.workId])[0]
  const motifFigures = getMotifFigures(character)
  const stories = [...new Set(motifFigures.flatMap(getStoriesForFigure))]
  const directArticles = getArticlesForCharacter(character)
  const originArticles = getOriginArticlesForCharacter(character)
  const sameMotif = getCharactersWithSameMotif(character)
  const sameWork = getCharactersForWork(work).filter(
    (c) => c.id !== character.id
  )
  const sources = getSourcesByIds(character.sourceIds)
  const claims = character.claims
  const main = character.motifs[0]

  return (
    <>
      <Style id="character">{styles}</Style>
      <JsonLd
        data={characterJsonLd(
          character,
          work,
          motifFigures,
          characterDescription(character, work),
          getCharacterImage(character)
        )}
      />
      <Breadcrumbs
        items={[
          { name: "キャラクター・設定", href: paths.characters() },
          ...(work
            ? [{ name: `『${work.title}』`, href: paths.work(work.slug) }]
            : []),
          { name: character.name, href: paths.character(character.slug) },
        ]}
      />
      <PageHeader
        eyebrow={`${entryKinds[character.kind].en}${work ? ` · ${work.title}` : ""}`}
        title={`${character.name}の元ネタ`}
      >
        <p className="t-char__lead" style={{ marginTop: 12 }}>
          『{work?.title}』の
          {character.kind !== "character" && `${kindLabel(character)}`}
          <strong>
            {character.kind === "character"
              ? character.name
              : `「${character.name}」`}
          </strong>
          {character.reading && `（${character.reading}）`}
          の主な元ネタは、<strong>{main.label}</strong>です。
        </p>
      </PageHeader>

      <div className="t-two-col">
        <div>
          <OriginSummary
            character={character}
            linkToCharacter={false}
            headingLevel={2}
          />

          <Section title="作品での位置づけ" en="In the Work" id="profile">
            <p className="t-char__block">
              <EvidenceText value={character.description} claims={claims} />
            </p>
          </Section>

          {character.nameOrigin && (
            <Section title="名前の由来" en="Name" id="name-origin">
              <p className="t-char__block">
                <EvidenceText value={character.nameOrigin} claims={claims} />
              </p>
            </Section>
          )}

          <AdSlot slot={site.adSlots.inArticle} variant="in-article" />

          <Section title="モチーフ（元ネタ）" en="Motifs" id="motifs">
            {character.motifs.map((motif, i) => {
              const figure = motif.figureId
                ? getFiguresByIds([motif.figureId])[0]
                : undefined
              return (
                <article key={i} className="t-motif" data-title="Motif.txt">
                  <p className="t-motif__aspect">
                    {i === 0 ? "主な元ネタ" : "元ネタ"} ／{" "}
                    {motifAspects[motif.aspect]}
                  </p>
                  <h3 className="t-motif__label">{motif.label}</h3>
                  <div className="t-motif__grid">
                    <div className="t-motif__col">
                      <h4>作品では</h4>
                      <p>
                        <EvidenceText value={motif.inWork} claims={claims} />
                      </p>
                    </div>
                    {motif.inMyth && (
                      <div className="t-motif__col">
                        <h4>原典の{originNoun(figure)}では</h4>
                        <p>
                          <EvidenceText value={motif.inMyth} claims={claims} />
                        </p>
                      </div>
                    )}
                  </div>
                  {figure && (
                    <p className="t-motif__figure">
                      元ネタの解説：
                      <Link href={paths.figure(figure.slug)}>
                        {figure.name}（{figureTypes[figure.type]}）
                      </Link>
                    </p>
                  )}
                </article>
              )
            })}
          </Section>

          {character.comparison.length > 0 && (
            <Section
              title="作品と原典の違い・共通点"
              en="Comparison"
              id="comparison"
            >
              <ul className="t-compare">
                {character.comparison.map((c, i) => (
                  <li key={i}>
                    <EvidenceText value={c} claims={claims} />
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {stories.length > 0 && (
            <Section
              title={`元ネタの${mainOriginNoun(character)}・物語`}
              en="Myths"
              id="myths"
            >
              <StoryList stories={stories} />
            </Section>
          )}

          {(directArticles.length > 0 || originArticles.length > 0) && (
            <Section
              title="元ネタを詳しく解説した記事"
              en="Articles"
              id="articles"
            >
              <ArticleList
                articles={[...directArticles, ...originArticles]}
                columns={2}
              />
            </Section>
          )}

          {claims.length > 0 && (
            <Section title="根拠" en="Evidence" id="evidence">
              <ClaimList claims={claims} sources={sources} />
            </Section>
          )}
          <Section title="出典" en="Sources" id="sources">
            <SourceList sources={sources} />
          </Section>
        </div>

        <aside aria-label="関連するキャラクター・設定">
          {sameMotif.length > 0 && (
            <Section
              title={`同じ元ネタの${kindsLabel(sameMotif)}`}
              id="same-motif"
            >
              <TileList items={sameMotif.map(characterTile)} />
            </Section>
          )}
          {sameWork.length > 0 && (
            <Section
              title={`『${work.title}』の${kindsLabel(sameWork)}`}
              id="same-work"
            >
              <TileList items={sameWork.map(characterTile)} />
            </Section>
          )}
          {motifFigures.length > 0 && (
            <Section title="元ネタの人物・怪物" id="motif-figures">
              <TileList
                items={motifFigures.map((f) => ({
                  href: paths.figure(f.slug),
                  title: f.name,
                  eyebrow: figureTypes[f.type],
                  description: stripInline(f.description),
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
