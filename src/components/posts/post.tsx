'use client';

import { Fragment, useEffect } from 'react';
import BackBlogs from '@/components/posts/back-posts';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { badgeVariants } from '@/components/ui/badge';
import { Article, Container } from '@/components/craft';
import { Comments } from '@/components/comments/comment-thread';
import PostShare from '@/components/posts/post-share';
import { LucideEye } from 'lucide-react';
import Claps from '@/components/posts/claps';
import { CiTimer } from 'react-icons/ci';
import { readingTime } from '@/utils/word-counter.util';
import { Post as PostType, Author, Category, FeaturedMedia, Tag } from '@/lib/blog.d';

export default function Post({
    post,
    author,
    date,
    featuredMedia,
    category,
    tags
}: {
    post: PostType;
    author: Author;
    date: string;
    featuredMedia: FeaturedMedia;
    category: Category;
    tags: Tag[];
}) {
    useEffect(() => {
        const incrementView = async () => {
            try {
                const postId = post.id;
                if (isNaN(postId)) {
                    console.error('Invalid post ID');
                    return;
                }

                await fetch('/api/increment-view', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ postId })
                });
            } catch (error) {
                console.error('Failed to increment view:', error);
            }
        };

        if (post.id) {
            incrementView();
        }
    }, [post.id]);

    return (
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
                className="prose lg:prose-xl max-w-[100%] dark:prose-invert"
            />

            <Comments postId={String(post.id)} />

            <div className="sticky bottom-6 inset-x-0 text-center">
                <div className="inline-block bg-white shadow-md rounded-full py-3 px-4 text-sm text-gray-500 dark:bg-secondary">
                    <div className="flex items-center gap-x-1.5">
                        <PostShare title={post.title} slug={post.slug} tags={tags} />

                        {post.views && (
                            <Fragment>
                                <div className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-500"></div>
                                <div className="hs-tooltip inline-block">
                                    <button
                                        type="button"
                                        className="hs-tooltip-toggle flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-200 dark:hover:text-gray-300"
                                    >
                                        <LucideEye className="flex-shrink-0 size-4" />
                                        {post.views} views
                                        <span
                                            className="hs-tooltip-content opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white dark:text-neutral-200 rounded shadow-sm"
                                            role="tooltip"
                                        >
                                            Views
                                        </span>
                                    </button>
                                </div>
                            </Fragment>
                        )}

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
        </Container>
    );
}
