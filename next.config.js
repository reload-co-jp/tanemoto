/** @type {import('next').NextConfig} */

// 独自ドメイン（tanetomo.reload.co.jp）のルート直下で公開するため basePath は空。
// サブパスで公開する場合のみ NEXT_PUBLIC_BASE_PATH="/path" を指定する。
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")

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
