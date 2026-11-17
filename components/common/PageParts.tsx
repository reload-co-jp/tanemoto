import { ReactNode } from "react"
import { css, Style } from "@/lib/styles/css"
import { color, font } from "@/lib/styles/theme"
import { Link } from "./Link"

export const PageHeader = ({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  children?: ReactNode
}) => (
  <header className="t-page-header">
    {eyebrow && <p className="t-page-header__eyebrow">{eyebrow}</p>}
    <h1 className="t-page-header__title">{title}</h1>
    {description && <div className="t-page-header__desc">{description}</div>}
    {children}
  </header>
)

export const Section = ({
  title,
  en,
  more,
  children,
  id,
  as: Heading = "h2",
}: {
  title: string
  en?: string
  more?: { href: string; label: string }
  children: ReactNode
  id?: string
  as?: "h2" | "h3"
}) => (
  <section
    className="t-section"
    aria-labelledby={id ? `${id}-title` : undefined}
  >
    <div className="t-section__head">
      <Heading className="t-section__title" id={id ? `${id}-title` : undefined}>
        {title}
        {en && <small>{en}</small>}
      </Heading>
      {more && (
        <Link href={more.href} className="t-section__more">
          {more.label} →
        </Link>
      )}
    </div>
    {children}
  </section>
)

const chipStyles = css`
  .t-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
  }
  .t-chip {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    padding: 5px 12px;
    border: 1px solid ${color.borderStrong};
    background: ${color.paper};
    border-radius: 999px;
    font-size: 0.85rem;
    color: ${color.text};
    text-decoration: none;
    line-height: 1.5;
  }
  a.t-chip:hover {
    border-color: ${color.gold};
    color: ${color.goldDeep};
  }
  .t-chip[aria-current] {
    background: ${color.navy};
    color: ${color.ivory};
    border-color: ${color.navy};
  }
  .t-chip small {
    color: ${color.muted};
    font-size: 0.72rem;
  }
  .t-chip[aria-current] small {
    color: ${color.goldPale};
  }
`

export type Chip = {
  href: string
  label: string
  sub?: string
  current?: boolean
}

export const ChipList = ({
  items,
  label,
}: {
  items: Chip[]
  label?: string
}) => {
  if (items.length === 0) return null
  return (
    <>
      <Style id="chips">{chipStyles}</Style>
      <ul className="t-chips" aria-label={label}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="t-chip"
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
              {item.sub && <small>{item.sub}</small>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

const tileStyles = css`
  .t-tiles {
    display: grid;
    gap: 16px;
    list-style: none;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
  }
  .t-tile {
    position: relative;
    background: ${color.paper};
    border: 1px solid ${color.border};
    padding: 18px 18px 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: border-color 0.15s;
  }
  .t-tile:hover {
    border-color: ${color.gold};
  }
  .t-tile__eyebrow {
    font-family: ${font.latin};
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${color.goldDeep};
  }
  .t-tile__title {
    font-family: ${font.serif};
    font-size: 1.1rem;
    color: ${color.navy};
    font-weight: 600;
  }
  .t-tile__title a {
    color: inherit;
    text-decoration: none;
  }
  .t-tile__title a::after {
    content: "";
    position: absolute;
    inset: 0;
  }
  .t-tile:hover .t-tile__title {
    color: ${color.goldDeep};
  }
  .t-tile__desc {
    font-size: 0.85rem;
    color: ${color.muted};
    line-height: 1.7;
  }
  .t-tile__meta {
    font-size: 0.75rem;
    color: ${color.muted};
    margin-top: auto;
    padding-top: 6px;
  }
  .t-tile--soon {
    opacity: 0.7;
  }
`

export type Tile = {
  href?: string
  title: string
  eyebrow?: string
  description?: string
  meta?: string
}

/** 人物・神話・テーマ・作品などのタイル一覧 */
export const TileList = ({ items }: { items: Tile[] }) => (
  <>
    <Style id="tiles">{tileStyles}</Style>
    <ul className="t-tiles">
      {items.map((item) => (
        <li key={item.href ?? item.title}>
          <div className={`t-tile${item.href ? "" : " t-tile--soon"}`}>
            {item.eyebrow && (
              <span className="t-tile__eyebrow">{item.eyebrow}</span>
            )}
            <h3 className="t-tile__title">
              {item.href ? (
                <Link href={item.href}>{item.title}</Link>
              ) : (
                item.title
              )}
            </h3>
            {item.description && (
              <p className="t-tile__desc">{item.description}</p>
            )}
            {item.meta && <p className="t-tile__meta">{item.meta}</p>}
          </div>
        </li>
      ))}
    </ul>
  </>
)
