// Craft Imports
import { Section, Container } from '@/components/craft';
import Balancer from 'react-wrap-balancer';

// Components
import Link from 'next/link';

// Icons
import { File, Pen, Tag, Boxes, User, Folder, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import PostCard from '@/components/posts/post-card';
import { getFeaturedPosts, getLatestPosts } from '@/lib/blog';
import { Post } from '@/lib/blog.d';

// This page is using the craft.tsx component and design system
export default async function Home() {
    const featuredPosts = await getFeaturedPosts();
    const latestPosts = await getLatestPosts();

    return (
        <Section>
            <Container>
                <div className="mx-auto max-w-3xl space-y-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                        Discover the Latest Insights
                    </h1>
                    <p className="text-muted-foreground md:text-xl">
                        Explore our collection of thought-provoking articles and stay ahead of the
                        curve.
                    </p>
                    <Button className="text-white" size="lg" variant="default">
                        <Link
                            className="no-underline text-white hover:text-white visited:text-white"
                            href={`/posts`}
                            prefetch={false}
                        >
                            Read the Blog
                        </Link>
                    </Button>
                </div>
                <div className="mx-auto max-w-3xl space-y-6 text-center">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        Featured Posts
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/*<Card>
                            <CardContent>
                                <Image
                                    src="/placeholder.svg"
                                    width={400}
                                    height={225}
                                    alt="Blog Post"
                                    className="aspect-video w-full rounded-lg object-cover"
                                />
                                <div className="space-y-2 py-4">
                                    <h3 className="text-lg font-semibold">
                                        Unlocking the Power of React Hooks
                                    </h3>
                                    <p className="text-muted-foreground line-clamp-3">
                                        Discover how React Hooks can revolutionize your development
                                        workflow and create more efficient, maintainable
                                        applications.
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>
                                    <Link
                                        href="#"
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                        prefetch={false}
                                    >
                                        Read More
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>*/}
                        {featuredPosts.map((post: Post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
                <div className="mx-auto max-w-3xl space-y-6">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        Recent Posts
                    </h2>
                    <div className="grid gap-6">
                        {/*<Card>
                            <CardContent className="grid grid-cols-[100px_1fr] gap-4">
                                <Image
                                    src="/placeholder.svg"
                                    width={100}
                                    height={100}
                                    alt="Blog Post"
                                    className="aspect-square w-full rounded-lg object-cover"
                                />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">
                                        Unleashing the Power of Serverless Functions
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Published on May 15, 2023
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link
                                    href="#"
                                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    prefetch={false}
                                >
                                    Read More
                                </Link>
                            </CardFooter>
                        </Card>*/}
                        {latestPosts.map((post: Post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </Container>
        </Section>
    );
}

// This is just some example JS to demonstrate automatic styling from brijr/craft
const HomeComponent = () => {
    return (
        <article className="prose-m-none">
            <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
                <div className="container px-4 md:px-6">
                    <div className="mx-auto max-w-3xl space-y-6 text-center">
                        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                            Discover the Latest Insights
                        </h1>
                        <p className="text-muted-foreground md:text-xl">
                            Explore our collection of thought-provoking articles and stay ahead of
                            the curve.
                        </p>
                        <Link
                            href="#"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                            prefetch={false}
                        >
                            Read the Blog
                        </Link>
                    </div>
                </div>
            </section>
            <h1>
                <Balancer>Discover the Latest Insights.</Balancer>
            </h1>
            <p className="text-muted-foreground md:text-xl">
                Explore our collection of thought-provoking articles and stay ahead of the curve.
            </p>
            <Link
                prefetch={false}
                className="h-8 inline-flex items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                href="/blogs"
            >
                Read the Blog
                <ArrowRight className="not-prose my-4" />
            </Link>
            <p>
                This is <a href="https://github.com/Kelvince01/quillert">Quillert</a>, created as a
                way to build Supabase with Next.js at rapid speed. This starter is designed with{' '}
                <a href="https://ui.shadcn.com">shadcn/ui</a>,{' '}
                <a href="https://github.com/brijr/craft">brijr/craft</a>, and Tailwind CSS. Use{' '}
                <a href="https://components.bridger.to">brijr/components</a> to build your site with
                prebuilt components. The data fetching and typesafety is handled in{' '}
                <code>lib/blog.ts</code> and <code>lib/blog.d.ts</code>. Questions? Email
                themikrochip1@gmail.com
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-6 not-prose">
                <Link
                    className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
                    href="/posts"
                >
                    <Pen size={32} />
                    <span>
                        Posts{' '}
                        <span className="block text-sm text-muted-foreground">
                            All posts from your WordPress
                        </span>
                    </span>
                </Link>
                <Link
                    className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
                    href="/pages"
                >
                    <File size={32} />
                    <span>
                        Pages{' '}
                        <span className="block text-sm text-muted-foreground">
                            Custom pages from your WordPress
                        </span>
                    </span>
                </Link>
                <Link
                    className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
                    href="/posts/authors"
                >
                    <User size={32} />
                    <span>
                        Authors{' '}
                        <span className="block text-sm text-muted-foreground">
                            List of the authors from your WordPress
                        </span>
                    </span>
                </Link>
                <Link
                    className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
                    href="/posts/tags"
                >
                    <Tag size={32} />
                    <span>
                        Tags{' '}
                        <span className="block text-sm text-muted-foreground">
                            Content by tags from your WordPress
                        </span>
                    </span>
                </Link>
                <Link
                    className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
                    href="/posts/categories"
                >
                    <Boxes size={32} />
                    <span>
                        Categories{' '}
                        <span className="block text-sm text-muted-foreground">
                            Categories from your Supabase DB
                        </span>
                    </span>
                </Link>
                <a
                    className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
                    href="https://github.com/Kelvince01/quillert"
                >
                    <Folder size={32} />
                    <span>
                        Documentation{' '}
                        <span className="block text-sm text-muted-foreground">
                            How to use `quillert`
                        </span>
                    </span>
                </a>
            </div>
        </article>
    );
};
