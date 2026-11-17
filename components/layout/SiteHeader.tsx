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
    background: ${color.navy};
    color: ${color.ivory};
    border-bottom: 3px solid ${color.gold};
  }
  .t-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 14px;
    padding-bottom: 14px;
    flex-wrap: wrap;
  }
  .t-header__tagline {
    display: none;
    font-family: ${font.serif};
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    opacity: 0.8;
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
    color: ${color.ivory};
    text-decoration: none;
    font-size: 0.85rem;
    border: 1px solid rgba(246, 241, 230, 0.35);
    border-radius: 999px;
    padding: 4px 14px;
  }
  .t-header__search:hover {
    color: ${color.navy};
    background: ${color.ivory};
  }
  .t-nav {
    border-top: 1px solid rgba(246, 241, 230, 0.15);
  }
  .t-nav__list {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 -${"8px"};
  }
  .t-nav__list::-webkit-scrollbar {
    display: none;
  }
  .t-nav__link {
    display: block;
    padding: 10px 12px;
    color: ${color.ivory};
    text-decoration: none;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  .t-nav__link:hover {
    color: ${color.goldPale};
  }
  .t-nav__en {
    display: none;
    font-family: ${font.latin};
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    opacity: 0.6;
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
            strokeWidth="1.6"
          />
          <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        検索
      </Link>
    </div>
    <nav className="t-nav" aria-label="メインナビゲーション">
      <div className="t-container">
        <ul className="t-nav__list">
          {nav.map((item) => (
            <li key={item.href}>
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
