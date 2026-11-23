/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.GITHUB_PAGES === "true" ? "/rooc-buildmeapp" : "",
  trailingSlash: true,
};

export default nextConfig;
