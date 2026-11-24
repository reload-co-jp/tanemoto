import { Link } from "@/components/common/Link"
import { site, paths, assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font, pattern } from "@/lib/styles/theme"
import { Logo } from "./Logo"

const nav = [
  { href: paths.characters(), label: "キャラ・設定", en: "Characters" },
  { href: paths.works(), label: "作品", en: "Works" },
  { href: paths.origins(), label: "元ネタ逆引き", en: "Origins" },
  { href: paths.mythologies(), label: "神話", en: "Myths" },
  { href: paths.topics(), label: "テーマ", en: "Topics" },
  { href: paths.articles(), label: "記事", en: "Articles" },
]

const marquee = "+++ Tomotane — Origins of Stories +++ "

const styles = css`
  .t-header {
    position: relative;
    background: rgba(255, 255, 255, 0.92);
    border-bottom: 2px solid ${color.line};
  }
  .t-marquee {
    overflow: hidden;
    white-space: nowrap;
    background: ${pattern.stripe("#324b4a", "#3e5a58", 7)};
    color: #fff;
    font-family: ${font.pop};
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    line-height: 26px;
    height: 26px;
  }
  .t-marquee__track {
    display: inline-block;
    animation: t-marquee 40s linear infinite;
    text-shadow: 0 1px 0 rgba(31, 49, 48, 0.45);
  }
  @keyframes t-marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }
  .t-header__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 12px;
    padding-bottom: 10px;
    flex-wrap: wrap;
  }
  .t-header__tagline {
    display: none;
    position: relative;
    font-weight: 800;
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    color: ${color.accentDeep};
    background: ${color.paper};
    border: 2px solid ${color.line};
    border-radius: 999px;
    padding: 3px 14px;
  }
  .t-header__tagline::before {
    content: "";
    position: absolute;
    left: -7px;
    top: 50%;
    width: 10px;
    height: 10px;
    background: ${color.paper};
    border-left: 2px solid ${color.line};
    border-bottom: 2px solid ${color.line};
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
    gap: 22px;
  }
  .t-header__search {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #fff;
    background: ${color.mint};
    text-decoration: none;
    font-weight: 800;
    font-size: 0.85rem;
    border-radius: 999px;
    padding: 6px 16px;
    box-shadow: 0 3px 0 #5e6e4b;
    text-shadow: 0 1px 0 rgba(31, 49, 48, 0.35);
    transition: transform 0.15s;
  }
  .t-header__search:hover {
    color: #fff;
    transform: translateY(-2px);
  }
  .t-nav__list {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 -8px;
    padding: 4px 8px 12px;
  }
  .t-nav__list::-webkit-scrollbar {
    display: none;
  }
  .t-nav__link {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.2;
    padding: 6px 14px 5px;
    color: #fff;
    background: ${color.accent};
    text-decoration: none;
    font-weight: 800;
    font-size: 0.85rem;
    white-space: nowrap;
    border-radius: 8px;
    box-shadow: 0 3px 0 #1f3130;
    transition: transform 0.15s;
  }
  .t-nav__item:nth-child(even) .t-nav__link {
    background: ${color.mint};
    box-shadow: 0 3px 0 #5e6e4b;
  }
  .t-nav__link:hover {
    color: #fff;
    transform: translateY(-2px);
  }
  .t-nav__en {
    display: none;
    font-family: ${font.pop};
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    opacity: 0.95;
  }
  @media ${bp.md} {
    .t-nav__en {
      display: block;
    }
  }
`

export const SiteHeader = () => (
  <header className="t-header">
    <Style id="header">{styles}</Style>
    <div className="t-marquee" aria-hidden="true">
      <span className="t-marquee__track">
        {marquee.repeat(12)}
        {marquee.repeat(12)}
      </span>
    </div>
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
                <span className="t-nav__en" aria-hidden="true">
                  {item.en}
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  </header>
)
