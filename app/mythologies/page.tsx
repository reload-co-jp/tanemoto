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
  title: "神話・伝説から探す",
  description:
    "ギリシャ・北欧・日本・エジプト・ケルト・メソポタミア・インド・中国・アステカ・フィンランド・スラヴ・ポリネシアの神話と、アーサー王伝説、古代ギリシャ・ローマの偉人の伝承の一覧。地域・成立時期・主な人物と関連記事を紹介します。",
  path: paths.mythologies(),
})

const kindSections = {
  myth: { title: "神話", en: "Myths" },
  legend: { title: "伝説", en: "Legends" },
  history: { title: "古代の偉人", en: "History" },
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
      <Breadcrumbs items={[{ name: "神話", href: paths.mythologies() }]} />
      <PageHeader
        eyebrow="Mythologies"
        title="神話・伝説から探す"
        description="神話体系や伝説ごとに、主な神々・英雄・怪物と物語をまとめています。現在はギリシャ・北欧・日本・エジプト・ケルト・メソポタミア・インド・中国・アステカ・フィンランド・スラヴ・ポリネシアの12の神話に加え、アーサー王伝説と古代ギリシャ・ローマの偉人の伝承を扱っています。"
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
