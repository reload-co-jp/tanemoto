/** 構造化データ（JSON-LD）を出力する */
export const JsonLd = ({ data }: { data: object | object[] }) => (
  <script
    type="application/ld+json"
    // JSON.stringify の結果に含まれる "<" をエスケープして script 終端の混入を防ぐ
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    }}
  />
)
