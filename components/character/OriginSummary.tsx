import { Link } from "@/components/common/Link"
import { stripInline } from "@/lib/content/text"
import { motifAspects, type Character } from "@/lib/content/schema"
import { getFiguresByIds, getWorksByIds } from "@/lib/content/repository"
import { paths } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { winCss } from "@/lib/styles/global"
import { bp, color, font } from "@/lib/styles/theme"

const styles = css`
  ${winCss(".t-origin")}
  .t-origin {
    padding: 18px 20px;
    padding-top: 46px;
  }
  .t-origin__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 12px;
    margin-bottom: 12px;
  }
  .t-origin__eyebrow {
    font-family: ${font.pop};
    font-size: 0.7rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: ${color.accentDeep};
    width: 100%;
  }
  .t-origin__name {
    font-family: ${font.display};
    font-size: 1.2rem;
    font-weight: 600;
    color: ${color.ink};
  }
  .t-origin__name a {
    color: inherit;
  }
  .t-origin__work {
    font-size: 0.85rem;
    color: ${color.muted};
  }
  .t-origin__rows {
    display: grid;
    grid-template-columns: 6.5em 1fr;
    font-size: 0.9rem;
    border-top: 1px solid ${color.border};
  }
  @media ${bp.sm} {
    .t-origin__rows {
      grid-template-columns: 8em 1fr;
    }
  }
  .t-origin__rows dt,
  .t-origin__rows dd {
    padding: 8px 0;
    border-bottom: 1px solid ${color.border};
    line-height: 1.7;
  }
  .t-origin__rows dt {
    color: ${color.accentDeep};
    font-weight: 600;
    font-size: 0.82rem;
  }
  .t-origin__more {
    display: inline-block;
    margin-top: 10px;
    font-size: 0.85rem;
  }
`

/**
 * 元ネタ早見。キャラクター名 → 名前の由来 → モチーフ（元ネタ）を一覧で示す。
 */
export const OriginSummary = ({
  character,
  linkToCharacter = true,
  headingLevel = 3,
}: {
  character: Character
  linkToCharacter?: boolean
  headingLevel?: 2 | 3
}) => {
  const work = getWorksByIds([character.workId])[0]
  const H = `h${headingLevel}` as "h2" | "h3"
  return (
    <section
      className="t-origin"
      data-title="Origin.txt"
      aria-label={`${character.name}の元ネタ早見`}
    >
      <Style id="origin">{styles}</Style>
      <div className="t-origin__head">
        <span className="t-origin__eyebrow">Origin — 元ネタ早見</span>
        <H className="t-origin__name">
          {linkToCharacter ? (
            <Link href={paths.character(character.slug)}>{character.name}</Link>
          ) : (
            character.name
          )}
        </H>
        {work && (
          <span className="t-origin__work">
            『<Link href={paths.work(work.slug)}>{work.title}</Link>』
          </span>
        )}
      </div>
      <dl className="t-origin__rows">
        {character.nameOrigin && (
          <div style={{ display: "contents" }}>
            <dt>名前の由来</dt>
            <dd>{stripInline(character.nameOrigin.text)}</dd>
          </div>
        )}
        {character.motifs.map((motif, i) => {
          const figure = motif.figureId
            ? getFiguresByIds([motif.figureId])[0]
            : undefined
          return (
            <div key={i} style={{ display: "contents" }}>
              <dt>
                {i === 0 ? "主な元ネタ" : "元ネタ"}
                <br />
                <small>（{motifAspects[motif.aspect]}）</small>
              </dt>
              <dd>
                {figure ? (
                  <Link href={paths.figure(figure.slug)}>{motif.label}</Link>
                ) : (
                  motif.label
                )}
              </dd>
            </div>
          )
        })}
      </dl>
      {linkToCharacter && (
        <Link href={paths.character(character.slug)} className="t-origin__more">
          {character.name}の元ネタを詳しく見る →
        </Link>
      )}
    </section>
  )
}
