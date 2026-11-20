import type { Image } from "@/lib/content/schema"
import { assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color, font, radius, shadow } from "@/lib/styles/theme"

const styles = css`
  .t-eyecatch {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background: ${color.accentPale};
    color: ${color.ink};
    border: 2.5px solid ${color.ink};
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
    padding: 6% 4%;
    background:
      repeating-conic-gradient(
        from 0deg at 50% 50%,
        rgba(255, 255, 255, 0.55) 0deg 7deg,
        transparent 7deg 18deg
      ),
      var(--t-eye-bg, ${color.accentPale});
  }
  .t-eyecatch__type::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: min(72%, 17em);
    aspect-ratio: 2.2 / 1;
    transform: translate(-50%, -50%) rotate(-2deg);
    background: ${color.paper};
    border: 2.5px solid ${color.ink};
    border-radius: 999px;
    box-shadow: 4px 4px 0 var(--t-eye-accent, ${color.accent});
  }
  .t-eyecatch__eyebrow,
  .t-eyecatch__word,
  .t-eyecatch__orn {
    position: relative;
  }
  .t-eyecatch__eyebrow {
    font-family: ${font.pop};
    font-weight: 600;
    font-size: 0.68em;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${color.accentDeep};
  }
  .t-eyecatch__word {
    font-family: ${font.display};
    font-weight: 900;
    font-size: 1.4em;
    letter-spacing: 0.04em;
    margin-top: 0.15em;
    line-height: 1.3;
    max-width: min(68%, 15em);
  }
  .t-eyecatch__orn {
    width: 2.2em;
    height: 0.35em;
    border-radius: 999px;
    background: var(--t-eye-accent, ${color.accent});
    margin-top: 0.4em;
  }
  .t-cards > li:nth-child(4n + 2) .t-eyecatch,
  .t-rows > li:nth-child(4n + 2) .t-eyecatch {
    --t-eye-bg: ${color.yellowPale};
    --t-eye-accent: ${color.yellow};
  }
  .t-cards > li:nth-child(4n + 3) .t-eyecatch,
  .t-rows > li:nth-child(4n + 3) .t-eyecatch {
    --t-eye-bg: ${color.mintPale};
    --t-eye-accent: ${color.mint};
  }
  .t-cards > li:nth-child(4n + 4) .t-eyecatch,
  .t-rows > li:nth-child(4n + 4) .t-eyecatch {
    --t-eye-bg: ${color.violetPale};
    --t-eye-accent: ${color.violet};
  }
  .t-eyecatch--card {
    font-size: 0.85rem;
  }
  .t-eyecatch--hero {
    font-size: 1.1rem;
    aspect-ratio: 16 / 7;
    box-shadow: ${shadow.md};
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
