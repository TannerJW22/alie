import type { NextConfig } from 'next';

const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isGitHubPages ? '/alie' : '',
  trailingSlash: false,
  images: { unoptimized: true },
};

export default nextConfig;
