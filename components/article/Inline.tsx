import { Link } from "@/components/common/Link"
import { parseInline } from "@/lib/content/text"

/** インライン記法（**強調**・[リンク](URL)）を描画する */
export const Inline = ({ text }: { text: string }) => (
  <>
    {parseInline(text).map((node, i) => {
      switch (node.type) {
        case "strong":
          return <strong key={i}>{node.value}</strong>
        case "link":
          return (
            <Link key={i} href={node.href}>
              {node.value}
            </Link>
          )
        default:
          return node.value
      }
    })}
  </>
)
