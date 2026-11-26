/**
 * ゼロランタイムの CSS-in-JS。
 *
 * コンポーネントと同じファイルに `css` テンプレートでスタイルを書き、
 * <Style> で出力する。React 19 の <style href precedence> を利用するため、
 * 同じ id のスタイルは1ページ内で1回だけ <head> に挿入され、
 * クライアント側のJavaScriptを必要としない。
 */
export const css = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): string =>
  strings
    .reduce(
      (acc, str, i) => acc + str + (i < values.length ? String(values[i]) : ""),
      ""
    )
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .trim()

export const Style = ({
  id,
  children,
  precedence = "components",
}: {
  id: string
  children: string
  precedence?: "base" | "components"
}) => (
  <style href={`tanetomo-${id}`} precedence={precedence}>
    {children}
  </style>
)
