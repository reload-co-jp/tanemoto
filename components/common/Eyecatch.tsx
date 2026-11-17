import type { Image } from "@/lib/content/schema"
import { assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"

const styles = css`
  .t-eyecatch {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: ${color.navy};
    color: ${color.ivory};
    border-radius: 2px;
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
    padding: 8% 10%;
    background:
      radial-gradient(
        ellipse at 50% 120%,
        rgba(176, 141, 74, 0.28),
        transparent 60%
      ),
      linear-gradient(160deg, ${color.navy}, ${color.navyDeep});
  }
  .t-eyecatch__type::before {
    content: "";
    position: absolute;
    inset: 10px;
    border: 1px solid rgba(176, 141, 74, 0.45);
    pointer-events: none;
  }
  .t-eyecatch__eyebrow {
    font-family: ${font.latin};
    font-size: 0.7em;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: ${color.gold};
  }
  .t-eyecatch__word {
    font-family: ${font.serif};
    font-weight: 600;
    font-size: 1.6em;
    letter-spacing: 0.14em;
    margin-top: 0.3em;
    line-height: 1.3;
  }
  .t-eyecatch__orn {
    width: 40%;
    max-width: 140px;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${color.gold}, transparent);
    margin-top: 0.8em;
  }
  .t-eyecatch--card {
    font-size: 0.85rem;
  }
  .t-eyecatch--hero {
    font-size: 1.1rem;
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
    <div className={`t-eyecatch t-eyecatch--${variant}`}>
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
