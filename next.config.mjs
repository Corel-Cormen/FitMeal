/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/FitMeal',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig