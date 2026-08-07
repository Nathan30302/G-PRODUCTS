/** @type {import('next').NextConfig} */
const nextConfig = {
  // Helps clients recover after redeploys (version skew / stale Server Actions)
  deploymentId:
    process.env.RAILWAY_GIT_COMMIT_SHA ||
    process.env.RAILWAY_DEPLOYMENT_ID ||
    undefined,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  }
};

export default nextConfig;
