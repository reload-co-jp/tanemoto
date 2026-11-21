import { assetPath, paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font, pattern, radius, shadow } from "@/lib/styles/theme"

const band = "Origins of Stories ✦ Characters × Myths ✦ "

const styles = css`
  .t-hero {
    position: relative;
    overflow: hidden;
    background:
      ${pattern.grid("rgba(255, 255, 255, 0.55)", 22)},
      linear-gradient(
        160deg,
        #ffd9e7 0%,
        #ffeaf2 40%,
        ${color.mintPale} 75%,
        ${color.yellowPale} 100%
      );
    border: 2px solid ${color.line};
    border-radius: ${radius.lg};
    box-shadow: ${shadow.lg};
    margin: 0 0 56px;
  }
  .t-hero__body {
    position: relative;
    padding: 32px 22px 36px;
  }
  @media ${bp.md} {
    .t-hero {
      margin: 0 8px 72px 0;
    }
    .t-hero__body {
      padding: 56px 52px 60px;
    }
  }
  .t-hero__art {
    display: none;
    position: absolute;
    pointer-events: none;
  }
  @media ${bp.lg} {
    .t-hero__art {
      display: block;
      right: 28px;
      top: 50%;
      transform: translateY(-50%);
      width: 440px;
      height: auto;
      animation: t-hero-float 5s ease-in-out infinite;
    }
  }
  .t-hero__inner {
    position: relative;
    max-width: 34em;
  }
  .t-hero__label {
    display: inline-block;
    font-weight: 800;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    color: #fff;
    background: ${color.mint};
    border-radius: 4px;
    padding: 1px 10px;
  }
  .t-hero__eyebrow {
    display: block;
    width: fit-content;
    margin-top: 6px;
    font-weight: 800;
    font-size: 1rem;
    letter-spacing: 0.08em;
    color: #fff;
    background: ${color.accent};
    border-radius: 4px;
    padding: 2px 12px;
  }
  .t-hero__title {
    font-family: ${font.display};
    font-weight: 900;
    font-size: 2.2rem;
    line-height: 1.3;
    letter-spacing: 0.06em;
    margin-top: 18px;
    color: ${color.accent};
    text-shadow:
      3px 3px 0 #fff,
      -3px 3px 0 #fff,
      3px -3px 0 #fff,
      -3px -3px 0 #fff,
      0 3px 0 #fff,
      0 -3px 0 #fff,
      3px 0 0 #fff,
      -3px 0 0 #fff,
      6px 6px 0 ${color.glow};
  }
  .t-hero__line {
    display: block;
  }
  .t-hero__line:nth-child(2) {
    color: ${color.mintDeep};
  }
  @media ${bp.md} {
    .t-hero__title {
      font-size: 2.5rem;
    }
    .t-hero__line {
      white-space: nowrap;
    }
  }
  .t-hero__text {
    margin-top: 20px;
    font-size: 0.95rem;
    line-height: 2;
    color: ${color.text};
    background: rgba(255, 255, 255, 0.8);
    border: 2px solid ${color.border};
    border-radius: ${radius.md};
    padding: 14px 18px;
  }
  .t-hero__search {
    margin-top: 24px;
    display: flex;
    max-width: 28em;
    border: 2px solid ${color.line};
    border-radius: 999px;
    background: ${color.paper};
    box-shadow: 0 4px 0 ${color.border};
    overflow: hidden;
  }
  .t-hero__search input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    padding: 12px 18px;
    color: ${color.ink};
  }
  .t-hero__search input::placeholder {
    color: ${color.muted};
  }
  .t-hero__search input:focus {
    outline: none;
  }
  .t-hero__search:focus-within {
    box-shadow:
      0 4px 0 ${color.border},
      0 0 0 4px ${color.mintPale};
  }
  .t-hero__search button {
    border: 0;
    margin: 4px;
    border-radius: 999px;
    background: ${color.accent};
    color: #fff;
    padding: 0 22px;
    font-weight: 800;
    cursor: pointer;
    transition: background 0.15s;
  }
  .t-hero__search button:hover {
    background: ${color.accentDeep};
  }
  .t-hero__band {
    overflow: hidden;
    white-space: nowrap;
    border-top: 2px solid ${color.line};
    background: linear-gradient(
      90deg,
      #ffd0e1,
      ${color.mintPale},
      ${color.yellowPale},
      #ffd0e1
    );
    font-family: ${font.pop};
    font-size: 1.15rem;
    letter-spacing: 0.12em;
    line-height: 40px;
    height: 42px;
    color: #fff;
    text-shadow:
      1.5px 1.5px 0 ${color.accent},
      -1.5px 1.5px 0 ${color.accent},
      1.5px -1.5px 0 ${color.accent},
      -1.5px -1.5px 0 ${color.accent};
  }
  .t-hero__band span {
    display: inline-block;
    animation: t-marquee 50s linear infinite;
  }
  @keyframes t-hero-float {
    0%,
    100% {
      transform: translateY(-50%);
    }
    50% {
      transform: translateY(calc(-50% - 6px));
    }
  }
`

/** フェレットの案内人と仲間たちが、物語の遺跡へと指し示すメインビジュアル */
const HeroArt = () => (
  <img
    className="t-hero__art"
    src={assetPath("/images/hero-scene.webp")}
    width={862}
    height={558}
    alt=""
    aria-hidden="true"
    decoding="async"
    fetchPriority="high"
  />
)

export const Hero = () => (
  <section className="t-hero" aria-labelledby="hero-title">
    <Style id="hero">{styles}</Style>
    <div className="t-hero__body">
      <HeroArt />
      <div className="t-hero__inner">
        <p className="t-hero__label">キャラクター × 神話・伝承</p>
        <p className="t-hero__eyebrow">これは、元ネタをたどる物語</p>
        <h1 className="t-hero__title" id="hero-title">
          {site.tagline.split(/(?<=、)/).map((part) => (
            <span key={part} className="t-hero__line">
              {part}
            </span>
          ))}
        </h1>
        <p className="t-hero__text">
          あのキャラクターの名前は、どこから来たのか。アニメや漫画のキャラクターを入口に、名前の由来やモチーフになった神話・伝承を、原典にもとづいてたどります。
          作品の設定と神話の内容を区別し、すべての主張に根拠を示します。
        </p>
        <form
          className="t-hero__search"
          action={assetPath(paths.search())}
          method="get"
          role="search"
        >
          <label htmlFor="hero-q" className="t-visually-hidden">
            サイト内検索
          </label>
          <input
            id="hero-q"
            name="q"
            type="search"
            placeholder="キャラクター名・作品名・神話の名前で検索"
          />
          <button type="submit">検索</button>
        </form>
      </div>
    </div>
    <div className="t-hero__band" aria-hidden="true">
      <span>
        {band.repeat(8)}
        {band.repeat(8)}
      </span>
    </div>
  </section>
)
