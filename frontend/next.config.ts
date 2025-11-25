/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // ← This enables static export (replaces next export command)
  trailingSlash: true,  // Optional: Helps with routing on static hosts like Render
  images: {
    unoptimized: true  // Required for static export (disables Next.js image optimization)
  },
  // If you have dynamic routes (e.g., /dashboard/analysis/[id]), add:
  // generateStaticParams: async () => { /* logic if needed */ }
};

module.exports = nextConfig;