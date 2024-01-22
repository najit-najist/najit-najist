/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
    serverActions: true,
  },
  transpilePackages: [
    '@najit-najist/ui',
    '@najit-najist/api',
    '@najit-najist/pb',
    '@najit-najist/email-templates',
    '@najit-najist/tailwind-plugin',
  ],
  webpack(config, { isServer }) {
    config.externals.push('pino-pretty', 'thread-stream', 'encoding');
    config.module.rules.push(
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(mp4|webm|ogg|swf|ogv)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: `/_next/static/videos/`,
              outputPath: `${isServer ? '../' : ''}static/videos/`,
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      }
    );

    return config;
  },
  async rewrites() {
    const pocketbaseOrigin = String(process.env.POCKETBASE_ORIGIN);
    console.log({ pocketbaseOrigin });

    return [
      {
        source: '/files/:path*',
        destination: `${pocketbaseOrigin}/api/files/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/najit-najist/najit-najist',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
