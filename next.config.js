/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://tapioca-solutions.vercel.app',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
