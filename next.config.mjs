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
            }
        ]
    }
};

export default nextConfig;
