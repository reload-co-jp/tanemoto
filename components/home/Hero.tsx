import { assetPath, paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font, radius, shadow } from "@/lib/styles/theme"

const styles = css`
  .t-hero {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(
        circle at 88% 18%,
        ${color.yellow} 0 70px,
        transparent 71px
      ),
      radial-gradient(
        circle at 100% 100%,
        ${color.mint} 0 150px,
        transparent 151px
      ),
      radial-gradient(${color.accentPale} 2px, transparent 2.5px) 0 0 / 16px
        16px,
      ${color.paper};
    color: ${color.ink};
    border: 3px solid ${color.ink};
    border-radius: ${radius.lg};
    box-shadow: ${shadow.lg};
    margin: 0 0 48px;
    padding: 36px 22px 40px;
  }
  @media ${bp.md} {
    .t-hero {
      margin: 0 8px 64px 0;
      padding: 64px 56px;
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
      right: 24px;
      top: 50%;
      bottom: auto;
      transform: translateY(-50%);
      width: 400px;
      opacity: 1;
    }
  }
  .t-hero__inner {
    position: relative;
    max-width: 34em;
  }
  .t-hero__eyebrow {
    display: inline-block;
    font-family: ${font.pop};
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 0.72rem;
    color: #fff;
    background: ${color.ink};
    border-radius: 999px;
    padding: 3px 14px;
    transform: rotate(-3deg);
  }
  .t-hero__title {
    color: ${color.ink};
    font-size: 2.1rem;
    font-weight: 900;
    letter-spacing: 0.06em;
    margin-top: 16px;
    line-height: 1.35;
  }
  .t-hero__line {
    display: block;
  }
  .t-hero__line > span {
    background: linear-gradient(
      transparent 58%,
      ${color.accentPale} 58%,
      ${color.accentPale} 92%,
      transparent 92%
    );
  }
  @media ${bp.md} {
    .t-hero__title {
      font-size: 2.5rem;
    }
  }
  .t-hero__text {
    margin-top: 18px;
    font-size: 0.95rem;
    line-height: 1.95;
    color: ${color.charcoal};
  }
  .t-hero__search {
    margin-top: 28px;
    display: flex;
    max-width: 28em;
    border: 2.5px solid ${color.ink};
    border-radius: 999px;
    background: ${color.paper};
    box-shadow: ${shadow.sm};
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
      ${shadow.sm},
      0 0 0 4px ${color.yellow};
  }
  .t-hero__search button {
    border: 0;
    border-left: 2.5px solid ${color.ink};
    background: ${color.accent};
    color: #fff;
    padding: 0 22px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;
  }
  .t-hero__search button:hover {
    background: ${color.accentDeep};
  }
  @keyframes t-hero-float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }
  .t-hero__float {
    animation: t-hero-float 4s ease-in-out infinite;
    transform-box: fill-box;
    transform-origin: center;
  }
  .t-hero__float--2 {
    animation-delay: -1.3s;
  }
  .t-hero__float--3 {
    animation-delay: -2.6s;
  }
`

const Star = ({
  x,
  y,
  r,
  fill,
}: {
  x: number
  y: number
  r: number
  fill: string
}) => {
  const p = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 === 0 ? r : r * 0.45
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`
  }).join(" ")
  return (
    <polygon
      points={p}
      fill={fill}
      stroke={color.ink}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  )
}

/** 種から芽が伸び、星（物語）や吹き出しへとつながるメインビジュアル */
const HeroArt = () => (
  <svg
    className="t-hero__art"
    viewBox="0 0 400 400"
    aria-hidden="true"
    focusable="false"
  >
    <g
      fill="none"
      stroke={color.ink}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="2 10"
    >
      <path d="M200 300 C 200 250, 150 210, 110 120" />
      <path d="M200 300 C 210 240, 260 200, 300 110" />
      <path d="M200 300 C 240 290, 300 270, 340 230" />
    </g>
    <g className="t-hero__float">
      <Star x={110} y={110} r={34} fill={color.yellow} />
    </g>
    <g className="t-hero__float t-hero__float--2">
      <rect
        x="250"
        y="58"
        width="110"
        height="62"
        rx="22"
        fill={color.paper}
        stroke={color.ink}
        strokeWidth="3"
      />
      <path
        d="M272 118 L 266 138 L 290 119"
        fill={color.paper}
        stroke={color.ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M270 120 H 292" stroke={color.paper} strokeWidth="4" />
      <text
        x="305"
        y="98"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill={color.accent}
        fontFamily="Fredoka, sans-serif"
      >
        ?!
      </text>
    </g>
    <g className="t-hero__float t-hero__float--3">
      <Star x={345} y={225} r={22} fill={color.violet} />
    </g>
    <circle
      cx="200"
      cy="320"
      r="62"
      fill={color.accentPale}
      stroke={color.ink}
      strokeWidth="3"
    />
    <path
      d="M200 360 C 178 346, 175 312, 200 284 C 225 312, 222 346, 200 360 Z"
      fill={color.accent}
      stroke={color.ink}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path
      d="M200 300 C 196 278, 180 268, 166 270 C 168 286, 182 296, 200 300 Z M200 300 C 204 276, 222 264, 238 266 C 236 284, 220 296, 200 300 Z"
      fill={color.mint}
      stroke={color.ink}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="190" cy="334" r="3.5" fill={color.ink} />
    <circle cx="210" cy="334" r="3.5" fill={color.ink} />
    <path
      d="M193 344 Q 200 350 207 344"
      fill="none"
      stroke={color.ink}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle
      cx="70"
      cy="250"
      r="8"
      fill={color.sky}
      stroke={color.ink}
      strokeWidth="2.5"
    />
    <circle
      cx="330"
      cy="330"
      r="6"
      fill={color.yellow}
      stroke={color.ink}
      strokeWidth="2.5"
    />
  </svg>
)

export const Hero = () => (
  <section className="t-hero" aria-labelledby="hero-title">
    <Style id="hero">{styles}</Style>
    <HeroArt />
    <div className="t-hero__inner">
      <p className="t-hero__eyebrow">Tomotane — Origins of Stories</p>
      <h1 className="t-hero__title" id="hero-title">
        {site.tagline.split(/(?<=、)/).map((part) => (
          <span key={part} className="t-hero__line">
            <span>{part}</span>
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
  </section>
)
