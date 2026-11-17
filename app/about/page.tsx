import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { Link } from "@/components/common/Link"
import { PageHeader, Section } from "@/components/common/PageParts"
import { buildMetadata } from "@/lib/seo"
import { paths, site } from "@/lib/site"

export const metadata = buildMetadata({
  title: "運営者情報",
  description: `${site.name}の運営者情報とお問い合わせについて。`,
  path: paths.about(),
})

const Page = () => (
  <>
    <Breadcrumbs items={[{ name: "運営者情報", href: paths.about() }]} />
    <PageHeader eyebrow="About" title="運営者情報" />
    <div className="t-prose">
      <Section title={`${site.name}について`} id="about-site">
        <p>
          {site.name}
          は、アニメ・漫画などのエンタメ作品を入口に、キャラクター・能力・武器・組織・世界観の背景にある神話・伝承・文化を解説する知識メディアです。
        </p>
        <p>
          単なる「元ネタ紹介」ではなく、原典・史料・研究にもとづいて、事実と学説、異伝、作品独自の設定、編集部の考察を区別してお伝えすることを目指しています。
          詳しくは<Link href={paths.editorialPolicy()}>編集方針</Link>
          をご覧ください。
        </p>
      </Section>
      <Section title="運営" id="operator">
        <ul>
          <li>
            サイト名：{site.name}（{site.nameEn}）
          </li>
          <li>運営：{site.publisher.name}</li>
          <li>URL：{site.url}/</li>
        </ul>
      </Section>
      <Section title="お問い合わせ" id="contact">
        <p>
          記事内容の誤り・出典に関するご指摘、その他のお問い合わせは、運営者までご連絡ください。
          内容を確認のうえ、必要に応じて記事を訂正し、更新日を改めます。
        </p>
      </Section>
      <Section title="広告・アフィリエイトについて" id="ads">
        <p>
          当サイトは、Google AdSense
          などの第三者配信の広告サービスや、書籍等のアフィリエイトプログラムを利用する場合があります。
          広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie
          を使用することがあります。
          広告の有無や収益が、記事の内容や評価に影響することはありません。
        </p>
      </Section>
      <Section title="アクセス解析について" id="analytics">
        <p>
          当サイトでは、サイトの改善のために Google
          アナリティクス（GA4）を利用する場合があります。 データは Cookie
          を利用して匿名で収集され、個人を特定するものではありません。
        </p>
      </Section>
    </div>
  </>
)

export default Page
