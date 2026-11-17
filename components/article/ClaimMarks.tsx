import { ClassificationLabel } from "@/components/common/ClassificationLabel"
import type { Claim } from "@/lib/content/schema"

export const claimAnchor = (claimId: string) => `claim-${claimId}`

/** 本文中に表示する情報区分ラベル（根拠一覧へのリンク） */
export const ClaimMarks = ({
  claimIds,
  claims,
}: {
  claimIds: string[]
  claims: Claim[]
}) => {
  if (claimIds.length === 0) return null
  return (
    <span className="t-claim-marks">
      {claimIds.map((id) => {
        const index = claims.findIndex((c) => c.id === id)
        const claim = claims[index]
        if (!claim) return null
        return (
          <span key={id} className="t-claim-mark">
            <ClassificationLabel
              classification={claim.classification}
              href={`#${claimAnchor(id)}`}
            />
            <sup className="t-claim-num">
              <a
                href={`#${claimAnchor(id)}`}
                aria-label={`根拠${index + 1}を見る`}
              >
                {index + 1}
              </a>
            </sup>
          </span>
        )
      })}
    </span>
  )
}
