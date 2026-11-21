import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { PageHeader, Section, TileList } from "@/components/common/PageParts"
import { JsonLd } from "@/components/seo/JsonLd"
import { figureTypes } from "@/lib/content/schema"
import { getFigures } from "@/lib/content/repository"
import { figureTile } from "@/lib/figureTile"
import { buildMetadata, itemListJsonLd } from "@/lib/seo"
import { paths } from "@/lib/site"

export const metadata = buildMetadata({
  title: "人物・怪物から探す",
  description:
    "ギリシャ・北欧・日本・エジプト・ケルト・メソポタミア・インド・中国・アステカ・フィンランドなど各地の神話の神々・英雄・怪物の一覧。名前の読み方や別名、原典での描かれ方、関連する物語と記事をまとめています。",
  path: paths.figures(),
})

const Page = () => {
  const figures = getFigures()
  const groups = (Object.keys(figureTypes) as (keyof typeof figureTypes)[])
    .map((type) => ({ type, items: figures.filter((f) => f.type === type) }))
    .filter((g) => g.items.length > 0)
  return (
    <>
      <Breadcrumbs items={[{ name: "人物・怪物", href: paths.figures() }]} />
      <JsonLd
        data={itemListJsonLd(
          figures.map((f) => ({ name: f.name, href: paths.figure(f.slug) }))
        )}
      />
      <PageHeader
        eyebrow="Figures"
        title="人物・怪物から探す"
        description="神話に登場する神々・英雄・怪物を、原典での描かれ方とともに紹介します。"
      />
      {groups.map((group) => (
        <Section
          key={group.type}
          title={figureTypes[group.type]}
          id={`type-${group.type}`}
        >
          <TileList items={group.items.map(figureTile)} />
        </Section>
      ))}
    </>
  )
}

export default Page
