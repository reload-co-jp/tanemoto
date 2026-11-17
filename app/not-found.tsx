import { Link } from "@/components/common/Link"
import { PageHeader } from "@/components/common/PageParts"
import { paths } from "@/lib/site"

export const metadata = {
  title: "ページが見つかりません｜トモタネ",
  robots: { index: false },
}

const NotFound = () => (
  <div style={{ padding: "40px 0" }}>
    <PageHeader
      eyebrow="404 — Not Found"
      title="ページが見つかりません"
      description="お探しのページは移動または削除された可能性があります。"
    />
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
