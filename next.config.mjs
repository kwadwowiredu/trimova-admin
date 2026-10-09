/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    /**
     * next/image refuses any host not listed here, which is why a real avatar
     * threw where the old mock ones (pravatar, unsplash) didn't.
     *
     * Scoped to the public storage path rather than the whole project host, so
     * a signed or private URL can't be proxied through the image optimiser by
     * accident.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
