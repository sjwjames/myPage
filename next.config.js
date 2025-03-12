/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/myPage', // Replace 'myPage' with your repository name
}

module.exports = nextConfig 