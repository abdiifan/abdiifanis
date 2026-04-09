/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Opt out specific server-only packages from bundling
  // This tells Next.js to use native Node.js `require()` instead of bundling them
  serverExternalPackages: [
    '@polymarket/clob-client',
    'ethers',                    // often needed alongside Polymarket client
    // Add more if you get "Cannot find module" or bundling errors:
    // 'node-telegram-bot-api',
  ],

  // Recommended for production / Docker deployments
  output: 'standalone',

  // Optional: Increase body size limit if you send large payloads (e.g., Claude responses)
  // experimental: {
  //   serverComponentsHmrCache: true, // already default in newer Next
  // },

  // If you use API routes that take time (Claude calls, scanning, etc.)
  // httpAgentOptions: {
  //   keepAlive: true,
  // },
}

module.exports = nextConfig
