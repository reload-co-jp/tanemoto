import type { Metadata, Viewport } from "next"
import { ReactNode } from "react"
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { AdSenseScript, Analytics } from "@/components/seo/Analytics"
import { buildMetadata } from "@/lib/seo"
import { assetPath, site } from "@/lib/site"
import { Style } from "@/lib/styles/css"
import { globalCss } from "@/lib/styles/global"
import { color } from "@/lib/styles/theme"

export const metadata: Metadata = {
  ...buildMetadata({ path: "/" }),
  applicationName: site.name,
  icons: {
    icon: [{ url: assetPath("/favicon.svg"), type: "image/svg+xml" }],
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
        href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Zen+Maru+Gothic:wght@500;700;900&display=swap"
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
      <SiteFooter />
      <Analytics />
      <AdSenseScript />
    </body>
  </html>
)

export default RootLayout
