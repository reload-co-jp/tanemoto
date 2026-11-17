/** 2026-11-20 → 2026年11月20日 */
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number)
  return `${y}年${m}月${d}日`
}

/** 2026-11-20 → 2026.11.20 */
export const formatDateDot = (iso: string) => iso.replaceAll("-", ".")
