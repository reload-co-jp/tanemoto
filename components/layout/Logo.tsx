import { color, font } from "@/lib/styles/theme"
import { css, Style } from "@/lib/styles/css"

/** 種子（タネ）と、そこから伸びる系譜の線をモチーフにしたシンボル */
export const LogoMark = ({ size = 28 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="16"
      cy="16"
      r="15"
      fill="none"
      stroke={color.gold}
      strokeWidth="1.2"
    />
    <path
      d="M16 25 C 10 21, 9.5 13, 16 6 C 22.5 13, 22 21, 16 25 Z"
      fill={color.gold}
      opacity="0.9"
    />
    <path d="M16 25 V 10" stroke={color.navy} strokeWidth="1.2" />
    <path
      d="M16 18 L 12.6 14.6 M16 15 L 19.2 11.8"
      stroke={color.navy}
      strokeWidth="1"
    />
  </svg>
)

const styles = css`
  .t-logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: inherit;
    text-decoration: none;
  }
  .t-logo:hover {
    color: inherit;
  }
  .t-logo__text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  .t-logo__name {
    font-family: ${font.serif};
    font-weight: 700;
    font-size: 1.35rem;
    letter-spacing: 0.12em;
  }
  .t-logo__en {
    font-family: ${font.latin};
    font-size: 0.62rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    opacity: 0.75;
    margin-top: 2px;
  }
`

export const Logo = ({ href }: { href: string }) => (
  <a href={href} className="t-logo" aria-label="トモタネ トップページ">
    <Style id="logo">{styles}</Style>
    <LogoMark />
    <span className="t-logo__text">
      <span className="t-logo__name">トモタネ</span>
      <span className="t-logo__en">Tomotane</span>
    </span>
  </a>
)
