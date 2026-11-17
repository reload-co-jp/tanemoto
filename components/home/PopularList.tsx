import { Link } from "@/components/common/Link"
import type { Article } from "@/lib/content/schema"
import { paths } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"

const styles = css`
  .t-rank {
    list-style: none;
    counter-reset: rank;
  }
  .t-rank li {
    counter-increment: rank;
    display: grid;
    grid-template-columns: 2.2em 1fr;
    gap: 8px;
    padding: 12px 0;
    border-bottom: 1px solid ${color.border};
    align-items: baseline;
  }
  .t-rank li::before {
    content: counter(rank);
    font-family: ${font.latin};
    font-size: 1.5rem;
    color: ${color.gold};
    line-height: 1;
  }
  .t-rank a {
    font-family: ${font.serif};
    color: ${color.navy};
    text-decoration: none;
    line-height: 1.6;
  }
  .t-rank a:hover {
    color: ${color.goldDeep};
    text-decoration: underline;
  }
`

export const PopularList = ({ articles }: { articles: Article[] }) => (
  <>
    <Style id="rank">{styles}</Style>
    <ol className="t-rank">
      {articles.map((a) => (
        <li key={a.id}>
          <Link href={paths.article(a.slug)}>{a.title}</Link>
        </li>
      ))}
    </ol>
  </>
)
