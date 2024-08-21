/** @type {import('next').NextConfig} */
const nextConfig = {
    // 添加代码
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: 'res.cloudinary.com',
                port: '',
            }
        ]
    }
};

export default nextConfig;
