/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        missingSuspenseWithCSRBailout: false
    },
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'wp.9d8.dev',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'hzmdqhzfvhihhvjxzxzu.supabase.co',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

export default nextConfig;
