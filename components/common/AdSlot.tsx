import { site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color } from "@/lib/styles/theme"
import { AdSlotPush } from "./AdSlotPush"

const styles = css`
  .t-ad {
    margin: 40px 0;
    min-height: 120px;
    text-align: center;
  }
  .t-ad__label {
    font-size: 0.7rem;
    color: ${color.muted};
    letter-spacing: 0.1em;
    margin-bottom: 4px;
  }
`

/**
 * 広告枠。NEXT_PUBLIC_ADSENSE_CLIENT と slot ID が揃っている場合のみ表示する。
 * variant="in-article" は本文中の見出し前に挟む記事内広告（fluid）。
 */
export const AdSlot = ({
  slot,
  variant = "display",
}: {
  slot?: string
  variant?: "display" | "in-article"
}) => {
  if (!site.adsenseClient || !slot) return null
  return (
    <aside className="t-ad" aria-label="広告">
      <Style id="ad">{styles}</Style>
      <p className="t-ad__label">スポンサーリンク</p>
      {variant === "in-article" ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client={site.adsenseClient}
          data-ad-slot={slot}
        />
      ) : (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={site.adsenseClient}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
      <AdSlotPush />
    </aside>
  )
}
