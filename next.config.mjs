import withPWA from 'next-pwa';

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
                hostname: 'hzmdqhzfvhihhvjxzxzu.supabase.co',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**'
            }
        ]
    }
};

const config = withPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    sw: '/worker/index.ts' // Path to your custom service worker
})(nextConfig);

export default config;
