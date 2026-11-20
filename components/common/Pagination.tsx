import { css, Style } from "@/lib/styles/css"
import { color } from "@/lib/styles/theme"
import { Link } from "./Link"

const styles = css`
  .t-pager {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 40px;
    list-style: none;
    flex-wrap: wrap;
  }
  .t-pager a,
  .t-pager span {
    display: inline-flex;
    min-width: 40px;
    height: 40px;
    align-items: center;
    justify-content: center;
    border: 2px solid ${color.ink};
    border-radius: 999px;
    font-weight: 700;
    padding: 0 12px;
    text-decoration: none;
    color: ${color.text};
    background: ${color.paper};
  }
  .t-pager a:hover {
    border-color: ${color.accent};
  }
  .t-pager [aria-current] {
    background: ${color.ink};
    color: ${color.cream};
    border-color: ${color.ink};
  }
`

export const Pagination = ({
  current,
  total,
  href,
}: {
  current: number
  total: number
  href: (page: number) => string
}) => {
  if (total <= 1) return null
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <nav aria-label="ページ送り">
      <Style id="pager">{styles}</Style>
      <ul className="t-pager">
        {current > 1 && (
          <li>
            <Link href={href(current - 1)} rel="prev">
              ← 前へ
            </Link>
          </li>
        )}
        {pages.map((page) => (
          <li key={page}>
            {page === current ? (
              <span aria-current="page">{page}</span>
            ) : (
              <Link href={href(page)}>{page}</Link>
            )}
          </li>
        ))}
        {current < total && (
          <li>
            <Link href={href(current + 1)} rel="next">
              次へ →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
