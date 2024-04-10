/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
          {
            hostname: "**",
          },
        ],
      }
};

export default nextConfig;
