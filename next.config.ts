/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com'
    ]
  },
  experimental: {
    appDir: true,
  }
};

export default nextConfig;