import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // New explicit caching model in Next 16
  cacheComponents: true, // "use cache" support, completes PPR.

  // React Compiler (stable in Next 16)
  reactCompiler: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },

  // Turbopack is the default bundler now; keep Turbopack-specific tweaks here.
  turbopack: {
    /*resolveAlias: {
          'better-sqlite3': { browser: require.resolve('./stubs/empty.ts') },
        },*/
  },

  experimental: {
    // Server Actions config still lives here in 16
    serverActions: {
      bodySizeLimit: '50mb',
      // allowedOrigins: ['my-proxy.com', '*.my-proxy.com'], // optional
    },

    // Turbopack filesystem cache (beta) — big DX win, safe to enable for dev
    turbopackFileSystemCacheForDev: true,
    // Flip on for builds if you want to experiment in CI as well:
    // turbopackFileSystemCacheForBuild: true, // beta :contentReference[oaicite:3]{index=3}

    // Optional: React View Transitions integration (still experimental)
    viewTransition: true,
  },
};

export default nextConfig;
