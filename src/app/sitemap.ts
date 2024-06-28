import { MetadataRoute } from 'next';
import { getURL } from '@/utils/helpers';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${getURL()}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1
        },
        {
            url: `${getURL()}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8
        },
        {
            url: `${getURL()}/posts`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.5
        }
    ];
}
