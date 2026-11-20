import { color, font } from "@/lib/styles/theme"
import { css, Style } from "@/lib/styles/css"

/** 種子（タネ）と、そこから伸びる芽をモチーフにしたポップなシンボル */
export const LogoMark = ({ size = 32 }: { size?: number }) => (
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
      r="14.5"
      fill={color.yellow}
      stroke={color.ink}
      strokeWidth="2"
    />
    <path
      d="M16 26 C 10.5 22.5, 10 15, 16 8.5 C 22 15, 21.5 22.5, 16 26 Z"
      fill={color.accent}
      stroke={color.ink}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path
      d="M16 24 V 13 M16 19 L 13.2 16.2 M16 16 L 18.6 13.4"
      stroke={color.ink}
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="11.6" cy="20" r="1" fill="#fff" />
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
  .t-logo:hover svg {
    transform: rotate(-12deg) scale(1.06);
  }
  .t-logo svg {
    transition: transform 0.2s;
  }
  .t-logo__text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  .t-logo__name {
    font-family: ${font.display};
    font-weight: 900;
    font-size: 1.45rem;
    letter-spacing: 0.08em;
    color: ${color.ink};
    text-shadow: 2px 2px 0 ${color.accentPale};
  }
  .t-logo__en {
    font-family: ${font.pop};
    font-weight: 600;
    font-size: 0.62rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: ${color.accentDeep};
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
