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
  experimental: {
    serverActions: {
      allowedOrigins: [
        "www.sevenpreneur.com",
        "www.example.com:3000",
      ],
    },
  },
};

export default nextConfig;
