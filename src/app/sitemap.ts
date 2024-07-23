import { MetadataRoute } from 'next';
import { getURL } from '@/utils/helpers';
import { getAllPosts } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const allPosts = await getAllPosts();
    const posts = allPosts.map((post) => ({
        url: `${getURL()}/posts/${post.slug}`,
        lastModified: new Date(post.date).toISOString()
    }));

    return [
        {
            url: `${getURL()}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1
        },
        {
            url: `${getURL()}/pages/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${getURL()}/posts`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: `${getURL()}/tags`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: `${getURL()}/categories`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        {
            url: `${getURL()}/authors`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        },
        ...posts
    ];
}
