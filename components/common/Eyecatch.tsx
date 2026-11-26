import type { Image } from "@/lib/content/schema"
import { assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { winCss } from "@/lib/styles/global"
import { color, font, pattern, radius } from "@/lib/styles/theme"

const outline = (w: number, c: string) =>
  [
    [w, w],
    [-w, w],
    [w, -w],
    [-w, -w],
    [0, w],
    [0, -w],
    [w, 0],
    [-w, 0],
  ]
    .map(([x, y]) => `${x}px ${y}px 0 ${c}`)
    .join(",")

const styles = css`
  .t-eyecatch {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: ${color.accentPale};
    color: ${color.accent};
    border: 2px solid ${color.border};
    border-radius: ${radius.md};
  }
  .t-eyecatch img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .t-eyecatch__type {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6% 6%;
    background:
      ${pattern.grid("rgba(255, 255, 255, 0.7)", 16)},
      linear-gradient(
        150deg,
        var(--t-eye-a, #f9e0c2),
        var(--t-eye-b, ${color.yellowPale})
      );
  }
  .t-eyecatch__type::before,
  .t-eyecatch__type::after {
    content: "✦";
    position: absolute;
    color: #fff;
    font-size: 1.6em;
    line-height: 1;
    text-shadow: 0 0 6px rgba(237, 178, 77, 0.6);
  }
  .t-eyecatch__type::before {
    left: 10%;
    top: 14%;
  }
  .t-eyecatch__type::after {
    right: 10%;
    bottom: 14%;
    font-size: 1.1em;
  }
  .t-eyecatch__eyebrow,
  .t-eyecatch__word,
  .t-eyecatch__orn {
    position: relative;
  }
  .t-eyecatch__eyebrow {
    font-family: ${font.pop};
    font-size: 0.9em;
    letter-spacing: 0.06em;
    color: #fff;
    text-shadow: ${outline(1.5, "var(--t-eye-c, #324b4a)")};
  }
  .t-eyecatch__word {
    font-family: ${font.display};
    font-weight: 900;
    font-size: 1.75em;
    letter-spacing: 0.06em;
    line-height: 1.25;
    max-width: 88%;
    color: ${color.accent};
    text-shadow:
      ${outline(3, "#fff")},
      5px 5px 0 rgba(237, 178, 77, 0.45);
  }
  .t-eyecatch__orn {
    width: 3.4em;
    height: 0.55em;
    margin-top: 0.5em;
    background: url("data:image/svg+xml,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 12"><path d="M0 6h22l3-5 4 10 3-8 2 3h26" fill="none" stroke="#edb24d" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>'
      )}")
      no-repeat center / contain;
  }
  .t-cards > li:nth-child(3n + 2) .t-eyecatch,
  .t-rows > li:nth-child(3n + 2) .t-eyecatch {
    --t-eye-a: ${color.mintPale};
    --t-eye-b: #f9e0c2;
  }
  .t-cards > li:nth-child(3n + 3) .t-eyecatch,
  .t-rows > li:nth-child(3n + 3) .t-eyecatch {
    --t-eye-a: ${color.yellowPale};
    --t-eye-b: ${color.violetPale};
    --t-eye-c: ${color.accentDeep};
  }
  .t-eyecatch--card {
    font-size: 0.85rem;
  }
  ${winCss(".t-eyecatch--hero")}
  .t-eyecatch--hero .t-eyecatch__type {
    top: 28px;
  }
  .t-eyecatch--hero {
    font-size: 1.05rem;
    aspect-ratio: 16 / 7;
  }
  @media (min-width: 800px) {
    .t-eyecatch--hero {
      font-size: 1.5rem;
    }
  }
  .t-eyecatch__credit {
    font-size: 0.75rem;
    color: ${color.muted};
    margin-top: 6px;
  }
`

/**
 * アイキャッチ。画像が登録されていればその画像（出典・ライセンス表記付き）、
 * なければ記事のキーワードをタイポグラフィで表示する。
 */
export const Eyecatch = ({
  image,
  word,
  eyebrow,
  variant = "card",
  priority = false,
}: {
  image?: Image
  word: string
  eyebrow?: string
  variant?: "card" | "hero"
  priority?: boolean
}) => (
  <figure>
    <Style id="eyecatch">{styles}</Style>
    <div
      className={`t-eyecatch t-eyecatch--${variant}`}
      data-title={
        variant === "hero"
          ? `${(eyebrow ?? "Tanetomo").replace(/\s+/g, "_")}.png`
          : undefined
      }
    >
      {image ? (
        <img
          src={assetPath(image.src)}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      ) : (
        <div className="t-eyecatch__type" aria-hidden="true">
          {eyebrow && <span className="t-eyecatch__eyebrow">{eyebrow}</span>}
          <span className="t-eyecatch__word">{word}</span>
          <span className="t-eyecatch__orn" />
        </div>
      )}
    </div>
    {image && variant === "hero" && (
      <figcaption className="t-eyecatch__credit">
        {image.aiGenerated && "【AI生成画像・実在の史料ではありません】"}
        {image.credit}（{image.license}）
      </figcaption>
    )}
  </figure>
)
