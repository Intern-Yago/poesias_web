const { execSync } = require('child_process')

// Ensure Prisma Client is generated before Next.js builds pages
try {
  console.log('Generating Prisma Client in next.config.js...')
  execSync('npx prisma generate', { stdio: 'inherit' })
} catch (error) {
  console.error('Prisma generate in next.config.js encountered an issue:', error)
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig

