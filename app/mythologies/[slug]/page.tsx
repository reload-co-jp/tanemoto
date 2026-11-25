import { notFound } from "next/navigation"
import { LegacyRedirect } from "@/components/common/LegacyRedirect"
import { getMythologies, getMythology } from "@/lib/content/repository"
import { buildMetadata } from "@/lib/seo"
import { paths } from "@/lib/site"

/** 旧URL（/mythologies/[slug]/）→ /sources/[slug]/ への転送 */
type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () =>
  getMythologies()
    .filter((m) => !m.comingSoon)
    .map((m) => ({ slug: m.slug }))

export const generateMetadata = async ({ params }: Props) => {
  const myth = getMythology((await params).slug)
  if (!myth) return {}
  return buildMetadata({
    title: myth.name,
    path: paths.mythology(myth.slug),
    noindex: true,
  })
}

const Page = async ({ params }: Props) => {
  const myth = getMythology((await params).slug)
  if (!myth || myth.comingSoon) notFound()
  return <LegacyRedirect to={paths.mythology(myth.slug)} />
}

export default Page
