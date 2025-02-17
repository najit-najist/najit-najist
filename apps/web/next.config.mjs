import withBundleAnalyzer from '@next/bundle-analyzer';

const isProduction = process.env.NODE_ENV === 'production';

process.title = 'najit-najist.cz';

process.env.BUILD_TIMESTAMP = Date.now().toString();

/** @type {import('next').NextConfig} */
let nextConfig = {
  // reactStrictMode: true,
  output: process.env.STANDALONE === 'true' ? 'standalone' : undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.comgate.cz',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    '@najit-najist/comgate',
    '@najit-najist/database',
    '@najit-najist/packeta',
    '@najit-najist/schemas',
    '@najit-najist/security',
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
      },
    );

    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      }),
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
      {
        source: '/eshop',
        destination: '/produkty',
        permanent: false,
      },
      {
        source: '/e-shop',
        destination: '/produkty',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          {
            key: 'Access-Control-Allow-Origin',
            value: isProduction ? 'najitnajist.cz' : '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          },
          // {
          //   key: 'Access-Control-Allow-Headers',
          //   value:
          //     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          // },
        ],
      },
    ];
  },
};

if (process.env.ANALYZE === 'true') {
  nextConfig = withBundleAnalyzer(nextConfig);
}

export default nextConfig;
