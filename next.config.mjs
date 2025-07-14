/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "tskubmriuclmbcfmaiur.supabase.co",
        port: "",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*",
        has: [
          {
            type: "header",
            key: "host",
            value: "www.(sevenpreneur|example).com.*",
          },
        ],
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=600, must-revalidate",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "header",
            key: "host",
            value: "(agora|admin).sevenpreneur.com.*",
          },
        ],
        missing: [
          {
            type: "cookie",
            key: "session_token",
          },
        ],
        destination: "https://www.sevenpreneur.com/auth/login",
        basePath: false,
        permanent: false,
      },
      {
        source: "/(.*)",
        has: [
          {
            type: "header",
            key: "host",
            value: "(agora|admin).example.com:3000.*",
          },
        ],
        missing: [
          {
            type: "cookie",
            key: "session_token",
          },
        ],
        destination: "https://www.example.com:3000/auth/login",
        basePath: false,
        permanent: false,
      },
      {
        source: "/auth(.*)",
        has: [
          {
            type: "header",
            key: "host",
            value: "www.(sevenpreneur|example).com.*",
          },
          {
            type: "cookie",
            key: "session_token",
            value: undefined,
          },
        ],
        destination: "/",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/(admin|agora|api|www)",
          destination: "/_not-found/page",
        },
      ],
      afterFiles: [
        {
          source: "/:path*",
          has: [
            {
              type: "header",
              key: "host",
              value: "(?<subdomain>[^.]+).(sevenpreneur|example).com.*",
            },
          ],
          destination: "/:subdomain/:path*",
        },
        {
          source: "/:path*",
          has: [
            {
              type: "header",
              key: "host",
              value: "(sevenpreneur|example).com.*",
            },
          ],
          destination: "/www/:path*",
        },
        {
          source: "/:path*",
          has: [
            {
              type: "header",
              key: "host",
              value: "sevenpreneur(-[^.]+).vercel.app.*",
            },
          ],
          destination: "/www/:path*",
        },
      ],
    };
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["www.sevenpreneur.com", "www.example.com:3000"],
    },
  },
};

export default nextConfig;
