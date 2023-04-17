/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
  transpilePackages: ['@najitnajist/ui', '@najitnajist/api'],
  webpack(config, { isServer }) {
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
