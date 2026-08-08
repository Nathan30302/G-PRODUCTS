/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" }
    ],
    // Uploaded photos are served from /api/media or /uploads
    localPatterns: [
      { pathname: "/uploads/**" },
      { pathname: "/api/media/**" },
      { pathname: "/brand/**" }
    ]
  }
};

export default nextConfig;
