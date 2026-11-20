import type { Classification } from "@/lib/content/schema"
import { css, Style } from "@/lib/styles/css"
import { classificationColor, font } from "@/lib/styles/theme"

export const classificationInfo: Record<
  Classification,
  { label: string; ja: string; description: string }
> = {
  fact: {
    label: "FACT",
    ja: "確認できる事実",
    description: "原典・史料などで記述を確認できる事柄",
  },
  scholarship: {
    label: "SCHOLARSHIP",
    ja: "学術的な説",
    description: "研究者による学説・解釈",
  },
  variant: {
    label: "VARIANT",
    ja: "異伝・異説",
    description: "資料によって内容が異なる伝承",
  },
  creative: {
    label: "CREATIVE",
    ja: "創作上の設定",
    description: "アニメ・漫画など作品独自の設定",
  },
  editorial: {
    label: "EDITORIAL",
    ja: "筆者の考察",
    description: "編集部による考察・解釈",
  },
}

const styles = css`
  .t-label {
    display: inline-flex;
    align-items: center;
    font-family: ${font.sans};
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    line-height: 1;
    padding: 4px 6px 3px;
    border-radius: 999px;
    text-decoration: none;
    vertical-align: 0.15em;
    white-space: nowrap;
  }
  a.t-label:hover {
    filter: brightness(0.95);
    text-decoration: underline;
  }
  ${Object.entries(classificationColor)
    .map(([key, c]) => `.t-label--${key}{color:${c.fg};background:${c.bg};}`)
    .join("")}
`

export const ClassificationLabel = ({
  classification,
  href,
  showJa = false,
}: {
  classification: Classification
  href?: string
  showJa?: boolean
}) => {
  const info = classificationInfo[classification]
  const content = showJa ? `${info.label}｜${info.ja}` : info.label
  const className = `t-label t-label--${classification}`
  return (
    <>
      <Style id="label">{styles}</Style>
      {href ? (
        <a href={href} className={className} title={`${info.ja}：根拠を見る`}>
          {content}
        </a>
      ) : (
        <span className={className} title={info.ja}>
          {content}
        </span>
      )}
    </>
  )
}
