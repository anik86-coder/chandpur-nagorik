/** @type {import('next').NextConfig} */

const nextConfig = {
  serverExternalPackages: ["sharp"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "d2vneetxm2xhbc.cloudfront.net",
      },
    ],
  },
};

module.exports = nextConfig;