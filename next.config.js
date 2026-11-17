/** @type {import('next').NextConfig} */

// GitHub Pages のプロジェクトページで公開する場合は basePath が必要。
// 独自ドメイン（ルート直下）で公開する場合は NEXT_PUBLIC_BASE_PATH="/" を指定する。
// （GitHub Actions の未設定の変数は空文字になるため、空文字は「未指定」として扱う）
const envBasePath = process.env.NEXT_PUBLIC_BASE_PATH
const basePath = envBasePath
  ? envBasePath.replace(/\/$/, "")
  : process.env.NODE_ENV === "production"
    ? "/tanemoto"
    : ""

const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
}

export default nextConfig
