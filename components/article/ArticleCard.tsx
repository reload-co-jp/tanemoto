import { Eyecatch } from "@/components/common/Eyecatch"
import { Link } from "@/components/common/Link"
import type { Article } from "@/lib/content/schema"
import { getCategory } from "@/lib/content/repository"
import { formatDate } from "@/lib/format"
import { paths } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, font, radius, shadow } from "@/lib/styles/theme"
import { articleVisual } from "./articleVisual"

const styles = css`
  .t-cards {
    display: grid;
    gap: 28px 24px;
    grid-template-columns: 1fr;
    list-style: none;
  }
  @media ${bp.sm} {
    .t-cards {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media ${bp.lg} {
    .t-cards--3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  .t-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: ${color.paper};
    border: 2.5px solid ${color.ink};
    border-radius: ${radius.lg};
    box-shadow: ${shadow.md};
    padding: 12px 12px 16px;
    transition:
      transform 0.15s,
      box-shadow 0.15s;
  }
  .t-card:hover {
    transform: translate(-2px, -3px) rotate(-0.4deg);
    box-shadow: ${shadow.lg};
  }
  .t-card .t-card__body {
    padding: 0 6px;
  }
  .t-card__body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .t-card__link {
    color: inherit;
    text-decoration: none;
  }
  .t-card__link::after {
    content: "";
    position: absolute;
    inset: 0;
  }
  .t-card:hover .t-card__title {
    color: ${color.accentDeep};
  }
  .t-card__cat {
    align-self: flex-start;
    font-size: 0.7rem;
    font-weight: 700;
    color: ${color.ink};
    background: ${color.yellow};
    border: 2px solid ${color.ink};
    border-radius: 999px;
    padding: 0 10px;
    letter-spacing: 0.04em;
  }
  .t-card__title {
    font-family: ${font.display};
    font-size: 1.08rem;
    font-weight: 700;
    line-height: 1.5;
    color: ${color.ink};
    transition: color 0.15s;
  }
  .t-card__desc {
    font-size: 0.85rem;
    color: ${color.muted};
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .t-card__date {
    font-size: 0.75rem;
    color: ${color.muted};
    font-family: ${font.pop};
    font-weight: 500;
    letter-spacing: 0.05em;
  }

  .t-rows {
    list-style: none;
  }
  .t-row {
    position: relative;
    display: grid;
    grid-template-columns: 96px 1fr;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 2.5px dotted ${color.ink};
    align-items: start;
  }
  @media ${bp.sm} {
    .t-row {
      grid-template-columns: 160px 1fr;
      gap: 20px;
    }
  }
  .t-row:hover .t-card__title {
    color: ${color.accentDeep};
  }
  .t-row .t-eyecatch--card {
    font-size: 0.5rem;
  }
  @media ${bp.sm} {
    .t-row .t-eyecatch--card {
      font-size: 0.7rem;
    }
  }
`

export const ArticleCard = ({
  article,
  layout = "card",
  headingLevel = 3,
}: {
  article: Article
  layout?: "card" | "row"
  headingLevel?: 2 | 3
}) => {
  const visual = articleVisual(article)
  const category = getCategory(article.category)
  const Heading = `h${headingLevel}` as "h2" | "h3"
  return (
    <li className={layout === "row" ? "t-row" : "t-card"}>
      <Eyecatch {...visual} />
      <div className="t-card__body">
        {category && <span className="t-card__cat">{category.name}</span>}
        <Heading className="t-card__title">
          <Link href={paths.article(article.slug)} className="t-card__link">
            {article.title}
          </Link>
        </Heading>
        <p className="t-card__desc">{article.description}</p>
        <time className="t-card__date" dateTime={article.publishedAt}>
          {formatDate(article.publishedAt)}
        </time>
      </div>
    </li>
  )
}

export const ArticleList = ({
  articles,
  layout = "card",
  columns = 3,
  headingLevel,
}: {
  articles: Article[]
  layout?: "card" | "row"
  columns?: 2 | 3
  headingLevel?: 2 | 3
}) => {
  if (articles.length === 0)
    return <p className="t-empty">記事は準備中です。</p>
  return (
    <>
      <Style id="cards">{styles}</Style>
      <ul
        className={layout === "row" ? "t-rows" : `t-cards t-cards--${columns}`}
      >
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            layout={layout}
            headingLevel={headingLevel}
          />
        ))}
      </ul>
    </>
  )
}
