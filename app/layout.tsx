import type { Metadata, Viewport } from "next"
import { ReactNode } from "react"
import { AdSlot } from "@/components/common/AdSlot"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { AdSenseScript, Analytics } from "@/components/seo/Analytics"
import { buildMetadata } from "@/lib/seo"
import { assetPath, site } from "@/lib/site"
import { Style } from "@/lib/styles/css"
import { globalCss } from "@/lib/styles/global"
import { color } from "@/lib/styles/theme"

const asciiGlyphs = Array.from({ length: 95 }, (_, i) =>
  String.fromCharCode(32 + i)
).join("")

export const metadata: Metadata = {
  ...buildMetadata({ path: "/" }),
  applicationName: site.name,
  icons: {
    icon: [
      { url: assetPath("/favicon.ico"), sizes: "48x48" },
      { url: assetPath("/favicon-96.png"), sizes: "96x96", type: "image/png" },
    ],
    apple: assetPath("/apple-touch-icon.png"),
  },
  verification: site.gscVerification
    ? { google: site.gscVerification }
    : undefined,
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: color.accent,
  width: "device-width",
  initialScale: 1,
}

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html lang="ja">
    <body>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@400;500;700;800;900&display=swap"
        precedence="default"
      />
      {/* 欧文装飾用。和文（かな）は M PLUS 1 で表示するため ASCII だけに絞る */}
      <link
        rel="stylesheet"
        href={`https://fonts.googleapis.com/css2?family=Cherry+Bomb+One&display=swap&text=${encodeURIComponent(asciiGlyphs)}`}
        precedence="default"
      />
      <Style id="global" precedence="base">
        {globalCss}
      </Style>
      <a href="#main" className="t-skip">
        本文へスキップ
      </a>
      <SiteHeader />
      <main id="main" className="t-main">
        <div className="t-container">{children}</div>
      </main>
      {/* 全ページ共通のディスプレイ広告（フッター直前） */}
      <div className="t-container">
        <AdSlot slot={site.adSlots.common} />
      </div>
      <SiteFooter />
      <Analytics />
      <AdSenseScript />
    </body>
  </html>
)

export default RootLayout
