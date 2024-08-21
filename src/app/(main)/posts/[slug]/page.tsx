import {
    getPostBySlug,
    getFeaturedMediaById,
    getAuthorById,
    getCategoryById,
    getTagsByPost
} from '@/lib/blog';

import { Section } from '@/components/craft';
import { Metadata } from 'next';
import Post from '@/components/posts/post';

export async function generateMetadata({
    params
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    const featuredMedia = await getFeaturedMediaById(post.featured_media);

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            url: post.link,
            images: featuredMedia.source_url
                ? [
                      {
                          url: featuredMedia.source_url
                      }
                  ]
                : []
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: featuredMedia.source_url ? [featuredMedia.source_url] : []
        }
    };
}

export default async function Page({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);
    const featuredMedia = await getFeaturedMediaById(post.featured_media);
    const author = await getAuthorById(post.author);
    const date = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const category = await getCategoryById(post.categories[0]);
    const tags = await getTagsByPost(post.id);

    return (
        <Section>
            <Post
                post={post}
                author={author}
                date={date}
                featuredMedia={featuredMedia}
                category={category}
                tags={tags}
            />
        </Section>
    );
}
