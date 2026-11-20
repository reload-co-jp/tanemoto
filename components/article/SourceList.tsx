import { ClassificationLabel } from "@/components/common/ClassificationLabel"
import { Link } from "@/components/common/Link"
import { sourceTypes, type Claim, type Source } from "@/lib/content/schema"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"
import { claimAnchor } from "./ClaimMarks"

const styles = css`
  .t-evidence {
    list-style: none;
    counter-reset: ev;
    font-size: 0.9rem;
    border-top: 1px solid ${color.border};
  }
  .t-evidence li {
    padding: 14px 0 14px 2.4em;
    border-bottom: 1px solid ${color.border};
    position: relative;
    scroll-margin-top: 24px;
  }
  .t-evidence li:target {
    background: ${color.accentPale};
  }
  .t-evidence__num {
    position: absolute;
    left: 0;
    top: 14px;
    font-family: ${font.pop};
    color: ${color.accentDeep};
    width: 2em;
    text-align: right;
  }
  .t-evidence__text {
    margin: 6px 0 4px;
    line-height: 1.7;
  }
  .t-evidence__src {
    color: ${color.muted};
    font-size: 0.82rem;
  }
  .t-evidence__note {
    color: ${color.muted};
    font-size: 0.82rem;
    margin-top: 4px;
  }
  .t-sources {
    list-style: none;
    font-size: 0.9rem;
  }
  .t-sources li {
    padding: 12px 0;
    border-bottom: 1px solid ${color.border};
    line-height: 1.7;
  }
  .t-sources__type {
    display: inline-block;
    font-size: 0.7rem;
    border: 1.5px solid ${color.line};
    color: ${color.ink};
    font-weight: 700;
    padding: 1px 8px;
    margin-right: 8px;
    border-radius: 999px;
    vertical-align: 0.1em;
  }
  .t-sources__title {
    font-weight: 600;
  }
  .t-sources__meta {
    color: ${color.muted};
    font-size: 0.82rem;
  }
  .t-sources__notes {
    color: ${color.muted};
    font-size: 0.82rem;
    margin-top: 2px;
  }
`

export const sourceLabel = (source: Source) =>
  `${source.author}『${source.title}』`

/** 本文中の主張と、その根拠（出典・該当箇所）の一覧 */
export const ClaimList = ({
  claims,
  sources,
}: {
  claims: Claim[]
  sources: Source[]
}) => (
  <>
    <Style id="sources">{styles}</Style>
    <ol className="t-evidence">
      {claims.map((claim, i) => {
        const claimSources = sources.filter((s) =>
          claim.sourceIds.includes(s.id)
        )
        return (
          <li key={claim.id} id={claimAnchor(claim.id)}>
            <span className="t-evidence__num">{i + 1}.</span>
            <ClassificationLabel classification={claim.classification} showJa />
            <p className="t-evidence__text">{claim.text}</p>
            {claimSources.length > 0 && (
              <p className="t-evidence__src">
                根拠：{claimSources.map(sourceLabel).join("、")}
                {claim.sourceLocation && ` ／ ${claim.sourceLocation}`}
              </p>
            )}
            {claim.note && <p className="t-evidence__note">※ {claim.note}</p>}
          </li>
        )
      })}
    </ol>
  </>
)

/** 参考文献の一覧 */
export const SourceList = ({ sources }: { sources: Source[] }) => (
  <>
    <Style id="sources">{styles}</Style>
    <ul className="t-sources">
      {sources.map((source) => (
        <li key={source.id} id={`source-${source.id}`}>
          <span className="t-sources__type">{sourceTypes[source.type]}</span>
          <span className="t-sources__title">
            {source.author}『{source.title}』
          </span>
          {source.originalTitle && <span>（{source.originalTitle}）</span>}
          <div className="t-sources__meta">
            {[source.translator, source.publisher, source.publishedPeriod]
              .filter(Boolean)
              .join(" ／ ")}
            {source.url && (
              <>
                {" ／ "}
                <Link href={source.url}>
                  {source.urlLabel ?? "オンラインで読む"}
                </Link>
              </>
            )}
          </div>
          {source.notes && <p className="t-sources__notes">{source.notes}</p>}
        </li>
      ))}
    </ul>
  </>
)
