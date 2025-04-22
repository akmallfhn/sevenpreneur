/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "static.wixstatic.com",
                port: "",
            }
        ]
    }
};

export default nextConfig;
