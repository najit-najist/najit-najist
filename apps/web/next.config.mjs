/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
    serverActions: true,
  },
  transpilePackages: [
    '@najitnajist/ui',
    '@najitnajist/api',
    '@najitnajist/pb',
    '@najitnajist/email-templates',
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
