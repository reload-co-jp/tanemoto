import { Link } from "@/components/common/Link"
import { paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font, pattern } from "@/lib/styles/theme"
import { LogoMark } from "./Logo"

const styles = css`
  .t-footer {
    position: relative;
    margin-top: 40px;
    padding: 56px 0 36px;
    font-size: 0.875rem;
    color: ${color.text};
    background:
      ${pattern.grid("rgba(124, 141, 103, 0.16)", 22)},
      linear-gradient(180deg, #f9e0c2, ${color.mintPale});
    border-top: 2px solid ${color.line};
  }
  .t-footer::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: -16px;
    height: 16px;
    background: radial-gradient(
        circle at 14px 16px,
        #f9e0c2 12px,
        ${color.line} 12px 14px,
        transparent 14.5px
      )
      0 0 / 28px 16px repeat-x;
  }
  .t-footer a {
    color: ${color.accentDeep};
    font-weight: 700;
    text-decoration: none;
  }
  .t-footer a:hover {
    color: ${color.mintDeep};
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
    font-size: 1.4rem;
    letter-spacing: 0.08em;
    color: ${color.accent};
    text-shadow:
      2px 2px 0 #fff,
      -2px 2px 0 #fff,
      2px -2px 0 #fff,
      -2px -2px 0 #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .t-footer__tagline {
    margin-top: 8px;
    font-weight: 800;
    color: ${color.mintDeep};
  }
  .t-footer__desc {
    margin-top: 12px;
    color: ${color.muted};
    max-width: 28em;
    line-height: 1.8;
  }
  .t-footer__heading {
    font-family: ${font.pop};
    letter-spacing: 0.06em;
    font-size: 1.1rem;
    color: ${color.accent};
    text-shadow:
      1.5px 1.5px 0 #fff,
      -1.5px 1.5px 0 #fff,
      1.5px -1.5px 0 #fff,
      -1.5px -1.5px 0 #fff;
    margin-bottom: 10px;
  }
  .t-footer__list li + li {
    margin-top: 6px;
  }
  .t-footer__list li::before {
    content: "✦";
    color: ${color.mint};
    margin-right: 6px;
    font-size: 0.75em;
  }
  .t-footer__copy {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 2px dashed ${color.borderStrong};
    font-size: 0.75rem;
    color: ${color.muted};
    text-align: center;
  }
`

export const SiteFooter = () => (
  <footer className="t-footer">
    <Style id="footer">{styles}</Style>
    <div className="t-container">
      <div className="t-footer__grid">
        <div>
          <p className="t-footer__name">
            <LogoMark size={32} />
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
