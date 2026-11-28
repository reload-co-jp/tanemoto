import type { Metadata } from "next"
import { Link } from "@/components/common/Link"
import { MascotTalk } from "@/components/common/Mascot"
import { PageHeader } from "@/components/common/PageParts"
import { paths, site } from "@/lib/site"

// ルートレイアウトの canonical・OGP（トップページ向け）を引き継がないよう明示的に外す
export const metadata: Metadata = {
  title: { absolute: `ページが見つかりません｜${site.name}` },
  description: "お探しのページは移動または削除された可能性があります。",
  robots: { index: false },
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
}

const NotFound = () => (
  <div style={{ padding: "40px 0" }}>
    <PageHeader
      eyebrow="404 — Not Found"
      title="ページが見つかりません"
      description="お探しのページは移動または削除された可能性があります。"
    />
    <div style={{ margin: "8px 0 28px" }}>
      <MascotTalk name="ferret-puzzled" height={110}>
        あれれ、道に迷っちゃったみたい…。
        <br />
        下のページから、もう一度たどってみよう！
      </MascotTalk>
    </div>
    <ul
      className="t-prose"
      style={{ paddingLeft: "1.4em", display: "grid", gap: 8 }}
    >
      <li>
        <Link href={paths.home()}>トップページ</Link>
      </li>
      <li>
        <Link href={paths.articles()}>記事一覧</Link>
      </li>
      <li>
        <Link href={paths.search()}>サイト内検索</Link>
      </li>
    </ul>
  </div>
)

export default NotFound
