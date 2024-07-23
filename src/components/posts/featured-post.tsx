import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import DateTooltip, { IDateMode } from '@/components/ui/extensions/date-tooltip';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import PostThumbnail from './post-thumbnail';
import { Post } from '@/lib/blog.d';
import { getAuthorById, getCategoryById, getFeaturedMediaById } from '@/lib/blog';

export const FeaturedPost = async ({ post }: { post: Post }) => {
    const media = await getFeaturedMediaById(post.featured_media);
    const author = await getAuthorById(post.author);
    const date = new Date(post.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    const category = await getCategoryById(post.categories[0]);

    return (
        <div className="bg-gray-100 border-gray-200 border dark:border-gray-800 dark:bg-card_bg rounded-lg p-2 grid grid-cols-12 h-[450px] lg:h-96 not-prose">
            <div className="col-span-12 relative lg:h-full lg:col-span-6">
                <PostThumbnail
                    slug={media.slug}
                    imageSrc={media.source_url as string}
                    className="rounded-lg !h-full w-full object-cover"
                />
            </div>
            <div className="col-span-12 lg:col-span-6 h-full flex flex-col justify-between lg:py-8">
                <div className="flex flex-col lg:flex-col gap-1 lg:gap-2 p-3 lg:p-6 h-full max-w-md">
                    <div className="flex gap-1 lg:gap-2 flex-col h-fit">
                        <div className="flex gap-x-1">
                            <Badge
                                variant="default"
                                radius="rounded"
                                className="w-fit h-fit"
                                key={category.id}
                            >
                                {category.name}
                            </Badge>
                        </div>
                        <DateTooltip
                            className="flex text-gray-500"
                            mode={IDateMode.absolute}
                            date={new Date(post.date as string)}
                        />
                    </div>
                    <Link
                        href={`/posts/${post.slug}`}
                        className="text-lg lg:text-2xl font-bold hover:text-primary/80 transition-all text-start"
                    >
                        {post.title}
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-3 text-start">{post.excerpt}</p>
                    <div className="mt-auto flex gap-x-2">
                        <Avatar className="w-5 h-5 lg:w-9 lg:h-9">
                            <AvatarImage src={``} />
                            <AvatarFallback size={36}>{author.name}</AvatarFallback>
                        </Avatar>
                        <div className="flex lg:flex-col gap-x-2 items-center lg:items-start">
                            <p className="text-sm font-medium">{author.name}</p>
                            <p className="text-xs text-gray-500 group">
                                Editor at{' '}
                                <Link
                                    target="_blank"
                                    href="https://quillert.com"
                                    className="hover:text-primary/80 transition-all group-hover:text-primary/80"
                                >
                                    Quillert
                                    <SquareArrowOutUpRight className="w-2.5 h-2.5 ml-1 hidden group-hover:inline text-primary/80 mb-1" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
