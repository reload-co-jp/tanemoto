import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import {
  ClassificationLabel,
  classificationInfo,
} from "@/components/common/ClassificationLabel"
import { Link } from "@/components/common/Link"
import { PageHeader, Section } from "@/components/common/PageParts"
import { classifications } from "@/lib/content/schema"
import { buildMetadata } from "@/lib/seo"
import { paths, site } from "@/lib/site"

export const metadata = buildMetadata({
  title: "編集方針",
  description: `${site.name}の編集方針。情報の取り扱い、出典の示し方、情報区分ラベル、訂正の方針について説明します。`,
  path: paths.editorialPolicy(),
})

const examples: Record<string, string> = {
  fact: "「『神統記』では、メデューサはゴルゴン三姉妹の一人とされる」",
  scholarship: "研究者による年代推定や、神話の成立過程についての学説",
  variant: "「メデューサが罰を受けた理由は資料によって異なる」",
  creative: "アニメ・漫画の作中での設定や役割",
  editorial: "複数の資料を比べたうえでの編集部の整理・考察",
}

const Page = () => (
  <>
    <Breadcrumbs
      items={[
        { name: "運営者情報", href: paths.about() },
        { name: "編集方針", href: paths.editorialPolicy() },
      ]}
    />
    <PageHeader
      eyebrow="Editorial Policy"
      title="編集方針"
      description="トモタネが記事を作成する際の基準と、情報の示し方について説明します。"
    />
    <div className="t-prose">
      <Section title="基本方針" id="principles">
        <ol>
          <li>
            記事は、原典（古典文献）・史料・研究書などを確認したうえで作成します。
          </li>
          <li>
            本文中の主要な主張には、根拠となる出典と該当箇所（行番号・巻章など）を示します。
          </li>
          <li>
            事実・学説・異伝・作品の設定・編集部の考察を区別し、ラベルで明示します。
          </li>
          <li>架空の出典や、確認できない引用・史実を掲載しません。</li>
          <li>
            作品と神話の関係を、根拠なく断定しません。作中の名称・設定から確認できる範囲で記述します。
          </li>
        </ol>
      </Section>

      <Section title="情報区分ラベル" id="classification">
        <p>
          本文中の段落や囲み記事には、内容の性質に応じて次のラベルを付けています。ラベルをクリックすると、記事末尾の「本文の根拠」で出典と該当箇所を確認できます。
        </p>
        <dl style={{ marginTop: 16, display: "grid", gap: 14 }}>
          {classifications.map((c) => (
            <div key={c}>
              <dt
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <ClassificationLabel classification={c} />
                {classificationInfo[c].ja}
              </dt>
              <dd style={{ marginTop: 4, fontSize: "0.92rem" }}>
                {classificationInfo[c].description}。例：{examples[c]}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="出典の扱い" id="sources">
        <ul>
          <li>
            <strong>一次資料</strong>
            ：ホメロスやヘシオドスなど、神話を伝える古典文献。可能な限り原典の該当箇所を確認し、行番号・巻章節で示します。
          </li>
          <li>
            <strong>二次資料</strong>
            ：研究書・論文・注釈書。学説を紹介する場合は、誰の説であるかを明記します。
          </li>
          <li>
            <strong>Webリソース</strong>：原典の確認には、Perseus Digital
            Library などの学術的なデジタルライブラリを利用します。
          </li>
        </ul>
        <p>
          古典文献の成立年代には諸説あるものが多いため、年代は目安として「頃」「諸説あり」と表記します。
          利用している資料の一覧は
          <Link href={paths.references()}>参考文献・情報源</Link>
          にまとめています。
        </p>
      </Section>

      <Section title="画像・著作権" id="images">
        <ul>
          <li>
            アニメ・漫画の公式画像、書籍・論文の図版を無断で転載しません。
          </li>
          <li>
            パブリックドメインの美術作品や、利用許諾を得た画像を優先して使用します。
          </li>
          <li>
            画像ごとに出典・作者・ライセンス・クレジットを管理し、表示します。
          </li>
          <li>
            AI生成画像を使用する場合は、その旨を明記し、実在の史料・作品と誤認されないようにします。
          </li>
        </ul>
      </Section>

      <Section title="訂正について" id="corrections">
        <p>
          記事の誤りが判明した場合は、速やかに訂正し、記事の更新日を改めます。内容に関するご指摘は
          <Link href={`${paths.about()}#contact`}>運営者情報</Link>
          のお問い合わせ先までお寄せください。
        </p>
      </Section>
    </div>
  </>
)

export default Page
