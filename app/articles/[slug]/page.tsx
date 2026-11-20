import { notFound } from "next/navigation"
import { ArticleList } from "@/components/article/ArticleCard"
import { ArticleBody } from "@/components/article/ArticleBody"
import { articleVisual } from "@/components/article/articleVisual"
import { ClaimList, SourceList } from "@/components/article/SourceList"
import { Toc } from "@/components/article/Toc"
import { AdSlot } from "@/components/common/AdSlot"
import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import {
  ClassificationLabel,
  classificationInfo,
} from "@/components/common/ClassificationLabel"
import { Eyecatch } from "@/components/common/Eyecatch"
import { OriginSummary } from "@/components/character/OriginSummary"
import { Link } from "@/components/common/Link"
import { ChipList, Section, TileList } from "@/components/common/PageParts"
import { JsonLd } from "@/components/seo/JsonLd"
import { classifications, figureTypes } from "@/lib/content/schema"
import {
  getArticle,
  getArticles,
  getCategory,
  getCharactersForArticle,
  getFiguresByIds,
  getImage,
  getMythologiesByIds,
  getRelatedArticles,
  getSourcesByIds,
  getStoriesByIds,
  getTopicsByIds,
  getWorksByIds,
} from "@/lib/content/repository"
import { buildToc, readingMinutes } from "@/lib/content/text"
import { formatDate } from "@/lib/format"
import { articleJsonLd, buildMetadata } from "@/lib/seo"
import { paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font } from "@/lib/styles/theme"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getArticles().map((a) => ({ slug: a.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const article = getArticle((await params).slug)
  if (!article) return {}
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: paths.article(article.slug),
    type: "article",
    image: getImage(article.thumbnail)?.src,
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    tags: article.tags,
  })
}

const styles = css`
  .t-article__head {
    max-width: 46em;
  }
  .t-article__cat {
    display: inline-block;
    font-size: 0.8rem;
    color: ${color.accentDeep};
    text-decoration: none;
    letter-spacing: 0.08em;
    border-bottom: 1px solid ${color.accent};
  }
  .t-article__title {
    font-size: 1.65rem;
    line-height: 1.45;
    margin-top: 10px;
  }
  @media ${bp.md} {
    .t-article__title {
      font-size: 2.2rem;
    }
  }
  .t-article__lead {
    margin-top: 16px;
    font-size: 1.02rem;
    color: ${color.charcoal};
    line-height: 1.95;
    font-family: ${font.display};
  }
  .t-article__dates {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    margin-top: 14px;
    font-size: 0.8rem;
    color: ${color.muted};
  }
  .t-article__origins {
    margin-bottom: 32px;
  }
  .t-article__origins-title {
    font-size: 1rem;
    margin-bottom: 12px;
    color: ${color.accentDeep};
    letter-spacing: 0.05em;
  }
  .t-article__origins-grid {
    display: grid;
    gap: 16px;
  }
  @media ${bp.md} {
    .t-article__origins-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  .t-article__hero {
    margin: 24px 0 32px;
  }
  .t-article__toc-inline {
    margin-bottom: 32px;
  }
  @media ${bp.lg} {
    .t-article__toc-inline {
      display: none;
    }
  }
  .t-article__aside {
    display: none;
  }
  @media ${bp.lg} {
    .t-article__aside {
      display: block;
    }
    .t-article__sticky {
      position: sticky;
      top: 24px;
      display: grid;
      gap: 20px;
      max-height: calc(100dvh - 48px);
      overflow-y: auto;
    }
  }
  .t-legend {
    font-size: 0.8rem;
    border: 2.5px solid ${color.ink};
    border-radius: 14px;
    box-shadow: 4px 4px 0 ${color.ink};
    background: ${color.paper};
    padding: 14px 16px;
  }
  .t-legend__title {
    font-family: ${font.display};
    font-weight: 600;
    color: ${color.ink};
    margin-bottom: 8px;
    font-size: 0.9rem;
  }
  .t-legend ul {
    list-style: none;
    display: grid;
    gap: 6px;
  }
  .t-legend li {
    display: flex;
    gap: 8px;
    align-items: center;
    color: ${color.muted};
  }
  .t-legend__more {
    margin-top: 10px;
    display: inline-block;
  }
  .t-article__section-intro {
    font-size: 0.85rem;
    color: ${color.muted};
    margin-bottom: 16px;
  }
  .t-stories {
    list-style: none;
    display: grid;
    gap: 12px;
  }
  .t-stories li {
    border-left: 2px solid ${color.accent};
    padding: 2px 0 2px 14px;
  }
  .t-stories__title {
    font-family: ${font.display};
    font-weight: 600;
    color: ${color.ink};
  }
  .t-stories__summary {
    font-size: 0.88rem;
    color: ${color.muted};
    line-height: 1.7;
  }
`

const Legend = ({ used }: { used: Set<string> }) => (
  <div className="t-legend">
    <p className="t-legend__title">情報区分ラベル</p>
    <ul>
      {classifications
        .filter((c) => used.has(c))
        .map((c) => (
          <li key={c}>
            <ClassificationLabel classification={c} />
            {classificationInfo[c].ja}
          </li>
        ))}
    </ul>
    <Link
      href={`${paths.editorialPolicy()}#classification`}
      className="t-legend__more"
    >
      情報区分について →
    </Link>
  </div>
)

const Page = async ({ params }: Props) => {
  const article = getArticle((await params).slug)
  if (!article) notFound()

  const category = getCategory(article.category)
  const toc = buildToc(article.body)
  const sources = getSourcesByIds(article.sourceIds)
  const images = article.body.flatMap((b) =>
    b.type === "image"
      ? [getImage(b.imageId)].filter((x) => x !== undefined)
      : []
  )
  const figures = getFiguresByIds(article.figureIds)
  const stories = getStoriesByIds(article.storyIds)
  const works = getWorksByIds(article.workIds)
  const topics = getTopicsByIds(article.topicIds)
  const mythologies = getMythologiesByIds(article.mythologyIds)
  const related = getRelatedArticles(article, 4)
  const characters = getCharactersForArticle(article)
  const visual = articleVisual(article)
  const usedClassifications = new Set(
    article.claims.map((c) => c.classification)
  )

  return (
    <article>
      <Style id="article">{styles}</Style>
      <JsonLd data={articleJsonLd(article, visual.image?.src)} />
      <Breadcrumbs
        items={[
          { name: "記事一覧", href: paths.articles() },
          ...(category
            ? [{ name: category.name, href: paths.category(category.slug) }]
            : []),
          {
            name: article.shortTitle ?? article.title,
            href: paths.article(article.slug),
          },
        ]}
      />

      <header className="t-article__head">
        {category && (
          <Link href={paths.category(category.slug)} className="t-article__cat">
            {category.name}
          </Link>
        )}
        <h1 className="t-article__title">{article.title}</h1>
        <p className="t-article__lead">{article.lead ?? article.description}</p>
        <div className="t-article__dates">
          <span>
            公開日：
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
          </span>
          {article.updatedAt !== article.publishedAt && (
            <span>
              更新日：
              <time dateTime={article.updatedAt}>
                {formatDate(article.updatedAt)}
              </time>
            </span>
          )}
          <span>読了目安：約{readingMinutes(article.body)}分</span>
        </div>
      </header>

      <div className="t-article__hero">
        <Eyecatch {...visual} variant="hero" priority />
      </div>

      <div className="t-two-col">
        <div>
          {characters.length > 0 && (
            <section
              className="t-article__origins"
              aria-labelledby="origins-title"
            >
              <h2 className="t-article__origins-title" id="origins-title">
                {article.characterIds.length > 0
                  ? "この記事のキャラクターと元ネタ"
                  : "この元ネタが登場するキャラクター"}
              </h2>
              <div className="t-article__origins-grid">
                {characters.map((c) => (
                  <OriginSummary key={c.id} character={c} />
                ))}
              </div>
            </section>
          )}

          <div className="t-article__toc-inline">
            <Toc items={toc} open />
          </div>

          <ArticleBody
            blocks={article.body}
            claims={article.claims}
            sources={sources}
            images={images}
          />

          <AdSlot slot={site.adSlots.articleBottom} />

          {(figures.length > 0 ||
            stories.length > 0 ||
            works.length > 0 ||
            topics.length > 0 ||
            mythologies.length > 0) && (
            <Section title="関連情報" en="Related" id="related-info">
              {figures.length > 0 && (
                <>
                  <h3 className="t-article__section-intro">
                    関連する人物・怪物
                  </h3>
                  <TileList
                    items={figures.map((f) => ({
                      href: paths.figure(f.slug),
                      title: f.name,
                      eyebrow: `${figureTypes[f.type]}${f.romanized ? ` ／ ${f.romanized}` : ""}`,
                      description: f.description,
                    }))}
                  />
                </>
              )}
              {stories.length > 0 && (
                <>
                  <h3
                    className="t-article__section-intro"
                    style={{ marginTop: 28 }}
                  >
                    関連する物語
                  </h3>
                  <ul className="t-stories">
                    {stories.map((s) => (
                      <li key={s.id}>
                        <p className="t-stories__title">{s.title}</p>
                        <p className="t-stories__summary">{s.summary}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {works.length > 0 && (
                <>
                  <h3
                    className="t-article__section-intro"
                    style={{ marginTop: 28 }}
                  >
                    関連作品
                  </h3>
                  <ChipList
                    items={works.map((w) => ({
                      href: paths.work(w.slug),
                      label: `『${w.title}』`,
                    }))}
                  />
                </>
              )}
              {(topics.length > 0 || mythologies.length > 0) && (
                <>
                  <h3
                    className="t-article__section-intro"
                    style={{ marginTop: 28 }}
                  >
                    神話体系・テーマ
                  </h3>
                  <ChipList
                    items={[
                      ...mythologies.map((m) => ({
                        href: paths.mythology(m.slug),
                        label: m.name,
                      })),
                      ...topics.map((t) => ({
                        href: paths.topic(t.slug),
                        label: t.name,
                      })),
                    ]}
                  />
                </>
              )}
              {article.tags.length > 0 && (
                <>
                  <h3
                    className="t-article__section-intro"
                    style={{ marginTop: 28 }}
                  >
                    タグ
                  </h3>
                  <ChipList
                    items={article.tags.map((t) => ({
                      href: paths.tag(t),
                      label: `#${t}`,
                    }))}
                  />
                </>
              )}
            </Section>
          )}

          {article.claims.length > 0 && (
            <Section title="本文の根拠" en="Evidence" id="evidence">
              <p className="t-article__section-intro">
                本文中のラベル（FACT・SCHOLARSHIP
                など）は、以下の主張と出典に対応しています。
              </p>
              <ClaimList claims={article.claims} sources={sources} />
            </Section>
          )}

          <Section title="出典・参考文献" en="References" id="references">
            <SourceList sources={sources} />
          </Section>

          {related.length > 0 && (
            <Section title="関連記事" en="Read Next" id="related-articles">
              <ArticleList articles={related} columns={2} />
            </Section>
          )}
        </div>

        <aside className="t-article__aside" aria-label="記事の補足情報">
          <div className="t-article__sticky">
            <Toc items={toc} open />
            {usedClassifications.size > 0 && (
              <Legend used={usedClassifications} />
            )}
            <AdSlot slot={site.adSlots.sidebar} />
          </div>
        </aside>
      </div>
    </article>
  )
}

export default Page
