import { Link } from "@/components/common/Link"
import { site } from "@/lib/site"

/**
 * 移転済み URL 用の転送ページ。静的書き出しではサーバー側リダイレクトが
 * 使えないため、meta refresh で（canonical は buildMetadata 側で新 URL を指定）新しい URL へ誘導する。
 */
export const LegacyRedirect = ({ to }: { to: string }) => (
  <>
    <meta httpEquiv="refresh" content={`0;url=${site.basePath}${to}`} />
    <p style={{ margin: "48px 0" }}>
      このページは移転しました。<Link href={to}>新しいページへ移動する →</Link>
    </p>
  </>
)
