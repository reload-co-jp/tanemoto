import { ReactNode } from "react"
import { css, Style } from "@/lib/styles/css"
import { color, font, radius, shadow } from "@/lib/styles/theme"
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
  <header
    className="t-page-header"
    data-title={`${(eyebrow?.match(/^[A-Za-z][A-Za-z ]*/)?.[0] ?? "Tomotane").trim().replace(/\s+/g, "_")}.txt`}
  >
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
      <div>
        {en && (
          <p className="t-section__en" aria-hidden="true">
            {en}
          </p>
        )}
        <Heading
          className={`t-section__title${en ? "" : " t-section__title--solo"}`}
          id={id ? `${id}-title` : undefined}
        >
          {title}
        </Heading>
      </div>
      {more && (
        <Link href={more.href} className="t-section__more">
          {more.label}
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
    padding: 4px 14px;
    border: 2px solid ${color.line};
    background: ${color.paper};
    border-radius: 999px;
    font-size: 0.85rem;
    font-weight: 700;
    color: ${color.ink};
    text-decoration: none;
    line-height: 1.5;
    box-shadow: 2px 2px 0 ${color.glow};
    transition:
      transform 0.15s,
      box-shadow 0.15s,
      background 0.15s;
  }
  a.t-chip:hover {
    color: ${color.ink};
    background: ${color.yellowPale};
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 ${color.glow};
  }
  .t-chip[aria-current] {
    background: ${color.accent};
    color: #fff;
    border-color: ${color.ink};
  }
  .t-chip small {
    color: ${color.muted};
    font-size: 0.72rem;
  }
  .t-chip[aria-current] small {
    color: #fff;
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
    border: 2.5px solid ${color.line};
    border-radius: ${radius.md};
    box-shadow: ${shadow.sm};
    padding: 18px 18px 16px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    overflow: hidden;
    transition:
      transform 0.15s,
      box-shadow 0.15s;
  }
  .t-tile::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 6px;
    background: var(--t-tile-accent, ${color.accent});
  }
  .t-tiles > li:nth-child(4n + 2) {
    --t-tile-accent: ${color.yellow};
    --t-tile-pale: ${color.yellowPale};
  }
  .t-tiles > li:nth-child(4n + 3) {
    --t-tile-accent: ${color.mint};
    --t-tile-pale: ${color.mintPale};
  }
  .t-tiles > li:nth-child(4n + 4) {
    --t-tile-accent: ${color.violet};
    --t-tile-pale: ${color.violetPale};
  }
  .t-tile:hover {
    transform: translate(-2px, -2px);
    box-shadow: ${shadow.md};
    background: var(--t-tile-pale, ${color.accentPale});
  }
  .t-tile__eyebrow {
    font-family: ${font.display};
    font-weight: 800;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    color: ${color.accentDeep};
    margin-top: 2px;
  }
  .t-tile__title {
    font-family: ${font.display};
    font-size: 1.1rem;
    color: ${color.ink};
    font-weight: 700;
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

  .t-tile__desc {
    font-size: 0.85rem;
    color: ${color.muted};
    line-height: 1.7;
  }
  .t-tile__meta {
    font-size: 0.72rem;
    font-weight: 700;
    color: ${color.ink};
    margin-top: auto;
    padding-top: 8px;
    align-self: flex-start;
  }
  .t-tile--soon {
    opacity: 0.7;
    border-style: dashed;
    box-shadow: none;
  }
  .t-tile--soon:hover {
    transform: none;
    box-shadow: none;
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
