import { Link } from "@/components/common/Link"
import { site, paths, assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font } from "@/lib/styles/theme"
import { Logo } from "./Logo"

const nav = [
  { href: paths.characters(), label: "キャラクター", en: "Characters" },
  { href: paths.works(), label: "作品", en: "Works" },
  { href: paths.origins(), label: "元ネタ逆引き", en: "Origins" },
  { href: paths.mythologies(), label: "神話", en: "Myths" },
  { href: paths.topics(), label: "テーマ", en: "Topics" },
  { href: paths.articles(), label: "記事", en: "Articles" },
]

const styles = css`
  .t-header {
    background: ${color.paper};
    color: ${color.ink};
    border-bottom: 3px solid ${color.ink};
    position: relative;
  }
  .t-header::before {
    content: "";
    display: block;
    height: 6px;
    background: repeating-linear-gradient(
      90deg,
      ${color.accent} 0 40px,
      ${color.yellow} 40px 80px,
      ${color.mint} 80px 120px,
      ${color.violet} 120px 160px
    );
  }
  .t-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
    flex-wrap: wrap;
  }
  .t-header__tagline {
    display: none;
    font-family: ${font.display};
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    color: ${color.ink};
    background: ${color.yellowPale};
    border: 2px solid ${color.ink};
    border-radius: 999px;
    padding: 2px 12px;
    position: relative;
  }
  .t-header__tagline::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 50%;
    width: 10px;
    height: 10px;
    background: ${color.yellowPale};
    border-left: 2px solid ${color.ink};
    border-bottom: 2px solid ${color.ink};
    transform: translateY(-50%) rotate(45deg);
  }
  @media ${bp.md} {
    .t-header__tagline {
      display: block;
    }
  }
  .t-header__brand {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .t-header__search {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #fff;
    background: ${color.ink};
    text-decoration: none;
    font-weight: 700;
    font-size: 0.85rem;
    border: 2px solid ${color.ink};
    border-radius: 999px;
    padding: 5px 16px;
    box-shadow: 3px 3px 0 ${color.accent};
    transition:
      transform 0.15s,
      box-shadow 0.15s;
  }
  .t-header__search:hover {
    color: #fff;
    transform: translate(-1px, -1px);
    box-shadow: 4px 4px 0 ${color.accent};
  }
  .t-nav {
    border-top: 2px dashed ${color.border};
  }
  .t-nav__list {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 -8px;
    padding: 8px;
  }
  .t-nav__list::-webkit-scrollbar {
    display: none;
  }
  .t-nav__link {
    display: block;
    padding: 5px 14px;
    color: ${color.ink};
    text-decoration: none;
    font-weight: 700;
    font-size: 0.9rem;
    white-space: nowrap;
    border: 2px solid transparent;
    border-radius: 999px;
    transition:
      background 0.15s,
      border-color 0.15s;
  }
  .t-nav__item:nth-child(4n + 1) .t-nav__link:hover {
    background: ${color.accentPale};
  }
  .t-nav__item:nth-child(4n + 2) .t-nav__link:hover {
    background: ${color.yellowPale};
  }
  .t-nav__item:nth-child(4n + 3) .t-nav__link:hover {
    background: ${color.mintPale};
  }
  .t-nav__item:nth-child(4n + 4) .t-nav__link:hover {
    background: ${color.violetPale};
  }
  .t-nav__link:hover {
    color: ${color.ink};
    border-color: ${color.ink};
  }
  .t-nav__en {
    display: none;
    font-family: ${font.pop};
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${color.accentDeep};
    margin-left: 6px;
  }
  @media ${bp.md} {
    .t-nav__en {
      display: inline;
    }
  }
`

export const SiteHeader = () => (
  <header className="t-header">
    <Style id="header">{styles}</Style>
    <div className="t-container t-header__inner">
      <div className="t-header__brand">
        <Logo href={assetPath("/")} />
        <p className="t-header__tagline">{site.tagline}</p>
      </div>
      <Link href={paths.search()} className="t-header__search">
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <circle
            cx="7"
            cy="7"
            r="5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          />
          <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="2.2" />
        </svg>
        検索
      </Link>
    </div>
    <nav className="t-nav" aria-label="メインナビゲーション">
      <div className="t-container">
        <ul className="t-nav__list">
          {nav.map((item) => (
            <li key={item.href} className="t-nav__item">
              <Link href={item.href} className="t-nav__link">
                {item.label}
                <span className="t-nav__en" aria-hidden="true">
                  {item.en}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </header>
)
