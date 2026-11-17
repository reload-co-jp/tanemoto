import NextLink from "next/link"
import { ComponentProps } from "react"

/**
 * 内部リンクは next/link（basePath を自動付与）、外部リンクは新しいタブで開く。
 */
export const Link = ({
  href,
  children,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { href: string }) => {
  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
        <span className="t-visually-hidden">（新しいタブで開きます）</span>
      </a>
    )
  }
  return (
    <NextLink href={href} prefetch={false} {...props}>
      {children}
    </NextLink>
  )
}
