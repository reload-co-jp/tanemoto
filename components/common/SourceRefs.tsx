import { SourceList } from "@/components/article/SourceList"
import { getSourcesByIds } from "@/lib/content/repository"
import { Section } from "./PageParts"

/** 人物・神話ページなどの「出典」セクション */
export const SourceRefs = ({ sourceIds }: { sourceIds: string[] }) => {
  const sources = getSourcesByIds(sourceIds)
  if (sources.length === 0) return null
  return (
    <Section title="出典" en="Sources" id="sources">
      <SourceList sources={sources} />
    </Section>
  )
}
