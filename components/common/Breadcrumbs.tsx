import { JsonLd } from "@/components/seo/JsonLd"
import { breadcrumbJsonLd } from "@/lib/seo"
import { css, Style } from "@/lib/styles/css"
import { color } from "@/lib/styles/theme"
import { Link } from "./Link"

export type Crumb = { name: string; href: string }

const styles = css`
  .t-crumbs {
    font-size: 0.8rem;
    color: ${color.muted};
    margin-bottom: 20px;
  }
  .t-crumbs ol {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 0;
    list-style: none;
  }
  .t-crumbs li {
    display: inline-flex;
    align-items: center;
  }
  .t-crumbs li + li::before {
    content: "›";
    margin: 0 8px;
    color: ${color.gold};
  }
  .t-crumbs a {
    color: ${color.muted};
    text-decoration: none;
  }
  .t-crumbs a:hover {
    color: ${color.goldDeep};
    text-decoration: underline;
  }
  .t-crumbs [aria-current] {
    color: ${color.text};
  }
`

/** パンくずリスト（先頭の「トップ」は自動で付与） */
export const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  const all = [{ name: "トップ", href: "/" }, ...items]
  return (
    <nav className="t-crumbs" aria-label="パンくずリスト">
      <Style id="crumbs">{styles}</Style>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol>
        {all.map((item, i) =>
          i === all.length - 1 ? (
            <li key={item.href} aria-current="page">
              {item.name}
            </li>
          ) : (
            <li key={item.href}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          )
        )}
      </ol>
    </nav>
  )
}
