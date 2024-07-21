import {
    getPostBySlug,
    getFeaturedMediaById,
    getAuthorById,
    getCategoryById,
    getTagsByPost
} from '@/lib/blog';

import { Section, Container, Article, Main } from '@/components/craft';
import { Metadata } from 'next';
import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import Link from 'next/link';
import Balancer from 'react-wrap-balancer';
import { ShareButtons } from '@/components/share-buttons';

export async function generateMetadata({
    params
}: {
    params: { slug: string };
}): Promise<Metadata> {
    const post = await getPostBySlug(params.slug);
    return {
        title: post.title,
        description: post.excerpt
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
            <Container>
                <h1>
                    <Balancer>
                        <span dangerouslySetInnerHTML={{ __html: post.title }}></span>
                    </Balancer>
                </h1>

                <div className="flex justify-between items-center gap-4 text-sm mb-4">
                    <h5>
                        Published {date} by{' '}
                        {author.name && (
                            <span>
                                <a href={`/posts/?author=${author.id}`}>{author.name}</a>{' '}
                            </span>
                        )}
                    </h5>
                    <Link
                        href={`/posts/?category=${category.id}`}
                        className={cn(badgeVariants({ variant: 'outline' }), 'not-prose')}
                    >
                        {category.name}
                    </Link>
                </div>
                <div className="h-96 my-12 md:h-[560px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
                    {/* eslint-disable-next-line */}
                    <img className="w-full" src={featuredMedia.source_url} alt={post.title} />
                </div>
                <Article dangerouslySetInnerHTML={{ __html: post.content }} />
                <ShareButtons shareUrlSource={``} title={post.title} tags={tags} />
            </Container>
        </Section>
    );
}