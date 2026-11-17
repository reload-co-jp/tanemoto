import type { TocItem } from "@/lib/content/text"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"

const styles = css`
  .t-toc {
    background: ${color.paper};
    border: 1px solid ${color.border};
    border-top: 2px solid ${color.navy};
    font-size: 0.9rem;
  }
  .t-toc summary {
    cursor: pointer;
    padding: 12px 16px;
    font-family: ${font.serif};
    font-weight: 600;
    color: ${color.navy};
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .t-toc summary::-webkit-details-marker {
    display: none;
  }
  .t-toc summary::after {
    content: "＋";
    color: ${color.gold};
    font-size: 0.9rem;
  }
  .t-toc[open] summary::after {
    content: "－";
  }
  .t-toc__en {
    font-family: ${font.latin};
    letter-spacing: 0.2em;
    font-size: 0.7rem;
    color: ${color.goldDeep};
    margin-left: 8px;
    font-weight: 400;
  }
  .t-toc ol {
    list-style: none;
    padding: 0 16px 14px;
    counter-reset: toc;
  }
  .t-toc li {
    line-height: 1.6;
  }
  .t-toc li + li {
    margin-top: 6px;
  }
  .t-toc a {
    color: ${color.text};
    text-decoration: none;
    display: block;
  }
  .t-toc a:hover {
    color: ${color.goldDeep};
    text-decoration: underline;
  }
  .t-toc__h2 {
    counter-increment: toc;
    display: grid;
    grid-template-columns: 1.8em 1fr;
  }
  .t-toc__h2::before {
    content: counter(toc, decimal-leading-zero);
    font-family: ${font.latin};
    color: ${color.goldDeep};
  }
  .t-toc__h3 {
    padding-left: 1.8em;
    font-size: 0.85rem;
  }
  .t-toc__h3 a {
    color: ${color.muted};
  }
`

/** 目次。<details> を使い、JavaScript なしで開閉できる */
export const Toc = ({
  items,
  open = true,
}: {
  items: TocItem[]
  open?: boolean
}) => {
  if (items.length === 0) return null
  return (
    <nav aria-label="目次">
      <Style id="toc">{styles}</Style>
      <details className="t-toc" open={open}>
        <summary>
          <span>
            目次<span className="t-toc__en">CONTENTS</span>
          </span>
        </summary>
        <ol>
          {items.map((item) => (
            <li key={item.id} className={`t-toc__h${item.level}`}>
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  )
}
