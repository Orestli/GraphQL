const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@components": path.join(__dirname, "src/components"),
      "@services": path.join(__dirname, "src/services"),
      "@graphql": path.join(__dirname, "src/graphql")
    };

    return config;
  },
  reactStrictMode: true
}

module.exports = nextConfig
