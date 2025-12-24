import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd2ft5bvi4f9u8o.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 't1.daumcdn.net',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    const cspHeader = [
      "default-src 'self';",

      // [Script]
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://dapi.kakao.com https://t1.daumcdn.net https://*.daumcdn.net;",

      // [Style]
      "style-src 'self' 'unsafe-inline';",

      // [Image]
      "img-src 'self' data: https://t1.daumcdn.net https://*.daumcdn.net https://map.kakao.com https://*.amazonaws.com https://*.cloudfront.net;",

      // [Font]
      "font-src 'self' data:;",

      "connect-src 'self' https://api.yogiattacku.shop https://yogiattacku.n-e.kr https://dapi.kakao.com https://*.kakao.com https://*.daum.net https://t1.daumcdn.net https://*.daumcdn.net https://*.amazonaws.com https://*.cloudfront.net;",
    ].join(" ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;