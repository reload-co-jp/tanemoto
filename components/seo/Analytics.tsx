import Script from "next/script"
import { site } from "@/lib/site"

/** GA4。NEXT_PUBLIC_GA_ID が設定されている場合のみ出力する */
export const Analytics = () => {
  if (!site.gaId) return null
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}');`}
      </Script>
    </>
  )
}

/** AdSense の自動広告スクリプト。NEXT_PUBLIC_ADSENSE_CLIENT が設定されている場合のみ出力 */
export const AdSenseScript = () => {
  if (!site.adsenseClient) return null
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClient}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
