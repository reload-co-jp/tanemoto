import {
  ClassificationLabel,
  classificationInfo,
} from "@/components/common/ClassificationLabel"
import type { Block, Claim, Image, Source } from "@/lib/content/schema"
import { headingAnchors } from "@/lib/content/text"
import { assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import {
  bp,
  classificationColor,
  color,
  font,
  layout,
} from "@/lib/styles/theme"
import { ClaimMarks } from "./ClaimMarks"
import { Inline } from "./Inline"

const styles = css`
  .t-body {
    max-width: ${layout.measure};
    font-size: 1rem;
    line-height: 2;
  }
  @media ${bp.md} {
    .t-body {
      font-size: 1.04rem;
    }
  }
  .t-body > * + * {
    margin-top: 1.4em;
  }
  .t-body h2 {
    font-size: 1.4rem;
    margin-top: 2.6em;
    padding: 0.2em 0 0.5em;
    border-bottom: 1px solid ${color.border};
    position: relative;
  }
  .t-body h2::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 3em;
    height: 2px;
    background: ${color.accent};
  }
  .t-body h3 {
    font-size: 1.15rem;
    margin-top: 2em;
    padding-left: 0.8em;
    border-left: 3px solid ${color.accent};
  }
  .t-body h2 + *,
  .t-body h3 + * {
    margin-top: 1em;
  }
  .t-body ul,
  .t-body ol {
    padding-left: 1.6em;
  }
  .t-body li + li {
    margin-top: 0.4em;
  }
  .t-body li::marker {
    color: ${color.accent};
  }
  .t-body strong {
    font-weight: 700;
    background: linear-gradient(transparent 65%, ${color.accentPale} 65%);
  }
  .t-claim-marks {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-left: 6px;
    vertical-align: baseline;
  }
  .t-claim-mark {
    display: inline-flex;
    align-items: flex-start;
  }
  .t-claim-num {
    font-size: 0.65rem;
    line-height: 1;
    margin-left: 1px;
  }
  .t-claim-num a {
    text-decoration: none;
    color: ${color.muted};
  }
  .t-quote {
    margin-left: 0;
    margin-right: 0;
    padding: 1.2em 1.4em;
    background: ${color.paper};
    border-left: 3px solid ${color.ink};
    font-family: ${font.display};
  }
  .t-quote p {
    font-size: 1.02em;
  }
  .t-quote footer {
    margin-top: 0.6em;
    font-family: ${font.sans};
    font-size: 0.8rem;
    color: ${color.muted};
  }
  .t-note {
    border: 2.5px solid ${color.ink};
    background: ${color.paper};
    padding: 1.1em 1.3em;
    border-radius: 14px;
    box-shadow: 4px 4px 0 ${color.ink};
  }
  .t-note__head {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 0.5em;
    font-family: ${font.display};
    font-weight: 600;
    color: ${color.ink};
  }
  ${Object.entries(classificationColor)
    .map(([k, c]) => `.t-note--${k}{border-left:8px solid ${c.fg};}`)
    .join("")}
  .t-figure img {
    width: 100%;
    height: auto;
    border: 2.5px solid ${color.ink};
    border-radius: 14px;
  }
  .t-figure figcaption {
    font-size: 0.8rem;
    color: ${color.muted};
    margin-top: 6px;
    line-height: 1.6;
  }
`

export const ArticleBody = ({
  blocks,
  claims,
  sources,
  images,
}: {
  blocks: Block[]
  claims: Claim[]
  sources: Source[]
  images: Image[]
}) => {
  const anchors = headingAnchors(blocks)
  return (
    <div className="t-body">
      <Style id="body">{styles}</Style>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const H = block.level === 2 ? "h2" : "h3"
            return (
              <H key={i} id={anchors.get(i)}>
                <Inline text={block.text} />
              </H>
            )
          }
          case "paragraph":
            return (
              <p key={i}>
                <Inline text={block.text} />
                <ClaimMarks claimIds={block.claimIds} claims={claims} />
              </p>
            )
          case "list": {
            const L = block.ordered ? "ol" : "ul"
            return (
              <div key={i}>
                <L>
                  {block.items.map((item, j) => (
                    <li key={j}>
                      <Inline text={item} />
                    </li>
                  ))}
                </L>
                {block.claimIds.length > 0 && (
                  <p className="t-meta">
                    根拠：
                    <ClaimMarks claimIds={block.claimIds} claims={claims} />
                  </p>
                )}
              </div>
            )
          }
          case "quote": {
            const source = sources.find((s) => s.id === block.sourceId)
            return (
              <blockquote key={i} className="t-quote">
                <p>
                  <Inline text={block.text} />
                </p>
                <footer>
                  ——
                  {source
                    ? `${source.author}『${source.title}』`
                    : block.sourceId}
                  {block.location && ` ${block.location}`}
                  {block.translationNote && `（${block.translationNote}）`}
                  <ClaimMarks claimIds={block.claimIds} claims={claims} />
                </footer>
              </blockquote>
            )
          }
          case "note":
            return (
              <aside
                key={i}
                className={`t-note t-note--${block.classification}`}
                aria-label={
                  block.title ?? classificationInfo[block.classification].ja
                }
              >
                <p className="t-note__head">
                  <ClassificationLabel classification={block.classification} />
                  {block.title ?? classificationInfo[block.classification].ja}
                </p>
                <p>
                  <Inline text={block.text} />
                  <ClaimMarks claimIds={block.claimIds} claims={claims} />
                </p>
              </aside>
            )
          case "image": {
            const image = images.find((img) => img.id === block.imageId)
            if (!image) return null
            return (
              <figure key={i} className="t-figure">
                <img
                  src={assetPath(image.src)}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  {block.caption && (
                    <>
                      {block.caption}
                      <br />
                    </>
                  )}
                  {image.aiGenerated &&
                    "【AI生成画像・実在の史料ではありません】"}
                  出典：{image.credit}（{image.license}）
                </figcaption>
              </figure>
            )
          }
        }
      })}
    </div>
  )
}
