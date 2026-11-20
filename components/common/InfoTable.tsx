import { ReactNode } from "react"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font } from "@/lib/styles/theme"

const styles = css`
  .t-info {
    display: grid;
    grid-template-columns: 7em 1fr;
    border-top: 1px solid ${color.border};
    font-size: 0.92rem;
    background: ${color.paper};
  }
  @media ${bp.sm} {
    .t-info {
      grid-template-columns: 9em 1fr;
    }
  }
  .t-info dt,
  .t-info dd {
    padding: 10px 14px;
    border-bottom: 1px solid ${color.border};
  }
  .t-info dt {
    font-family: ${font.display};
    color: ${color.ink};
    background: ${color.cream};
    font-weight: 600;
  }
`

/** 基本情報の定義リスト */
export const InfoTable = ({ rows }: { rows: [string, ReactNode][] }) => (
  <>
    <Style id="info">{styles}</Style>
    <dl className="t-info">
      {rows
        .filter(
          ([, value]) => value !== undefined && value !== null && value !== ""
        )
        .map(([label, value]) => (
          <div key={label} style={{ display: "contents" }}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  </>
)
