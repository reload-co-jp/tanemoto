import { LegacyRedirect } from "@/components/common/LegacyRedirect"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

/** 旧URL（/mythologies/）→ /sources/ への転送 */
export const metadata = buildMetadata({
  title: "原典から探す",
  path: paths.mythologies(),
  noindex: true,
})

const Page = () => <LegacyRedirect to={paths.mythologies()} />

export default Page
