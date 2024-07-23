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
import BackBlogs from '@/components/posts/back-posts';
import { readingTime } from '@/utils/word-counter.util';
import { Fragment } from 'react';
import { LucideEye } from 'lucide-react';
import { CiTimer } from 'react-icons/ci';
import Claps from '@/components/posts/claps';
import PostShare from '@/components/posts/post-share';
import { CommentForm } from '@/components/comments/comment-form';
import { Comments } from '@/components/comments';

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
                <BackBlogs />
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
                {/*<div className="inline-block relative before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2">
                    {readingTime(post.content)} min read
                </div>*/}
                <div className="h-96 my-12 md:h-[560px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
                    {/* eslint-disable-next-line */}
                    <img className="w-full" src={featuredMedia.source_url} alt={post.title} />
                </div>
                <Article
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className="prose lg:prose-xl max-w-[600px] dark:prose-invert"
                />

                <Comments
                    comments={[
                        {
                            id: 'first',
                            name: 'John Doe',
                            email: 'johndoe@gmail.com',
                            created_at: new Date().toISOString(),
                            comment: 'AI is the future'
                        }
                    ]}
                />
                <CommentForm id={String(post.id)} />

                <div className="sticky bottom-6 inset-x-0 text-center">
                    <div className="inline-block bg-white shadow-md rounded-full py-3 px-4 text-sm text-gray-500 dark:bg-secondary">
                        <div className="flex items-center gap-x-1.5">
                            <PostShare {...post} />

                            {/*{post?.analytics?.views && (*/}
                            {/*    <Fragment>*/}
                            {/*        <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-500"></div>*/}
                            {/*        <div className="hs-tooltip inline-block">*/}
                            {/*            <button*/}
                            {/*                type="button"*/}
                            {/*                className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-200 dark:hover:text-gray-300"*/}
                            {/*            >*/}
                            {/*                <LucideEye className="flex-shrink-0 size-4" />*/}
                            {/*                {post.analytics.views} views*/}
                            {/*                <span*/}
                            {/*                    className="hs-tooltip-content opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white dark:text-neutral-200 rounded shadow-sm"*/}
                            {/*                    role="tooltip"*/}
                            {/*                >*/}
                            {/*                    Views*/}
                            {/*                </span>*/}
                            {/*            </button>*/}
                            {/*        </div>*/}
                            {/*    </Fragment>*/}
                            {/*)}*/}

                            <Claps {...post} />

                            <Fragment>
                                <div className="block h-3 border-e border-gray-300 mx-3 mt-4 dark:border-neutral-500"></div>
                                <div className="hs-tooltip inline-block">
                                    <button
                                        type="button"
                                        className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-200 dark:hover:text-gray-300"
                                    >
                                        <CiTimer className="flex-shrink-0 size-4" />
                                        {readingTime(post.content)} min read
                                        <span
                                            className="hs-tooltip-content opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm"
                                            role="tooltip"
                                        >
                                            Reading time
                                        </span>
                                    </button>
                                </div>
                            </Fragment>
                        </div>
                    </div>
                </div>

                {/*<ShareButtons shareUrlSource={``} title={post.title} tags={tags} />*/}
            </Container>
        </Section>
    );
}
