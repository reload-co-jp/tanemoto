import { assetPath, paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font } from "@/lib/styles/theme"

const styles = css`
  .t-hero {
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      165deg,
      ${color.navy} 0%,
      ${color.navyDeep} 100%
    );
    color: ${color.ivory};
    margin: -24px -20px 40px;
    padding: 48px 24px 44px;
  }
  @media ${bp.md} {
    .t-hero {
      margin: -40px 0 56px;
      padding: 72px 56px;
      border-radius: 2px;
    }
  }
  .t-hero__art {
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    width: 360px;
    opacity: 0.22;
    pointer-events: none;
  }
  @media ${bp.md} {
    .t-hero__art {
      right: 24px;
      width: 420px;
      opacity: 0.5;
    }
  }
  .t-hero__inner {
    position: relative;
    max-width: 34em;
  }
  .t-hero__eyebrow {
    font-family: ${font.latin};
    letter-spacing: 0.32em;
    text-transform: uppercase;
    font-size: 0.75rem;
    color: ${color.gold};
  }
  .t-hero__title {
    color: ${color.ivory};
    font-size: 2.1rem;
    letter-spacing: 0.08em;
    margin-top: 12px;
    line-height: 1.35;
  }
  @media ${bp.md} {
    .t-hero__title {
      font-size: 2.8rem;
    }
  }
  .t-hero__text {
    margin-top: 18px;
    font-size: 0.95rem;
    line-height: 1.95;
    opacity: 0.88;
  }
  .t-hero__search {
    margin-top: 28px;
    display: flex;
    max-width: 28em;
    border: 1px solid rgba(176, 141, 74, 0.7);
    background: rgba(252, 250, 245, 0.06);
  }
  .t-hero__search input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    padding: 12px 14px;
    color: ${color.ivory};
  }
  .t-hero__search input::placeholder {
    color: rgba(246, 241, 230, 0.55);
  }
  .t-hero__search input:focus {
    outline: none;
  }
  .t-hero__search:focus-within {
    border-color: ${color.gold};
    box-shadow: 0 0 0 2px rgba(176, 141, 74, 0.35);
  }
  .t-hero__search button {
    border: 0;
    background: ${color.gold};
    color: ${color.navyDeep};
    padding: 0 20px;
    font-weight: 600;
    cursor: pointer;
  }
  .t-hero__search button:hover {
    background: ${color.goldPale};
  }
`

/** 種から系譜の枝が伸び、星（物語）へとつながるメインビジュアル */
const HeroArt = () => (
  <svg
    className="t-hero__art"
    viewBox="0 0 400 400"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="none" stroke={color.gold} strokeWidth="1">
      <circle cx="200" cy="200" r="190" opacity="0.5" />
      <circle cx="200" cy="200" r="150" opacity="0.35" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="110" opacity="0.5" />
      <path d="M200 330 C 200 280, 200 250, 200 200 C 200 150, 160 120, 120 90" />
      <path d="M200 200 C 200 150, 240 120, 280 90" />
      <path d="M200 250 C 230 230, 270 225, 310 200" />
      <path d="M200 250 C 170 230, 130 225, 90 200" />
      <path d="M200 200 L 200 60" />
    </g>
    <g fill={color.gold}>
      <path d="M200 350 C 186 340, 184 318, 200 300 C 216 318, 214 340, 200 350 Z" />
      {[
        [120, 90],
        [280, 90],
        [310, 200],
        [90, 200],
        [200, 60],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5" />
          <circle
            cx={x}
            cy={y}
            r="11"
            fill="none"
            stroke={color.gold}
            opacity="0.5"
          />
        </g>
      ))}
    </g>
  </svg>
)

export const Hero = () => (
  <section className="t-hero" aria-labelledby="hero-title">
    <Style id="hero">{styles}</Style>
    <HeroArt />
    <div className="t-hero__inner">
      <p className="t-hero__eyebrow">Tomotane — Origins of Stories</p>
      <h1 className="t-hero__title" id="hero-title">
        {site.tagline}
      </h1>
      <p className="t-hero__text">
        アニメや漫画で出会ったキャラクター、能力、武器、世界観。その背景にある神話・伝承を、原典と研究にもとづいてたどります。
        事実・学説・異伝・創作・考察を区別し、すべての主張に根拠を示します。
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
          placeholder="神・怪物・作品名で検索（例：メデューサ）"
        />
        <button type="submit">検索</button>
      </form>
    </div>
  </section>
)
