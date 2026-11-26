import type { Image } from "@/lib/content/schema"
import { assetPath } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color } from "@/lib/styles/theme"

const styles = css`
  .t-figure img {
    width: 100%;
    height: auto;
    border: 2.5px solid ${color.line};
    border-radius: 14px;
  }
  .t-figure figcaption {
    font-size: 0.8rem;
    color: ${color.muted};
    margin-top: 6px;
    line-height: 1.6;
  }
`

/** 出典・ライセンス表記つきの画像 */
export const ImageFigure = ({
  image,
  caption,
  eager = false,
}: {
  image: Image
  caption?: string
  eager?: boolean
}) => (
  <figure className="t-figure">
    <Style id="figure">{styles}</Style>
    <img
      src={assetPath(image.src)}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
    <figcaption>
      {caption && (
        <>
          {caption}
          <br />
        </>
      )}
      {image.aiGenerated && "【AI生成画像・実在の史料ではありません】"}
      出典：{image.credit}（{image.license}）
    </figcaption>
  </figure>
)
