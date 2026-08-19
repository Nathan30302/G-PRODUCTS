/** @type {import('next').NextConfig} */
const nextConfig = {
  // Helps recover from version skew after Railway redeploys (stale tabs).
  deploymentId:
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    process.env.RAILWAY_DEPLOYMENT_ID ||
    undefined,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/media/:path*"
      }
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  }
};

export default nextConfig;
