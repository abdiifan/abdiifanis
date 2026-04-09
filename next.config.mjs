 /** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Removed deprecated options
  serverExternalPackages: [
    '@polymarket/clob-client',
    // Add any other packages that need to run only on the server here
  ],
  // swcMinify is now enabled by default and cannot be disabled this way
}

export default nextConfig
