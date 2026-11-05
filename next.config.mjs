/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] },
  // The old catalog URL now lives in the store
  async redirects() {
    return [{ source: '/catalogo', destination: '/tienda', permanent: false }];
  },
};
export default nextConfig;
