/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.comgate.cz',
      },
    ],
  },
  transpilePackages: [
    '@najit-najist/ui',
    '@najit-najist/api',
    '@najit-najist/database',
    '@najit-najist/schemas',
    '@najit-najist/email-templates',
    '@najit-najist/tailwind-plugin',
  ],
  webpack(config, { isServer, webpack, nextRuntime }) {
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

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      })
    );

    if (nextRuntime === 'edge') {
      config.resolve.fallback = {
        crypto: false,
      };
    }

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
