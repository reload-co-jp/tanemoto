# トモタネ

> 物語、キャラクターの元をたどる。

アニメ・漫画などのエンタメ作品を入口に、キャラクター・能力・武器・世界観の背景にある神話・伝承を、原典と研究にもとづいて解説する知識メディアです。記事中の主張ごとに「事実／学説／異伝／創作／考察」を区別し、出典と該当箇所を示します。

## 基本構成：キャラクターから元ネタへ

サイトの基本単位は**作品のキャラクター**です。各キャラクターは次の順で説明します。

1. **キャラクター名**（作品での位置づけ：CREATIVE）
2. **名前の由来**（確認できる場合のみ）
3. **モチーフ（元ネタ）**：名前・称号・外見・能力・武器・立場などの要素ごとに「作品では」と「原典の神話では」を並べる
4. **元ネタの神話・物語**（人物・怪物ページ、解説記事へ）
5. **作品と原典の違い・共通点**（EDITORIAL が中心）
6. **根拠と出典**

神話の解説記事・人物ページ・作品ページにも、そのモチーフが登場するキャラクターの「元ネタ早見」が自動で表示されます。

逆方向（神話 → キャラクター）は `/origins/`（神話から逆引き）と各人物・怪物ページで引けます。キャラクターの `motifs[].figureId` を指定すれば自動で反映されます。

記事は「キャラクターの元ネタ」カテゴリー（`character-origins`）を基本とし、`characterIds` でキャラクターを指定して「キャラクター紹介 → 元ネタの神話 → 作品と原典の違い」の順に書きます。

## 技術スタック

- **Next.js 16**（App Router / Static Export）・**React 19**・**TypeScript**
- スタイル：ゼロランタイムの CSS-in-JS（`lib/styles/css.tsx`。React 19 の `<style href precedence>` で `<head>` に重複なく出力）。Tailwind CSS は不使用
- コンテンツ：`content/` 以下の JSON（DB・CMS なし）
- バリデーション：zod ＋ 独自の整合性チェック（`pnpm validate`）
- 検索：ビルド時に生成する静的インデックス（`/search-index.json`）
- デプロイ：GitHub Actions → GitHub Pages

## スクリプト

| コマンド         | 説明                                            |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | 開発サーバーを起動                              |
| `pnpm validate`  | コンテンツの検証（`pnpm build` 前にも自動実行） |
| `pnpm build`     | 静的サイトをビルド（`out/` に出力）             |
| `pnpm test`      | テスト（バリデーション・検索・テキスト処理）    |
| `pnpm lint`      | ESLint                                          |
| `pnpm typecheck` | TypeScript の型チェック                         |
| `pnpm format`    | Prettier で整形（`format:check` で確認のみ）    |

## ディレクトリ構成

```
content/                 記事・人物などのデータ（JSON）
  articles/              記事（1ファイル1記事。ファイル名 = slug）
  figures/               人物・怪物
  mythologies/           神話体系
  stories/               物語（エピソード）
  works/                 作品
  characters/            作品のキャラクター（作品ごとのサブフォルダ可。ファイル名 = slug）
  topics/                テーマ
  categories/            記事カテゴリー
  sources/               出典（原典・研究書・Web）
  images/                画像のメタデータ（出典・作者・ライセンス）
  home.json              トップページの注目記事・人気記事
app/                     ページ（ルーティング）
components/              UI コンポーネント
lib/content/             スキーマ・読み込み・検証・関連付けロジック
lib/styles/              デザイントークン・CSS-in-JS
scripts/validate-content.ts
public/                  静的ファイル（画像・favicon・OGP 画像）
```

## ページ

| パス                                                        | 内容                                   |
| ----------------------------------------------------------- | -------------------------------------- |
| `/`                                                         | トップ                                 |
| `/articles/`                                                | 記事一覧（`/articles/page/N/` で続き） |
| `/articles/category/[slug]/`                                | カテゴリー別一覧                       |
| `/articles/tag/[tag]/`                                      | タグ別一覧（noindex）                  |
| `/articles/[slug]/`                                         | 記事詳細                               |
| `/figures/`・`/figures/[slug]/`                             | 人物・怪物                             |
| `/mythologies/`・`/mythologies/[slug]/`                     | 神話体系                               |
| `/topics/`・`/topics/[slug]/`                               | テーマ                                 |
| `/works/`・`/works/[slug]/`                                 | 作品                                   |
| `/search/`                                                  | サイト内検索（noindex）                |
| `/about/`・`/about/editorial-policy/`・`/about/references/` | 運営者情報・編集方針・参考文献         |
| `/sitemap.xml`・`/robots.txt`・`/search-index.json`         | ビルド時に自動生成                     |

## 記事の追加方法

プログラムの修正は不要です。JSON を追加して `pnpm validate` を実行します。

1. `content/articles/<slug>.json` を作成（`slug` はファイル名と一致させる。半角英小文字・数字・ハイフン）
2. 使う出典が `content/sources/` になければ追加
3. 関連する人物・物語・テーマ・作品の ID を記事の `figureIds` などに指定
4. `pnpm validate` でエラーがないことを確認
5. 公開する場合は `"status": "published"`（下書きは `"draft"`。ビルドに含まれない）

記事一覧・カテゴリー・タグ・人物／神話／テーマ／作品ページの関連記事・関連記事レコメンド・サイトマップ・検索インデックスは自動で反映されます。

### 記事 JSON の例

```json
{
  "id": "medusa",
  "slug": "medusa",
  "title": "メデューサとは？ゴルゴンの伝承",
  "description": "160字以内の説明（meta description）",
  "lead": "リード文（省略時は description）",
  "category": "monsters",
  "tags": ["メデューサ", "ゴルゴン"],
  "publishedAt": "2026-11-17",
  "updatedAt": "2026-11-17",
  "status": "published",
  "figureIds": ["medusa"],
  "mythologyIds": ["greek"],
  "storyIds": ["perseus-medusa"],
  "workIds": [],
  "topicIds": ["monsters"],
  "sourceIds": ["hesiod-theogony"],
  "body": [
    { "type": "heading", "level": 2, "text": "見出し", "anchor": "basics" },
    {
      "type": "paragraph",
      "text": "本文。**強調** や [リンク](/articles/pegasus/) が使える。",
      "claimIds": ["medusa-gorgon-sisters"]
    }
  ],
  "claims": [
    {
      "id": "medusa-gorgon-sisters",
      "text": "ゴルゴンはポルキュスとケトの娘で三姉妹である。",
      "classification": "fact",
      "sourceIds": ["hesiod-theogony"],
      "sourceLocation": "『神統記』270–276行",
      "verificationStatus": "verified"
    }
  ]
}
```

### 本文ブロック

| type        | 用途                                                                |
| ----------- | ------------------------------------------------------------------- |
| `heading`   | 見出し（`level`: 2 / 3）。目次に自動で載る                          |
| `paragraph` | 段落。`claimIds` で根拠となる主張を紐づけると情報区分ラベルを表示   |
| `list`      | 箇条書き（`ordered: true` で番号付き）                              |
| `quote`     | 引用（`sourceId`・`location` 必須。訳者の注記は `translationNote`） |
| `note`      | 情報区分付きの囲み記事（`classification` 必須）                     |
| `image`     | 画像（`content/images/` に登録した ID を指定）                      |

### 情報区分（classification）

| 値            | ラベル      | 意味                   | 出典         |
| ------------- | ----------- | ---------------------- | ------------ |
| `fact`        | FACT        | 史料等で確認できる事実 | 必須         |
| `scholarship` | SCHOLARSHIP | 学術的な説・解釈       | 必須         |
| `variant`     | VARIANT     | 異なる伝承・異説       | 必須         |
| `creative`    | CREATIVE    | 作品独自の創作         | 推奨（作品） |
| `editorial`   | EDITORIAL   | 筆者の考察             | 任意         |

Claim の ID は全記事で一意にします（`<記事slug>-<名前>` を推奨）。

### バリデーションで検出するもの

- JSON の構文エラー・必須項目の不足・型の誤り・ファイル名と slug の不一致
- 存在しない関連 ID（人物・神話・物語・作品・テーマ・出典・画像・カテゴリー）
- 出典のない `fact` / `scholarship` / `variant` の主張、該当箇所の未記入（警告）
- 公開記事に含まれる `unverified` の主張、本文が参照する存在しない主張
- 記事の `sourceIds` に含まれていない出典の使用
- ID・slug・見出しアンカーの重複、予約語 slug（`page` / `category` / `tag`）

## キャラクターの追加方法

`content/characters/<作品>/<slug>.json` を作成します。作品の設定は `creative`（出典は作品）、原典の内容は `fact` など出典付きの主張で根拠を示します。`motifs[].inMyth` には出典付きの主張が必須です。

```json
{
  "id": "saint-seiya-seiya",
  "slug": "saint-seiya-seiya",
  "name": "星矢",
  "reading": "せいや",
  "workId": "saint-seiya",
  "description": { "text": "作品での位置づけ", "claimIds": ["ss-seiya-work"] },
  "nameOrigin": {
    "text": "名前の由来（確認できる場合のみ）",
    "claimIds": ["..."]
  },
  "motifs": [
    {
      "aspect": "title",
      "figureId": "pegasus",
      "label": "ペガサス（天馬）",
      "inWork": { "text": "作品では…", "claimIds": ["ss-seiya-work-pegasus"] },
      "inMyth": { "text": "原典では…", "claimIds": ["ss-seiya-myth-birth"] }
    }
  ],
  "comparison": [
    { "text": "作品と原典の違い", "claimIds": ["ss-seiya-cmp-horse"] }
  ],
  "claims": [],
  "sourceIds": ["work-saint-seiya", "hesiod-theogony"]
}
```

`aspect` は `name`（名前）・`title`（称号）・`appearance`（外見）・`ability`（能力）・`weapon`（武器・道具）・`role`（立場）・`personality`（性格）・`episode`（エピソード）・`setting`（設定）。最初のモチーフが「主な元ネタ」になります。記事側で `characterIds` を指定すると、記事冒頭にそのキャラクターの元ネタ早見が表示されます。

### 画像

`public/images/...` にファイルを置き、`content/images/` にメタデータを登録します。出典・作者・ライセンス・クレジットは必須です。

```json
{
  "id": "medusa-caravaggio",
  "src": "/images/articles/medusa.jpg",
  "width": 1200,
  "height": 675,
  "alt": "代替テキスト",
  "source": "所蔵館・出典",
  "sourceUrl": "https://...",
  "author": "作者",
  "license": "Public Domain",
  "credit": "クレジット表記",
  "aiGenerated": false
}
```

画像が未登録の記事は、主な人物名を使ったタイポグラフィのアイキャッチが自動で表示されます。アニメ・漫画の公式画像や書籍の図版は無断で使用しないでください。

## 編集方針（コンテンツ作成時の注意）

- 原典・研究資料を実際に確認してから書く。架空の出典・未確認の引用を登録しない
- 主張には出典と該当箇所（行番号・巻章節）を付ける
- 作品と神話の関係を根拠なく断定しない（作品の設定は `creative`）
- 古典の年代は「頃」「諸説あり」と幅をもたせる

## 環境変数・デプロイ

GitHub Actions（`.github/workflows/deploy.yml`）で `main` への push 時に GitHub Pages へデプロイします。Settings → Pages の Source を「GitHub Actions」にしてください。以下はリポジトリの Actions Variables で設定できます（未設定なら既定値）。

| 変数                                            | 既定値 / 説明                                              |
| ----------------------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                          | `https://tanetomo.reload.co.jp`（canonical・OGP・sitemap） |
| `NEXT_PUBLIC_BASE_PATH`                         | 空（ルート直下）。サブパスで公開する場合のみ指定           |
| `NEXT_PUBLIC_GA_ID`                             | GA4 測定 ID。未設定なら計測タグを出力しない                |
| `NEXT_PUBLIC_ADSENSE_CLIENT`                    | AdSense の `ca-pub-...`。未設定なら広告を出力しない        |
| `NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE` / `_SIDEBAR` | 記事末尾・サイドバーの広告ユニット ID                      |
| `NEXT_PUBLIC_ADSENSE_SLOT_COMMON`               | 全ページ下部の共通広告ユニット ID（既定 `4829146611`）     |
| `NEXT_PUBLIC_GSC_VERIFICATION`                  | Search Console の所有権確認トークン                        |

> 独自ドメイン `tanetomo.reload.co.jp` は `public/CNAME` で設定。DNS に `reload-co-jp.github.io` への CNAME レコードを追加し、Settings → Pages の Custom domain に同じドメインを設定してください。

## ライセンス

ISC
