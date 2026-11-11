/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 5120/6000: los encabezados de categoría (panorámica 6:1 en cover) se pintan a ~2600 px de ancho
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840, 5120, 6000],
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }] },
  // The old catalog URL now lives in the store
  async redirects() {
    return [{ source: '/catalogo', destination: '/tienda', permanent: false }];
  },
};
export default nextConfig;
