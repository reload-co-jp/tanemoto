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
 * 表示位置は記事本文の途中を避け、本文末尾・サイドバーに限定する。
 */
export const AdSlot = ({ slot }: { slot?: string }) => {
  if (!site.adsenseClient || !slot) return null
  return (
    <aside className="t-ad" aria-label="広告">
      <Style id="ad">{styles}</Style>
      <p className="t-ad__label">スポンサーリンク</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={site.adsenseClient}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <AdSlotPush />
    </aside>
  )
}
