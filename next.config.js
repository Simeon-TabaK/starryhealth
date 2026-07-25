/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Désactive la vérification ESLint au moment du build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // (Optionnel) Si vous avez aussi des erreurs TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;