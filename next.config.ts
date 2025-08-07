import type { NextConfig } from "next";

const nextConfig:NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env:{
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY
  }
}

module.exports = nextConfig