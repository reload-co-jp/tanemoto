import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { PageHeader, Section, TileList } from "@/components/common/PageParts"
import {
  getArticlesForMythology,
  getFiguresForMythology,
  getMythologies,
} from "@/lib/content/repository"
import { mythologyKinds } from "@/lib/content/schema"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

export const metadata = buildMetadata({
  title: "原典から探す｜神話・伝説・歴史・名作文学",
  description:
    "キャラクターの元ネタになった原典の一覧。ギリシャ・北欧・日本・エジプト・ケルト・メソポタミア・インド・中国・アステカ・フィンランド・スラヴ・ポリネシアの神話と、アーサー王伝説などの伝説、古代〜中世の偉人の伝承、『不思議の国のアリス』などの名作文学の一覧。地域・成立時期・主な人物と関連記事を紹介します。",
  path: paths.mythologies(),
})

const kindSections = {
  myth: { title: "神話", en: "Myths" },
  legend: { title: "伝説", en: "Legends" },
  history: { title: "歴史上の偉人", en: "History" },
  literature: { title: "名作文学", en: "Literature" },
} as const satisfies Record<keyof typeof mythologyKinds, unknown>

const Page = () => {
  const mythologies = getMythologies()
  const groups = (Object.keys(kindSections) as (keyof typeof kindSections)[])
    .map((kind) => ({
      kind,
      items: mythologies.filter((m) => m.kind === kind),
    }))
    .filter((g) => g.items.length > 0)
  return (
    <>
      <Breadcrumbs items={[{ name: "原典", href: paths.mythologies() }]} />
      <PageHeader
        eyebrow="Sources"
        title="原典から探す"
        description="キャラクターの元ネタになった原典（神話・伝説・歴史・名作文学）ごとに、主な神々・英雄・怪物と物語をまとめています。現在はギリシャ・北欧・日本・エジプト・ケルト・メソポタミア・インド・中国・アステカ・フィンランド・スラヴ・ポリネシアの12の神話に加え、アーサー王伝説などの伝説、古代〜中世の偉人の伝承、そして『不思議の国のアリス』『シャーロック・ホームズ』などの名作文学を扱っています。"
      />
      {groups.map((group) => (
        <Section
          key={group.kind}
          title={kindSections[group.kind].title}
          en={kindSections[group.kind].en}
          id={`kind-${group.kind}`}
        >
          <TileList
            items={group.items.map((m) => ({
              href: m.comingSoon ? undefined : paths.mythology(m.slug),
              title: m.name,
              eyebrow: m.region,
              description: m.description,
              meta: m.comingSoon
                ? "準備中"
                : `記事 ${getArticlesForMythology(m).length}件 ・ ${m.kind === "myth" ? "人物・怪物" : "人物"} ${getFiguresForMythology(m).length}`,
            }))}
          />
        </Section>
      ))}
    </>
  )
}

export default Page
