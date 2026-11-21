import { color, font } from "@/lib/styles/theme"
import { assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"

/** マスコット（フェレットの旅人）の顔をあしらったシンボル */
export const LogoMark = ({ size = 40 }: { size?: number }) => (
  <img
    className="t-logo__mark"
    src={assetPath("/images/logo-mark.png")}
    width={size}
    height={size}
    alt=""
    aria-hidden="true"
  />
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
  .t-logo:hover .t-logo__mark {
    transform: rotate(-12deg) scale(1.06);
  }
  .t-logo__mark {
    display: block;
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
    font-size: 1.5rem;
    letter-spacing: 0.08em;
    color: ${color.accent};
    text-shadow:
      2px 2px 0 #fff,
      -2px 2px 0 #fff,
      2px -2px 0 #fff,
      -2px -2px 0 #fff,
      3px 3px 0 ${color.glow};
  }
  .t-logo__en {
    font-family: ${font.pop};
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    color: ${color.mintDeep};
    margin-top: 3px;
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
