import { Breadcrumbs } from "@/components/common/Breadcrumbs"
import { Link } from "@/components/common/Link"
import { Mascot, MascotName } from "@/components/common/Mascot"
import { PageHeader, Section } from "@/components/common/PageParts"
import { buildMetadata } from "@/lib/seo"
import { paths, site } from "@/lib/site"
import { css, Style } from "@/lib/styles/css"
import { bp, color, radius, shadow } from "@/lib/styles/theme"

export const metadata = buildMetadata({
  title: "運営者情報",
  description: `${site.name}の運営者情報とお問い合わせについて。`,
  path: paths.about(),
})

const crew: { mascot: MascotName; name: string; text: string }[] = [
  {
    mascot: "ferret-front",
    name: "フェレットの旅人",
    text: "トモタネの主人公。羅針盤のブローチと古い本を手に、キャラクターの名前やモチーフの「元」をたどる旅をしている。",
  },
  {
    mascot: "owl",
    name: "フクロウの博士",
    text: "原典と研究にくわしい物知り。「その話、出典は？」が口ぐせで、事実と解釈の区別にきびしい。",
  },
  {
    mascot: "cat",
    name: "ねこの案内人",
    text: "アニメ・漫画・ゲームの世界を渡り歩く案内役。作品の設定と神話のちがいを見つけるのが得意。",
  },
  {
    mascot: "mouse",
    name: "ねずみの地図屋",
    text: "神話とキャラクターのつながりを地図にまとめている。神話からの逆引きはおまかせ。",
  },
]

const styles = css`
  .t-crew {
    list-style: none;
    display: grid;
    gap: 14px;
    padding: 0;
    margin: 0;
  }
  @media ${bp.sm} {
    .t-crew {
      grid-template-columns: 1fr 1fr;
    }
  }
  .t-crew__item {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0;
    padding: 14px 16px;
    background: ${color.paper};
    border: 2px solid ${color.line};
    border-radius: ${radius.md};
    box-shadow: ${shadow.sm};
  }
  .t-crew__item .t-mascot {
    flex: none;
    width: 76px;
    height: auto;
  }
  .t-crew__name {
    font-weight: 900;
    color: ${color.ink};
  }
  .t-crew__text {
    margin: 4px 0 0;
    font-size: 0.85rem;
    line-height: 1.7;
    color: ${color.muted};
  }
`

const Page = () => (
  <>
    <Breadcrumbs items={[{ name: "運営者情報", href: paths.about() }]} />
    <Style id="about">{styles}</Style>
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
      <Section title="トモタネの仲間たち" id="crew">
        <p>サイトのあちこちで、元ネタをたどる旅の仲間たちが案内します。</p>
        <ul className="t-crew">
          {crew.map((c) => (
            <li key={c.name} className="t-crew__item">
              <Mascot name={c.mascot} height={96} />
              <div>
                <p className="t-crew__name">{c.name}</p>
                <p className="t-crew__text">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
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
