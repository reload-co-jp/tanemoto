import { ArticleList } from "@/components/article/ArticleCard"
import {
  ClassificationLabel,
  classificationInfo,
} from "@/components/common/ClassificationLabel"
import { Link } from "@/components/common/Link"
import { ChipList, Section, TileList } from "@/components/common/PageParts"
import { Hero } from "@/components/home/Hero"
import { PopularList } from "@/components/home/PopularList"
import { JsonLd } from "@/components/seo/JsonLd"
import { classifications, workTypes } from "@/lib/content/schema"
import {
  getArticles,
  getCharacters,
  getArticlesForFigure,
  getArticlesForMythology,
  getArticlesForTopic,
  getFeaturedArticles,
  getFigures,
  getMythologies,
  getPopularArticles,
  getTopics,
  getWorks,
} from "@/lib/content/repository"
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo"
import { characterTile } from "@/lib/characterTile"
import { paths } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font } from "@/lib/styles/theme"

export const metadata = buildMetadata({ path: "/" })

const styles = css`
  .t-home-grid {
    margin-top: 48px;
    display: grid;
    gap: 40px;
  }
  @media ${bp.lg} {
    .t-home-grid {
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 56px;
    }
  }
  .t-policy {
    margin-top: 56px;
    background: ${color.paper};
    border: 2.5px solid ${color.ink};
    border-radius: 22px;
    box-shadow: 6px 6px 0 ${color.accent};
    padding: 28px 24px;
    display: grid;
    gap: 20px;
  }
  @media ${bp.md} {
    .t-policy {
      grid-template-columns: 1fr 1fr;
      padding: 36px 40px;
      gap: 40px;
    }
  }
  .t-policy__title {
    font-size: 1.3rem;
  }
  .t-policy__text {
    margin-top: 10px;
    font-size: 0.92rem;
    line-height: 1.9;
  }
  .t-policy__list {
    list-style: none;
    display: grid;
    gap: 8px;
    font-size: 0.85rem;
  }
  .t-policy__list li {
    display: grid;
    grid-template-columns: 7.5em 1fr;
    align-items: center;
    gap: 8px;
    color: ${color.muted};
  }
  .t-policy__list .t-label {
    justify-self: start;
  }
  .t-policy__en {
    font-family: ${font.pop};
    font-size: 0.72rem;
    letter-spacing: 0.25em;
    color: ${color.accentDeep};
    text-transform: uppercase;
  }
`

const Page = () => {
  const featured = getFeaturedArticles(3)
  const latest = getArticles()
    .filter((a) => !featured.includes(a))
    .slice(0, 6)
  const popular = getPopularArticles(5)
  const figures = getFigures().filter((f) => getArticlesForFigure(f).length > 0)
  const works = getWorks()
  const characters = getCharacters()

  return (
    <>
      <Style id="home">{styles}</Style>
      <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
      <Hero />

      <Section
        title="キャラクターから元ネタを探す"
        en="Characters"
        id="characters"
        more={{ href: paths.characters(), label: "すべてのキャラクター" }}
      >
        {characters.length > 0 ? (
          <TileList items={characters.slice(0, 8).map(characterTile)} />
        ) : (
          <p className="t-empty">キャラクターの元ネタ解説は準備中です。</p>
        )}
        {works.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <p className="t-meta" style={{ marginBottom: 8 }}>
              作品から探す ／{" "}
              <Link href={paths.origins()}>神話から逆引きする →</Link>
            </p>
            <ChipList
              items={works.map((w) => ({
                href: paths.work(w.slug),
                label: `『${w.title}』`,
                sub: workTypes[w.type],
              }))}
            />
          </div>
        )}
      </Section>

      <div className="t-home-grid">
        <div>
          {featured.length > 0 && (
            <Section title="注目の記事" en="Featured" id="featured">
              <ArticleList
                articles={featured}
                columns={featured.length >= 3 ? 3 : 2}
              />
            </Section>
          )}
          <Section
            title="新着記事"
            en="Latest"
            id="latest"
            more={{ href: paths.articles(), label: "記事一覧へ" }}
          >
            <ArticleList
              articles={latest.length > 0 ? latest : getArticles().slice(0, 6)}
              layout="row"
            />
          </Section>
        </div>
        <div>
          {popular.length > 0 && (
            <Section title="人気・おすすめ記事" en="Popular" id="popular">
              <PopularList articles={popular} />
            </Section>
          )}
          <Section
            title="神話から探す"
            en="Mythologies"
            id="mythologies"
            more={{ href: paths.mythologies(), label: "一覧" }}
          >
            <TileList
              items={getMythologies().map((m) => ({
                href: m.comingSoon ? undefined : paths.mythology(m.slug),
                title: m.name,
                eyebrow: m.region,
                meta: m.comingSoon
                  ? "準備中"
                  : `記事 ${getArticlesForMythology(m).length}件`,
              }))}
            />
          </Section>
        </div>
      </div>

      <Section
        title="元ネタ（神々・怪物）から探す"
        en="Figures"
        id="figures"
        more={{ href: paths.figures(), label: "すべての人物・怪物" }}
      >
        <ChipList
          items={figures.map((f) => ({
            href: paths.figure(f.slug),
            label: f.name,
            sub: f.romanized,
          }))}
        />
      </Section>

      <Section
        title="テーマから探す"
        en="Topics"
        id="topics"
        more={{ href: paths.topics(), label: "すべてのテーマ" }}
      >
        <TileList
          items={getTopics().map((t) => ({
            href: paths.topic(t.slug),
            title: t.name,
            description: t.description,
            meta: `記事 ${getArticlesForTopic(t).length}件`,
          }))}
        />
      </Section>

      <section className="t-policy" aria-labelledby="policy-title">
        <div>
          <p className="t-policy__en">Editorial Policy</p>
          <h2 className="t-policy__title" id="policy-title">
            事実と解釈を、区別して伝える。
          </h2>
          <p className="t-policy__text">
            トモタネでは、原典・史料・研究にもとづいて記事を作成し、本文中の主張ごとに情報区分のラベルと根拠を示しています。
            作品と神話の関係を根拠なく断定することはしません。
          </p>
          <p className="t-policy__text">
            <Link href={paths.editorialPolicy()}>編集方針を読む →</Link>
          </p>
        </div>
        <ul className="t-policy__list">
          {classifications.map((c) => (
            <li key={c}>
              <ClassificationLabel classification={c} />
              {classificationInfo[c].description}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default Page
