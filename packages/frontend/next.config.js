/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone only for production build (Docker); dev server can 404 with it on some setups
  ...(process.env.NODE_ENV === "production" && { output: "standalone" }),
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"}/:path*`,
      },
    ];
  },
};

if (process.env.NODE_ENV === "development") {
  console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
}

module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  ...nextConfig,
};
