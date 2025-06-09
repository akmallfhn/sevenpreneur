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
                hostname: "thumbor.prod.vidiocdn.com",
                port: "",
            }
        ]
    },
    experimental: {
      serverActions: {
        allowedOrigins: [
          // TODO: Add local/production URL automatically
          'www.example.com:3000'
        ]
      }
    }
};

export default nextConfig;
