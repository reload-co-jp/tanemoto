import { ClaimMarks } from "@/components/article/ClaimMarks"
import { Inline } from "@/components/article/Inline"
import type { Claim } from "@/lib/content/schema"

/** 本文＋情報区分ラベル（根拠へのリンク） */
export const EvidenceText = ({
  value,
  claims,
}: {
  value: { text: string; claimIds: string[] }
  claims: Claim[]
}) => (
  <>
    <Inline text={value.text} />
    <ClaimMarks claimIds={value.claimIds} claims={claims} />
  </>
)
