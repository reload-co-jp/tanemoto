import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { PageHeader, TileList } from "@/components/common/PageParts"
import { workTypes } from "@/lib/content/schema"
import { getWorks } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

export const metadata = buildMetadata({
  title: "作品から探す",
  description:
    "アニメ・漫画作品から、キャラクターや設定のモチーフになった神話・伝承を探せます。",
  path: paths.works(),
})

const Page = () => {
  const works = getWorks()
  return (
    <>
      <Breadcrumbs items={[{ name: "作品", href: paths.works() }]} />
      <PageHeader
        eyebrow="Works"
        title="作品から探す"
        description="アニメ・漫画などの作品に登場するキャラクターや設定と、その背景にある神話・伝承を結びつけて紹介します。作品の設定と神話の内容は区別して記載しています。"
      />
      {works.length === 0 ? (
        <p className="t-empty">作品ページは準備中です。</p>
      ) : (
        <TileList
          items={works.map((w) => ({
            href: paths.work(w.slug),
            title: `『${w.title}』`,
            eyebrow: `${workTypes[w.type]} · ${w.author}`,
            description: w.description,
            meta:
              w.characters.length > 0
                ? `神話モチーフのキャラクター ${w.characters.length}`
                : undefined,
          }))}
        />
      )}
    </>
  )
}

export default Page
