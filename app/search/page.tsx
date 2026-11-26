import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { ChipList, PageHeader, Section } from "@/components/common/PageParts"
import { SearchClient } from "@/components/search/SearchClient"
import { getFigures, getTags } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { assetPath, paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"

export const metadata = buildMetadata({
  title: "サイト内検索",
  description:
    "タネトモの記事・人物・怪物・作品・神話をキーワードで検索できます。",
  path: paths.search(),
  noindex: true,
})

const styles = css`
  .t-search__form input {
    width: 100%;
    font-size: 1.1rem;
    padding: 14px 16px;
    border: 2.5px solid ${color.line};
    background: ${color.paper};
    border-radius: 999px;
    padding-left: 22px;
    box-shadow: 4px 4px 0 ${color.glow};
  }
  .t-search__form input:focus {
    outline: 2px solid ${color.accent};
    outline-offset: 0;
    border-color: ${color.accent};
  }
  .t-search__kinds {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 20px 0 12px;
  }
  .t-search__kinds .t-chip {
    cursor: pointer;
  }
  .t-search__kinds .t-chip[aria-pressed="true"] {
    background: ${color.ink};
    color: ${color.cream};
    border-color: ${color.ink};
  }
  .t-search__results {
    list-style: none;
    margin-top: 16px;
    border-top: 1px solid ${color.border};
  }
  .t-search__item {
    padding: 16px 0;
    border-bottom: 1px solid ${color.border};
    display: grid;
    gap: 4px;
  }
  .t-search__kind {
    font-size: 0.75rem;
    color: ${color.accentDeep};
    letter-spacing: 0.05em;
  }
  .t-search__title {
    font-family: ${font.display};
    font-size: 1.1rem;
    font-weight: 600;
    color: ${color.ink};
    text-decoration: none;
  }
  .t-search__title:hover {
    color: ${color.accentDeep};
    text-decoration: underline;
  }
  .t-search__desc {
    font-size: 0.88rem;
    color: ${color.muted};
    line-height: 1.7;
  }
`

const Page = () => (
  <>
    <Style id="search">{styles}</Style>
    <Breadcrumbs items={[{ name: "サイト内検索", href: paths.search() }]} />
    <PageHeader
      eyebrow="Search"
      title="サイト内検索"
      description="記事のタイトル・本文、人物や怪物の名前と別名、作品名、神話名、タグから検索できます。"
    />
    <SearchClient
      indexUrl={assetPath("/search-index.json")}
      basePath={site.basePath}
    />
    <Section title="人物・怪物から探す" en="Figures" id="search-figures">
      <ChipList
        items={getFigures().map((f) => ({
          href: paths.figure(f.slug),
          label: f.name,
        }))}
      />
    </Section>
    <Section title="タグから探す" en="Tags" id="search-tags">
      <ChipList
        items={getTags().map((t) => ({
          href: paths.tag(t.name),
          label: `#${t.name}`,
          sub: String(t.count),
        }))}
      />
    </Section>
  </>
)

export default Page
