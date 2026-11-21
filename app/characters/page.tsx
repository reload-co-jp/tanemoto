import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { PageHeader, Section, TileList } from "@/components/common/PageParts"
import { JsonLd } from "@/components/seo/JsonLd"
import { getCharactersForWork, getWorks } from "@/lib/content/repository"
import { characterTile } from "@/lib/characterTile"
import { buildMetadata, itemListJsonLd } from "@/lib/seo"
import { paths } from "@/lib/site"

export const metadata = buildMetadata({
  title: "キャラクターから元ネタを探す",
  description:
    "アニメ・漫画・ゲームのキャラクター名から、名前の由来やモチーフになった神話・伝承の元ネタを探せます。作品の設定と原典の内容を区別して解説します。",
  path: paths.characters(),
})

const Page = () => {
  const groups = getWorks()
    .map((work) => ({ work, characters: getCharactersForWork(work) }))
    .filter((g) => g.characters.length > 0)
  const all = groups.flatMap((g) => g.characters)
  return (
    <>
      <Breadcrumbs
        items={[{ name: "キャラクター", href: paths.characters() }]}
      />
      <JsonLd
        data={itemListJsonLd(
          all.map((c) => ({ name: c.name, href: paths.character(c.slug) }))
        )}
      />
      <PageHeader
        eyebrow="Characters"
        title="キャラクターから元ネタを探す"
        description="キャラクターの名前・能力・武器・立場などが、どの神話・伝承に由来するのかを紹介します。作品の設定（CREATIVE）と原典の内容は区別して記載しています。"
      />
      {groups.length === 0 && (
        <p className="t-empty">キャラクターは準備中です。</p>
      )}
      {groups.map(({ work, characters }) => (
        <Section
          key={work.id}
          title={`『${work.title}』`}
          id={`work-${work.slug}`}
          more={{ href: paths.work(work.slug), label: "作品ページ" }}
        >
          <TileList items={characters.map(characterTile)} />
        </Section>
      ))}
    </>
  )
}

export default Page
