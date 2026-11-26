import { Breadcrumbs } from "@/components/common/Breadcrumbs"
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
    text: "タネトモの主人公。羅針盤のブローチと古い本を手に、キャラクターの名前やモチーフの「元」をたどる旅をしている。",
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
        <h3>元ネタを知ると、物語はもっと面白くなる。</h3>
        <p>
          {site.name}
          は、アニメや漫画、ゲームなどの作品に登場するキャラクターや設定の背景にある、神話・伝承・歴史・文化などをたどるメディアです。
        </p>
        <p>
          サイト名の「{site.name}
          」は、「元ネタ」の文字を並べ替えたアナグラムです。
        </p>
        <p>
          作品に登場するキャラクターの名前や能力、物語のモチーフ。その背景にある元ネタを知ることで、作品の見え方は少しずつ変わっていきます。
        </p>
        <p>
          何気なく見ていた設定に意味を見つけたり、キャラクター同士の関係に新しいつながりを発見したり。元ネタを知ることは、作品をこれまでとは違った角度から楽しむきっかけになります。
        </p>
        <h3>点と点がつながる楽しさ</h3>
        <p>
          教養を身につける面白さのひとつは、知識が増えることだけではなく、それまで別々だと思っていた知識同士が、あるとき突然つながることにあると思います。
        </p>
        <p>
          昔読んだ神話が、好きなゲームのキャラクターの由来だった。歴史上の出来事が、漫画の世界観や物語の背景と重なっていた。ある作品をきっかけに知ったことが、別の作品を楽しむ手がかりになる。
        </p>
        <p>
          そうした点と点がつながる経験は、知ることそのものの楽しさであり、世界の見え方を広げてくれるものです。
        </p>
        <p>
          作品を楽しむことと、教養を深めることは、決して別々のものではありません。知識が増えるほど、作品を楽しむための視点や文脈も増えていくはずです。
        </p>
        <h3>作品と知識を行き来できる場所に</h3>
        <p>
          {site.name}
          では、好きなキャラクターや作品から元ネタを知るだけでなく、神話や伝承、歴史上の人物や出来事から、それらをモチーフにした作品に出会うこともできる場所を目指しています。
        </p>
        <p>
          ひとつの知識から別の知識へ、そしてまた作品へ。興味の赴くままに行き来することで、思いがけない発見や新しい興味が生まれる。
        </p>
        <p>
          知識を一方的に学ぶための場所ではなく、作品をきっかけに知り、知ったことを通じてまた作品を楽しむ。そんな循環を生み出したいと考えています。
        </p>
        <p>
          {site.name}
          が、作品とその背景にある文化や知識をつなぎ、新しい発見や楽しみ方に出会える場所になれば幸いです。
        </p>
      </Section>
      <Section title="タネトモの仲間たち" id="crew">
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
