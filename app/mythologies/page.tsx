import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { PageHeader, TileList } from "@/components/common/PageParts"
import {
  getArticlesForMythology,
  getFiguresForMythology,
  getMythologies,
} from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

export const metadata = buildMetadata({
  title: "神話から探す",
  description:
    "ギリシャ神話をはじめとする世界の神話体系の一覧。地域・成立時期・主な神々と関連記事を紹介します。",
  path: paths.mythologies(),
})

const Page = () => (
  <>
    <Breadcrumbs items={[{ name: "神話", href: paths.mythologies() }]} />
    <PageHeader
      eyebrow="Mythologies"
      title="神話から探す"
      description="神話体系ごとに、主な神々・英雄・怪物と物語をまとめています。現在はギリシャ・北欧・日本・エジプト・ケルト・メソポタミア・インド・中国・アステカ・フィンランドの10の神話を扱っています。"
    />
    <TileList
      items={getMythologies().map((m) => ({
        href: m.comingSoon ? undefined : paths.mythology(m.slug),
        title: m.name,
        eyebrow: m.region,
        description: m.description,
        meta: m.comingSoon
          ? "準備中"
          : `記事 ${getArticlesForMythology(m).length}件 ・ 人物・怪物 ${getFiguresForMythology(m).length}`,
      }))}
    />
  </>
)

export default Page
