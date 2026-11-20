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
      width: 400px;
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

const line = color.accentDeep

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
    const rr = i % 2 === 0 ? r : r * 0.48
    return `${(x + rr * Math.cos(a)).toFixed(1)},${(y + rr * Math.sin(a)).toFixed(1)}`
  }).join(" ")
  return (
    <polygon
      points={p}
      fill={fill}
      stroke="#fff"
      strokeWidth="5"
      strokeLinejoin="round"
      paintOrder="stroke"
    />
  )
}

const Bubble = ({
  x,
  y,
  w,
  text,
  tail = "left",
}: {
  x: number
  y: number
  w: number
  text: string
  tail?: "left" | "right"
}) => {
  const tx = tail === "left" ? x + 20 : x + w - 20
  const dir = tail === "left" ? -1 : 1
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="44"
        rx="22"
        fill="#fff"
        stroke={color.accent}
        strokeWidth="3"
      />
      <path
        d={`M${tx - 8 * dir} ${y + 42} L ${tx + 6 * dir} ${y + 60} L ${tx + 10 * dir} ${y + 40}`}
        fill="#fff"
        stroke={color.accent}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={`M${tx - 6 * dir} ${y + 41.5} H ${tx + 9 * dir}`}
        stroke="#fff"
        strokeWidth="4"
      />
      <text
        x={x + w / 2}
        y={y + 29}
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        fill={color.accentDeep}
        fontFamily='"M PLUS 1", sans-serif'
      >
        {text}
      </text>
    </g>
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
      stroke={color.accent}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="1 9"
    >
      <path d="M200 300 C 200 250, 150 210, 100 130" />
      <path d="M200 300 C 210 240, 260 200, 300 140" />
      <path d="M200 300 C 240 290, 300 270, 340 236" />
    </g>
    <g className="t-hero__float">
      <Star x={98} y={118} r={36} fill={color.yellow} />
    </g>
    <g className="t-hero__float t-hero__float--2">
      <Bubble x={236} y={60} w={140} text="元ネタは…!?" tail="left" />
    </g>
    <g className="t-hero__float t-hero__float--3">
      <Star x={344} y={228} r={22} fill={color.mint} />
    </g>
    <circle
      cx="200"
      cy="320"
      r="62"
      fill="#fff"
      stroke={color.accent}
      strokeWidth="3"
    />
    <circle cx="200" cy="320" r="52" fill={color.accentPale} />
    <path
      d="M200 360 C 178 346, 175 312, 200 284 C 225 312, 222 346, 200 360 Z"
      fill={color.accent}
      stroke={line}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M200 300 C 196 278, 180 268, 166 270 C 168 286, 182 296, 200 300 Z M200 300 C 204 276, 222 264, 238 266 C 236 284, 220 296, 200 300 Z"
      fill={color.mint}
      stroke={color.mintDeep}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle cx="190" cy="332" r="3.5" fill={line} />
    <circle cx="210" cy="332" r="3.5" fill={line} />
    <ellipse cx="184" cy="342" rx="5" ry="3" fill="#ffc2d6" />
    <ellipse cx="216" cy="342" rx="5" ry="3" fill="#ffc2d6" />
    <path
      d="M195 342 Q 200 347 205 342"
      fill="none"
      stroke={line}
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <g fill={color.yellow} stroke="#fff" strokeWidth="2">
      <path d="M60 250 l5 -12 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 Z" />
      <path d="M318 318 l3.5 -8 l3.5 8 l8 3.5 l-8 3.5 l-3.5 8 l-3.5 -8 l-8 -3.5 Z" />
    </g>
    <circle cx="150" cy="210" r="6" fill={color.violet} />
    <circle cx="270" cy="190" r="5" fill={color.sky} />
  </svg>
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
