import { Link } from "@/components/common/Link"
import { paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font } from "@/lib/styles/theme"
import { LogoMark } from "./Logo"

const styles = css`
  .t-footer {
    background: ${color.inkDeep};
    color: rgba(255, 247, 234, 0.88);
    padding: 52px 0 32px;
    font-size: 0.875rem;
    margin-top: 24px;
    position: relative;
  }
  .t-footer::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -21px;
    height: 18px;
    background: radial-gradient(
        circle at 12px 18px,
        ${color.inkDeep} 11px,
        transparent 12px
      )
      0 0 / 24px 18px repeat-x;
  }
  .t-footer a {
    color: rgba(255, 247, 234, 0.88);
    text-decoration: none;
  }
  .t-footer a:hover {
    color: ${color.yellow};
    text-decoration: underline;
  }
  .t-footer__grid {
    display: grid;
    gap: 32px;
  }
  @media ${bp.md} {
    .t-footer__grid {
      grid-template-columns: 1.4fr 1fr 1fr;
    }
  }
  .t-footer__name {
    font-family: ${font.display};
    font-weight: 900;
    font-size: 1.25rem;
    letter-spacing: 0.08em;
    color: ${color.cream};
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .t-footer__tagline {
    margin-top: 8px;
  }
  .t-footer__desc {
    margin-top: 12px;
    opacity: 0.75;
    max-width: 28em;
    line-height: 1.7;
  }
  .t-footer__heading {
    font-family: ${font.pop};
    font-weight: 600;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: ${color.yellow};
    margin-bottom: 10px;
  }
  .t-footer__list li + li {
    margin-top: 6px;
  }
  .t-footer__copy {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 247, 234, 0.15);
    font-size: 0.75rem;
    opacity: 0.6;
  }
`

export const SiteFooter = () => (
  <footer className="t-footer">
    <Style id="footer">{styles}</Style>
    <div className="t-container">
      <div className="t-footer__grid">
        <div>
          <p className="t-footer__name">
            <LogoMark size={24} />
            {site.name}
          </p>
          <p className="t-footer__tagline">{site.tagline}</p>
          <p className="t-footer__desc">{site.description}</p>
        </div>
        <div>
          <p className="t-footer__heading">Explore</p>
          <ul className="t-footer__list">
            <li>
              <Link href={paths.articles()}>記事一覧</Link>
            </li>
            <li>
              <Link href={paths.mythologies()}>神話から探す</Link>
            </li>
            <li>
              <Link href={paths.figures()}>元ネタ（人物・怪物）から探す</Link>
            </li>
            <li>
              <Link href={paths.topics()}>テーマから探す</Link>
            </li>
            <li>
              <Link href={paths.works()}>作品から探す</Link>
            </li>
            <li>
              <Link href={paths.search()}>サイト内検索</Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="t-footer__heading">About</p>
          <ul className="t-footer__list">
            <li>
              <Link href={paths.about()}>運営者情報</Link>
            </li>
            <li>
              <Link href={paths.editorialPolicy()}>編集方針</Link>
            </li>
            <li>
              <Link href={paths.references()}>参考文献・情報源</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="t-footer__copy">
        &copy; {new Date().getFullYear()} {site.name}（{site.nameEn}）
      </p>
    </div>
  </footer>
)
